# API Contract (তিনজনে মিলে ঠিক করা – শুরুতেই)

Base URL: `http://127.0.0.1:8000`

## Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /auth/register | `{name, email, password}` | `{id, name, email}` |
| POST | /auth/login | `{email, password}` | `{access_token, token_type}` |

## Tasks (Authorization: Bearer <token>)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | সব task |
| POST | /tasks | নতুন task (AI priority সহ save হবে) |
| PUT | /tasks/{id} | Edit |
| DELETE | /tasks/{id} | Delete |
| PATCH | /tasks/{id}/complete | Mark completed |
| GET | /tasks/stats | total, completed, pending, high_priority |

## AI
| Method | Endpoint | Body |
|--------|----------|------|
| POST | /ai/analyze | `{"text": "Complete Java Assignment Tomorrow"}` |

Response:
```json
{
  "task": "Complete Java Assignment",
  "deadline": "Tomorrow",
  "priority": "High",
  "suggestion": "Complete the assignment before the deadline."
}
```

## Task object
```json
{
  "id": 1, "title": "...", "description": "...",
  "priority": "High|Medium|Low", "deadline": "2026-11-23",
  "status": "pending|completed", "suggestion": "..."
}
```
