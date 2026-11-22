"""Rule-based priority classifier (v1). পরে ML model দিয়ে replace/improve করা যাবে."""

HIGH_WORDS = ["urgent", "asap", "today", "tomorrow", "deadline", "exam",
              "assignment", "submit", "due", "emergency", "আজ", "কাল"]
LOW_WORDS = ["someday", "later", "optional", "watch", "read", "relax", "hobby"]


def classify_priority(text: str) -> str:
    t = text.lower()
    if any(w in t for w in HIGH_WORDS):
        return "High"
    if any(w in t for w in LOW_WORDS):
        return "Low"
    return "Medium"
