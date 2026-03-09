Perfect 👍
Here is your **clean, organized startup guide** so you can run the full project anytime without confusion.

You have **5 services** to run in separate terminals.

---

# 🚀 FULL PROJECT STARTUP GUIDE (STEP-BY-STEP)

👉 Always run each step in a **separate terminal window**
👉 Do NOT close terminals while project is running

---

## 🧩 STEP 1 — Start MongoDB Database

If MongoDB runs as a Windows service → nothing to do.

Otherwise start manually:

```powershell
mongod
```

✔ Keep this terminal open

---

## 🎤 STEP 2 — Start Whisper Service (Speech → Text)

Open **new terminal**

```powershell
cd "C:\Users\HP\OneDrive\ujjawal\major project\whisper-main"

.\venv\Scripts\Activate.ps1

uvicorn app:app --port 7860 --reload
```

✔ Whisper running at:

```
http://127.0.0.1:7860
```

✔ Keep terminal open

---

## 🧠 STEP 3 — Start SRS Generation Service (Gemini AI)

Open **new terminal**

```powershell
cd "C:\Users\HP\OneDrive\ujjawal\major project\srspipeline-main"

.\venv\Scripts\Activate.ps1

uvicorn main:app --port 9000 --reload
```

✔ SRS pipeline running at:

```
http://127.0.0.1:9000
```

✔ Keep terminal open

---

## ⚙️ STEP 4 — Start Main Backend (Auth + Transcribe + Generate + Export)

Open **new terminal**

```powershell
cd "C:\Users\HP\OneDrive\ujjawal\major project\ProjectBackend1"

.\venv\Scripts\Activate.ps1

uvicorn app.main:app --port 8000 --reload
```

✔ Backend running at:

```
http://127.0.0.1:8000
```

✔ API Docs:

```
http://127.0.0.1:8000/docs
```

✔ Keep terminal open

---

## 🎨 STEP 5 — Start Frontend

Open **new terminal**

```powershell
cd "C:\Users\HP\OneDrive\ujjawal\major project\frontend"

python -m http.server 5500
```

Open browser:

```
http://127.0.0.1:5500
```

---

# ✅ FINAL SYSTEM ARCHITECTURE (RUNNING PORTS)

| Service          | Port  |
| ---------------- | ----- |
| MongoDB          | 27017 |
| Whisper STT      | 7860  |
| SRS AI Pipeline  | 9000  |
| Main Backend API | 8000  |
| Frontend UI      | 5500  |

---

# 🔥 QUICK HEALTH CHECK (VERY IMPORTANT)

After starting everything:

### Backend docs

```
http://127.0.0.1:8000/docs
```

### Whisper homepage

```
http://127.0.0.1:7860
```

### SRS docs

```
http://127.0.0.1:9000/docs
```

### Frontend

```
http://127.0.0.1:5500
```

If all open → system ready ✅

---

# 🧠 FULL WORKFLOW (REMEMBER THIS)

Frontend → Backend → Microservices

1️⃣ Upload audio → Whisper → text
2️⃣ Or type text directly
3️⃣ Backend sends text → SRS pipeline
4️⃣ Gemini generates SRS
5️⃣ Backend stores in MongoDB
6️⃣ User downloads PDF

---

# 💡 PRO TIP (IMPORTANT)

If something fails:

Restart in this order:

1 MongoDB
2 Whisper
3 SRS pipeline
4 Backend
5 Frontend

---

If you want, I can also give you:

✅ One-click startup script (.ps1 file)
✅ System architecture diagram for viva
✅ Deployment guide
✅ Frontend API integration guide
✅ Final project explanation for presentation

Just tell me 👍
