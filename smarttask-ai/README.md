# SmartTask AI – AI-Powered Task Manager

Task লিখলে AI priority (High/Medium/Low) ঠিক করবে এবং suggestion দেবে।

## Team
| Member | Role | Folder |
|--------|------|--------|
| Member 1 | AI Developer | `ai/` |
| Member 2 | Frontend Developer | `frontend/` |
| Member 3 | Backend Developer | `backend/`, `database/` |

## Folder Structure
```
smarttask-ai/
├── ai/          # Member 1 – priority classifier + suggestion engine
├── frontend/    # Member 2 – UI (HTML/CSS/JS)
├── backend/     # Member 3 – FastAPI, auth, CRUD, AI connect
├── database/    # Member 3 – MySQL schema
└── docs/        # API contract, notes
```

## Run (local)
```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload     # http://127.0.0.1:8000/docs

# Frontend
cd frontend && python -m http.server 5500   # http://127.0.0.1:5500/pages/index.html
```

## Git Workflow
- `main` – stable, সরাসরি push করা যাবে না
- Branch: `feature/ai-*`, `feature/frontend-*`, `feature/backend-*`
- নিজের folder-এর বাইরে file বদলাতে হলে আগে team-কে জানাও
- Pull Request দিয়ে merge করো

Integration শুরুর আগে `docs/API_CONTRACT.md` দেখো।
