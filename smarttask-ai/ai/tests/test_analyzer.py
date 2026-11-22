from ai.analyzer import analyze_task


def test_high_priority():
    assert analyze_task("Complete Java Assignment Tomorrow")["priority"] == "High"
