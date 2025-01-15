import autogen
from dotenv import load_dotenv
import os
import sys
import logging
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from config.config import LLM_CONFIG, AGENT_CONFIG, LMSTUDIO_CONFIG, PROJECT_CONFIG
from utils.file_utils import ensure_directory, create_project_structure
from utils.lmstudio_utils import check_generation_status, wait_for_generation
import requests
import asyncio

# Set console encoding to UTF-8
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer)

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
    try:
        logging.debug("Attempting to connect to LMStudio server...")
        response = requests.get(
            f"{LMSTUDIO_CONFIG['base_url']}/models",
            headers={"Authorization": f"Bearer {LMSTUDIO_CONFIG['api_key']}"}
        )
        response.raise_for_status()
        models = response.json()
        logging.info(f"[OK] Successfully connected to LMStudio server. Available models: {models}")
        return True
    except Exception as e:
        logging.error(f"Failed to connect to LMStudio server: {str(e)}")
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
            logging.info("Starting chat with message: %s", message)
            
            # Create the initial message with the system context
            message_with_context = f"""System: {self.system_message}

User: {message}"""
            
            # Make the chat completion request
            response = await manager.a_receive(message_with_context, self)
            
            logging.info("Received response: %s", response)
            return response

        except Exception as e:
            logging.error(f"Error in async chat: {str(e)}", exc_info=True)
            return None

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)
        
        # Create HTTP session with retry logic
        create_http_session()

        # Check LMStudio connection
        if not check_lmstudio_connection():
            logging.error("Failed to connect to LMStudio server")
            sys.exit(1)

        # Setup project directory
        setup_project_directory()

        # Create agents
        try:
            # Create agents with enhanced error handling and logging
            logging.info("Creating architect agent with config: %s", LLM_CONFIG)
            architect = autogen.AssistantAgent(
                name="Software_Architect",
                llm_config=LLM_CONFIG,
                system_message="You are a senior software architect. Design system architecture and make technical decisions."
            )
            logging.debug("Created architect agent successfully")

            logging.info("Creating developer agent with config: %s", LLM_CONFIG)
            developer = autogen.AssistantAgent(
                name="Developer",
                llm_config=LLM_CONFIG,
                system_message="You are a skilled software developer. Write clean code and implement features."
            )
            logging.debug("Created developer agent successfully")

            logging.info("Creating tester agent with config: %s", LLM_CONFIG)
            tester = autogen.AssistantAgent(
                name="QA_Engineer",
                llm_config=LLM_CONFIG,
                system_message="You are a QA engineer. Test code and ensure quality."
            )
            logging.debug("Created tester agent successfully")

            logging.info("Creating user proxy agent")
            user_proxy = autogen.UserProxyAgent(
                name="User_Proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=10,
                llm_config=LLM_CONFIG,
                code_execution_config={"work_dir": "fastapi_project"},
                system_message="You are a user proxy that helps coordinate development."
            )
            logging.debug("Created user proxy agent successfully")

            logging.info("Setting up group chat...")
            # Create group chat with proper error handling
            try:
                # Create initial messages for the group chat
                initial_messages = [
                    {
                        "role": "system",
                        "content": "This is a group chat for developing a FastAPI project. Each agent has a specific role and responsibilities."
                    }
                ]

                groupchat = autogen.GroupChat(
                    agents=[user_proxy, architect, developer, tester],
                    messages=initial_messages,
                    max_round=50,
                    speaker_selection_method="round_robin",
                    allow_repeat_speaker=False
                )
                logging.debug("Created group chat successfully")

                # Create the chat manager with specific configuration
                manager = autogen.GroupChatManager(
                    groupchat=groupchat,
                    llm_config={
                        **LLM_CONFIG,
                        "functions": None,  # No function calling needed
                        "temperature": 0.7,  # Set temperature for more focused responses
                        "request_timeout": 120,  # Lower timeout for faster responses
                    },
                    system_message="""You are a chat manager responsible for coordinating the development process.
                    Your role is to:
                    1. Ensure each agent contributes according to their role
                    2. Keep the conversation focused on the development task
                    3. Summarize progress and next steps
                    4. Handle any conflicts or misunderstandings"""
                )
                logging.debug("Created chat manager successfully")

                logging.info("Starting development task...")
                # Start with a more comprehensive API project
                initial_message = """Create a FastAPI project with the following features:
                1. User registration and login with JWT authentication
                2. Basic CRUD operations for a 'posts' resource
                3. Proper project structure with routers, models, and schemas
                4. Basic input validation and error handling
                5. SQLite database integration
                
                Start by designing the project structure and implementing the core setup."""

                logging.info("Sending initial message to chat: %s", initial_message)
                response = user_proxy.initiate_chat(manager, message=initial_message)
                logging.info("Received response from chat: %s", response)

                if not response:
                    logging.error("No response received from chat manager")
                    raise Exception("Chat manager failed to respond")

            except Exception as e:
                logging.error(f"Error in chat initialization: {str(e)}", exc_info=True)
                raise

        except Exception as e:
            logging.error(f"Error during initialization: {str(e)}", exc_info=True)
            sys.exit(1)

    except Exception as e:
        logging.error(f"Error in main: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
