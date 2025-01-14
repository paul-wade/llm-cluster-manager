import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# LMStudio Configuration
LMSTUDIO_CONFIG = {
    "base_url": os.getenv('LMSTUDIO_BASE_URL', 'http://localhost:1234/v1'),
    "api_key": "sk-xxx",  # LMStudio accepts any non-empty string
    "context_window": 4096,  # Qwen 2.5 supports large context
}

# LLM Configuration for AutoGen
LLM_CONFIG = {
    "config_list": [{
        "model": "local-model",  # LMStudio doesn't care about the model name
        "base_url": LMSTUDIO_CONFIG["base_url"],
        "api_key": LMSTUDIO_CONFIG["api_key"],
        "api_type": "open_ai",
        "request_timeout": 3600  # 1 hour timeout for very long generations
    }],
    "temperature": float(os.getenv('TEMPERATURE', 0.7)),
    "max_tokens": int(os.getenv('MAX_TOKENS', 200)),  # Further reduced max tokens
    "timeout": 3600,  # Match the request timeout
    "cache_seed": None  # Disable caching to prevent issues
}

# Project Configuration
PROJECT_CONFIG = {
    "base_dir": os.path.join(os.path.dirname(os.path.dirname(__file__)), "fastapi_project"),
    "required_dirs": ["app", "tests", "docs"],
    "templates_dir": os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
}

# Agent Configuration
AGENT_CONFIG = {
    "architect": {
        "name": "Software_Architect",
        "system_message": """You are a senior software architect who designs system architecture and makes high-level technical decisions.
        Your responsibilities include:
        1. Analyzing requirements and creating system designs
        2. Making architectural decisions
        3. Reviewing and approving technical approaches
        4. Ensuring scalability and maintainability
        5. Creating and maintaining project structure
        You can create and modify files using the provided file utilities.
        """
    },
    "developer": {
        "name": "Developer",
        "system_message": """You are a skilled software developer who implements code based on specifications.
        Your responsibilities include:
        1. Writing clean, efficient code
        2. Implementing features according to specifications
        3. Writing unit tests
        4. Code optimization and refactoring
        5. Creating and modifying source files
        You can create and modify files using the provided file utilities.
        """
    },
    "tester": {
        "name": "QA_Engineer",
        "system_message": """You are a QA engineer who ensures code quality through testing.
        Your responsibilities include:
        1. Writing and executing test cases
        2. Performing integration testing
        3. Identifying and reporting bugs
        4. Validating fixes and improvements
        5. Creating and maintaining test files
        You can create and modify files using the provided file utilities.
        """
    }
}
