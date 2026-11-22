from .priority_classifier import classify_priority
from .suggestion_engine import get_suggestion


def analyze_task(text: str) -> dict:
    """Backend এই function call করবে।"""
    priority = classify_priority(text)
    return {
        "task": text,
        "priority": priority,
        "suggestion": get_suggestion(priority),
    }
