import os
import logging
from pathlib import Path
from typing import Union, List
import shutil

def ensure_directory(directory: Union[str, Path]) -> Path:
    """Ensure a directory exists, create it if it doesn't"""
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    return directory

def safe_write_file(filepath: Union[str, Path], content: str, mode: str = 'w') -> bool:
    """Safely write content to a file with proper error handling"""
    try:
        filepath = Path(filepath)
        ensure_directory(filepath.parent)
        
        # Create backup if file exists
        if filepath.exists() and mode == 'w':
            backup_path = filepath.with_suffix(filepath.suffix + '.bak')
            shutil.copy2(filepath, backup_path)
        
        with open(filepath, mode, encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        logging.error(f"Error writing to file {filepath}: {str(e)}")
        return False

def create_project_structure(base_dir: Union[str, Path], structure: dict) -> bool:
    """Create a project directory structure from a dictionary specification"""
    try:
        base_dir = Path(base_dir)
        ensure_directory(base_dir)
        
        for name, content in structure.items():
            path = base_dir / name
            if isinstance(content, dict):
                ensure_directory(path)
                create_project_structure(path, content)
            elif isinstance(content, str):
                safe_write_file(path, content)
            elif content is None:
                ensure_directory(path)
        return True
    except Exception as e:
        logging.error(f"Error creating project structure: {str(e)}")
        return False

def list_project_files(directory: Union[str, Path]) -> List[Path]:
    """Recursively list all files in a project directory"""
    try:
        directory = Path(directory)
        return [p for p in directory.rglob('*') if p.is_file()]
    except Exception as e:
        logging.error(f"Error listing project files: {str(e)}")
        return []
