# 🚀 Run Full Project (SRS Generation System)

This guide provides a complete, step-by-step walkthrough to start the entire system, including the Database, Whisper Service, SRS AI Pipeline, Backend API, and Frontend.

---

1. Start Database (MongoDB)
Keep this terminal open or run as a background service.


2. start whisper service

cd "c:\Users\HP\OneDrive\ujjawal\major project\whisper-main"
.\venv\Scripts\Activate.ps1
uvicorn app:app --port 7860 --reload


3. start srs pipeline

cd "c:\Users\HP\OneDrive\ujjawal\major project\srspipeline-main"

.\venv\Scripts\Activate.ps1

uvicorn main:app --port 9000 --reload



4. start main backend

cd "c:\Users\HP\OneDrive\ujjawal\major project\ProjectBackend1"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --port 8000 --reload


5. frontent 

cd "c:\Users\HP\OneDrive\ujjawal\major project\frontend"
python -m http.server 5500


Then open your browser to: http://127.0.0.1:5500













## 📋 Prerequisites

Before starting, ensure you have the following installed:
1.  **Python 3.10+**: [Download Here](https://www.python.org/downloads/)
2.  **Node.js** (Optional, for running frontend server): [Download Here](https://nodejs.org/)
3.  **MongoDB Community Server**: [Download Here](https://www.mongodb.com/try/download/community)
4.  **Git Bash / PowerShell**: For running commands.

---

## 🏗 System Architecture Overview

| Component | Port | Description |
| :--- | :--- | :--- |
| **MongoDB** | `27017` | Database for Users, Transcriptions, and SRS Docs. |
| **Whisper Service** | `7860` | Microservice for Audio-to-Text Transcription. |
| **SRS Pipeline** | `9000` | Microservice for AI SRS Generation (Gemini). |
| **Backend API** | `8000` | Main FastAPI Gateway & Auth System. |
| **Frontend** | `5500` | User Interface (HTML/JS). |

---

## ⚡ Step 1: Start Database (MongoDB)

Keep this terminal open or run as a background service.

**Windows PowerShell:**
```powershell
mongod
# If installed as a service, it may already be running.
# Verify connectivity at mongodb://127.0.0.1:27017
```

---

## 🎙 Step 2: Start Whisper Service
*Handles audio transcription.*

1.  Open a **New Terminal**.
2.  Navigate to `whisper-main`.
3.  Install dependencies (first time only) and run.

```powershell
cd "c:\Users\HP\OneDrive\ujjawal\major project\whisper-main"

# Create/Activate Virtual Env (Recommended)
python -m venv venv
.\venv\Scripts\activate

# Install Dependencies
pip install openai-whisper fastapi uvicorn python-multipart

# Run Service
uvicorn app:app --host 127.0.0.1 --port 7860
```
✅ **Success if running at:** `http://127.0.0.1:7860`

---

## 🧠 Step 3: Start SRS Pipeline
*Handles AI generation using Gemini.*

1.  Open a **New Terminal**.
2.  Navigate to `srspipeline-main`.
3.  **Setup `.env`**: Create a file named `.env` in `srspipeline-main/` with:
    ```env
    GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
    GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro
    ```
4.  Run the service.

```powershell
cd "c:\Users\HP\OneDrive\ujjawal\major project\srspipeline-main"

# Activate Virtual Env
.\venv\Scripts\activate
# OR create if missing: python -m venv venv; .\venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
# If requirements.txt is missing: pip install fastapi uvicorn google-generativeai python-dotenv pydantic

# Run Service
uvicorn main:app --port 9000 --reload
```
✅ **Success if running at:** `http://127.0.0.1:9000`

---

## 🔗 Step 4: Start Main Backend
*The central API Gateway.*

1.  Open a **New Terminal**.
2.  Navigate to `ProjectBackend1`.
3.  **Setup `.env`**: Create a file named `.env` in `ProjectBackend1/` with:
    ```env
    SECRET_KEY=your_super_secret_key_change_this
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    MONGODB_URL=mongodb://localhost:27017
    DB_NAME=genai_srs
    ```
4.  Run the service.

```powershell
cd "c:\Users\HP\OneDrive\ujjawal\major project\ProjectBackend1"

# Activate Virtual Env
.\venv\Scripts\activate

# Install Dependencies (if needed)
pip install -r requirements.txt

# Run Service
uvicorn app.main:app --port 8000 --reload
```
✅ **Success if running at:** `http://127.0.0.1:8000`
📄 **API Docs:** `http://127.0.0.1:8000/docs`

---

## 💻 Step 5: Run Frontend
*User Interface.*

1.  Open a **New Terminal**.
2.  Navigate to `frontend`.
3.  Serve the files using a simple HTTP server (avoids CORS issues).

```powershell
cd "c:\Users\HP\OneDrive\ujjawal\major project\frontend"

# Using Python to serve (Easiest)
python -m http.server 5500
```

4.  **Open Browser:** Go to [http://127.0.0.1:5500](http://127.0.0.1:5500)

---

## 🧪 Quick Test Flow

1.  **Open Frontend**: `http://127.0.0.1:5500`
2.  **Sign Up**: Create a new account.
3.  **Login**: Use your credentials.
4.  **Generate SRS**:
    *   **Text Mode**: Type "I need a library management system" and click Generate.
    *   **Audio Mode**: Upload a `.wav`/`.mp3` recording of your requirements -> Transcribe -> Generate.
5.  **Download**: Click "Download PDF" on the result.

---

## 🛑 Common Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Connection Refused** | Ensure the specific service (Whisper/SRS/Backend) terminal is open and running without errors. |
| **Process Not Found** | Verify you activated the virtual environment (`.\venv\Scripts\activate`) before running `uvicorn`. |
| **Port Already in Use** | Kill the process using that port or change the port in the command AND in the calling code (e.g., `app/routers/`). |
| **CORS Error** | Ensure you are accessing frontend via `http://localhost:5500` or `127.0.0.1:5500`, matching what the Backend allows. |
