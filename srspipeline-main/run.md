# Walkthrough - Running SRS Pipeline Locally

The `srspipeline-main` project has been successfully set up and is running locally.

## Setup Steps Completed
1.  **Virtual Environment**: Created `.venv` directory.
2.  **Dependencies**: Installed `fastapi`, `uvicorn`, `python-dotenv`, `google-genai`, `pydantic`.
3.  **Configuration**: User provided `GOOGLE_GEMINI_API_KEY` in `.env`.
    *   **Note**: `GEMINI_MODEL` defaults to `gemini-2.5-flash` (confirmed working).
4.  **Execution**: Started `uvicorn` server on port 9000.
    *   **Robustness**: Added automatic retries for `429 RESOURCE_EXHAUSTED` errors using `tenacity`.

## Verification
The server is running at `http://localhost:9000`.
-   **API Documentation**: Accessible at [http://127.0.0.1:9000/docs](http://127.0.0.1:9000/docs)

## How to Run (Future Reference)
To run the server again in the future:
1.  Open terminal in `srspipeline-main` folder.
2.  Activate virtual environment:
    ```powershell
    .\venv\Scripts\activate
    ```
3.  Run command:
    ```powershell
    uvicorn main:app --port 9000 --reload
    ```
