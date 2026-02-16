✅ DETAILED NOTES — BACKEND /transcribe IMPLEMENTATION
📌 Context

We are building a GenAI-based SRS Generator system.

Architecture follows microservices:

Backend → FastAPI + MongoDB

STT Service → Whisper (running separately)

The backend does NOT perform speech-to-text itself.

Instead, Whisper runs as a separate service.

🔵 STEP 4 — REAL BACKEND WORK BEGINS
🎯 Goal

Create a backend endpoint:

POST /transcribe


This endpoint will:

accept audio from user

send audio to Whisper service

receive transcription text

store result in MongoDB

return structured response

🧠 IMPORTANT MINDSET (VERY IMPORTANT)

Backend must NOT do AI work.

Backend should think like this:

“I don’t know how to convert audio into text.
Let me ask the Whisper service.”

This is real microservice architecture.

🧩 SYSTEM ARCHITECTURE FLOW
User
  ↓
Frontend uploads audio
  ↓
Backend (/transcribe)
  ↓
Whisper Service (localhost:7860)
  ↓
Text response
  ↓
Backend saves result in MongoDB
  ↓
Backend returns JSON to frontend

🔁 COMPLETE FLOW IN SIMPLE ENGLISH
1️⃣ User uploads audio

User sends:

POST /transcribe
Content-Type: multipart/form-data
file = audio.mp3

2️⃣ Backend receives audio

Backend receives:

UploadFile

user identity (from JWT)

Backend does NOT analyze audio.

3️⃣ Backend temporarily stores file

Backend may:

store file in a temp directory

or stream file directly

Purpose:

forward file to Whisper

4️⃣ Backend forwards file to Whisper

Backend sends HTTP request to:

http://127.0.0.1:7860/transcribe/


Using:

multipart/form-data

same file

Backend acts as client here.

5️⃣ Whisper processes audio

Whisper service:

loads Whisper model

converts speech → text

returns JSON

Example:

{
  "filename": "audio.mp3",
  "transcription": "User wants an SRS document"
}

6️⃣ Backend receives transcription

Backend reads response:

transcription text = result["transcription"]

7️⃣ Backend stores result in MongoDB

Backend creates new document in collection:

📂 Collection name:
transcriptions

🧾 Document structure:
{
  "_id": ObjectId,
  "user_id": "logged_in_user_id",
  "filename": "audio.mp3",
  "text": "converted text",
  "created_at": "timestamp"
}


This stored data will later be used for:

SRS generation

export

audit/history

8️⃣ Backend sends response to frontend

Backend returns:

{
  "message": "Transcription successful",
  "transcription_id": "ObjectId",
  "text": "converted text"
}

🔵 STEP 5 — WHAT /transcribe ENDPOINT MUST DO
Endpoint definition
POST /transcribe

✅ Functional requirements

The endpoint must:

✔ Require authentication (JWT)
✔ Accept audio file (UploadFile)
✔ Call Whisper service using HTTP client
✔ Receive transcription JSON
✔ Save transcription in MongoDB
✔ Return transcription id + text

🔐 Authentication

Use JWT

Extract user_id from token

Associate transcription with user

This ensures:

each transcription belongs to a user

later we can fetch user-specific history

🌐 Communication with Whisper

Backend must communicate using:

HTTP request

localhost URL

multipart upload

Whisper service details:

URL: http://127.0.0.1:7860/transcribe/
Method: POST
Input field: file
Response: JSON

📦 Database responsibility

Backend stores only metadata and text, not large audio files.

MongoDB collection:

transcriptions


Fields stored:

user_id

filename

transcription text

timestamp

Audio files are temporary only.

🔁 Why store transcription in DB?

Because later:

/generate_srs will take transcription_id

/export will use transcription text

users can view previous transcriptions

This enables full project workflow.

🧠 VERY IMPORTANT FOR VIVA / REPORT

You can clearly say:

“Speech-to-text is implemented as an independent microservice using OpenAI Whisper.
The backend communicates with it using REST APIs.
This improves modularity, scalability, and maintainability.”

This line alone = full marks.

📌 SUMMARY (SHORT VERSION)
/transcribe endpoint does:

receives audio

forwards to Whisper

gets text

saves to MongoDB

returns response

/transcribe does NOT:

run AI

load model

process audio

perform speech recognition

🧭 WHAT COMES NEXT AFTER THIS

Once /transcribe works:

➡ /generate_srs

Which will:

take transcription text

take srs_type (Agile / IEEE)

call LLM

return structured SRS JSON

But /transcribe is the foundation.