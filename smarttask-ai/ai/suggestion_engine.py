SUGGESTIONS = {
    "High": "Complete this before the deadline. Start as soon as possible.",
    "Medium": "Plan a time slot for this within the next few days.",
    "Low": "Do this when you have free time. No rush.",
}


def get_suggestion(priority: str) -> str:
    return SUGGESTIONS.get(priority, SUGGESTIONS["Medium"])
