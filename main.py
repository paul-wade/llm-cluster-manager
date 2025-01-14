import autogen
from dotenv import load_dotenv
import os
import requests
import sys
import logging
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from config.config import LLM_CONFIG, AGENT_CONFIG, LMSTUDIO_CONFIG, PROJECT_CONFIG
from utils.file_utils import ensure_directory, create_project_structure
from utils.lmstudio_utils import check_generation_status, wait_for_generation

# Configure logging
logging.basicConfig(level=logging.DEBUG if os.getenv('DEBUG') == 'True' else logging.INFO,
                   format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()

def create_http_session():
    """Create a session with retry logic"""
    session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[408, 429, 500, 502, 503, 504]
    )
    session.mount('http://', HTTPAdapter(max_retries=retries))
    session.mount('https://', HTTPAdapter(max_retries=retries))
    return session

def check_lmstudio_connection():
    """Check if LMStudio server is running and responding"""
    logging.debug("Attempting to connect to LMStudio server...")
    status = check_generation_status(LMSTUDIO_CONFIG['base_url'], LMSTUDIO_CONFIG['api_key'])
    
    if status["status"] == "ready":
        logging.info("[OK] Successfully connected to LMStudio server")
        return True
    else:
        logging.error(f"Failed to connect to LMStudio server: {status.get('error')}")
        return False

def setup_project_directory():
    """Set up the initial project directory structure"""
    logging.info("Setting up project directory structure...")
    try:
        # Create base project directory
        project_dir = ensure_directory(PROJECT_CONFIG["base_dir"])
        
        # Create required directories
        for dir_name in PROJECT_CONFIG["required_dirs"]:
            ensure_directory(project_dir / dir_name)
        
        logging.info(f"Project directory structure created at {project_dir}")
        return True
    except Exception as e:
        logging.error(f"Error setting up project directory: {str(e)}")
        return False

class AsyncUserProxyAgent(autogen.UserProxyAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_request_id = None

    async def a_initiate_chat(self, manager, message):
        """Asynchronous version of initiate_chat that supports polling"""
        try:
            # Start the chat with initial message
            response = await manager.a_receive(message, self)
            
            # If we get a request ID back, start polling for completion
            if isinstance(response, dict) and response.get("request_id"):
                status = wait_for_generation(
                    LMSTUDIO_CONFIG['base_url'],
                    LMSTUDIO_CONFIG['api_key'],
                    response["request_id"]
                )
                
                if status["status"] == "ready":
                    return status["data"]
                else:
                    logging.error(f"Generation failed or timed out: {status.get('error')}")
                    return None
            
            return response
        except Exception as e:
            logging.error(f"Error in async chat: {str(e)}")
            return None

def main():
    logging.info("Starting agent network initialization...")
    
    # Check LMStudio connection first
    if not check_lmstudio_connection():
        logging.error("Failed to connect to LMStudio. Exiting...")
        sys.exit(1)
        
    # Set up project directory
    if not setup_project_directory():
        logging.error("Failed to set up project directory. Exiting...")
        sys.exit(1)

    logging.info("Creating development agents...")
    try:
        # Create agents
        architect = autogen.AssistantAgent(
            name=AGENT_CONFIG["architect"]["name"],
            system_message=AGENT_CONFIG["architect"]["system_message"],
            llm_config=LLM_CONFIG
        )
        logging.debug("Created architect agent")

        developer = autogen.AssistantAgent(
            name=AGENT_CONFIG["developer"]["name"],
            system_message=AGENT_CONFIG["developer"]["system_message"],
            llm_config=LLM_CONFIG
        )
        logging.debug("Created developer agent")

        tester = autogen.AssistantAgent(
            name=AGENT_CONFIG["tester"]["name"],
            system_message=AGENT_CONFIG["tester"]["system_message"],
            llm_config=LLM_CONFIG
        )
        logging.debug("Created tester agent")

        user_proxy = AsyncUserProxyAgent(
            name="User_Proxy",
            system_message="You are a user proxy that helps coordinate the development process.",
            human_input_mode="TERMINATE",
            max_consecutive_auto_reply=10,
            code_execution_config={"use_docker": False}
        )
        logging.debug("Created user proxy agent")

        logging.info("Setting up group chat...")
        # Create group chat
        groupchat = autogen.GroupChat(
            agents=[user_proxy, architect, developer, tester],
            messages=[],
            max_round=50
        )
        logging.debug("Created group chat")

        manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=LLM_CONFIG)
        logging.debug("Created chat manager")

        logging.info("Starting development task...")
        # Start with a more comprehensive API project
        user_proxy.a_initiate_chat(
            manager,
            message="""Create a FastAPI project with the following features:
            1. User registration and login with JWT authentication
            2. Basic CRUD operations for a 'posts' resource
            3. Proper project structure with routers, models, and schemas
            4. Basic input validation and error handling
            5. SQLite database integration
            
            Start by designing the project structure and implementing the core setup."""
        )
    except Exception as e:
        logging.error(f"Error during initialization: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
