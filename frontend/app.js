
const API_URL = "http://127.0.0.1:8000";
let currentMethod = 'audio';

console.log("App.js loaded!");

// --- Auth State ---
function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function removeToken() {
    localStorage.removeItem("token");
}

function checkAuth() {
    console.log("Checking auth...");
    const token = getToken();
    if (token) {
        console.log("Token found, showing dashboard");
        showDashboard();
    } else {
        console.log("No token, showing auth");
        showAuth();
    }
}

function getUserInfo() {
    return localStorage.getItem("user_name") || "User";
}

// --- UI Navigation ---
function showAuth() {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
    // Ensure one form is shown
    if (document.getElementById("login-form").classList.contains("hidden") &&
        document.getElementById("signup-form").classList.contains("hidden")) {
        toggleAuth('login');
    }
}

function showDashboard() {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    const userDisplay = document.getElementById("user-display-name");
    if (userDisplay) userDisplay.innerText = getUserInfo();
    loadSRSList();
}

// Made global to be accessible via onclick if needed
window.toggleAuth = function (mode) {
    console.log("Toggling auth to:", mode);
    if (mode === 'login') {
        document.getElementById("login-form").classList.remove("hidden");
        document.getElementById("signup-form").classList.add("hidden");
    } else {
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("signup-form").classList.remove("hidden");
    }
}

window.switchMethod = function (method) {
    currentMethod = method;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Update tabs
    const tabs = document.querySelectorAll('.tab-btn');
    if (method === 'audio' && tabs[0]) tabs[0].classList.add('active');
    if (method === 'text' && tabs[1]) tabs[1].classList.add('active');

    if (method === 'audio') {
        document.getElementById('audio-input-area').classList.remove('hidden');
        document.getElementById('text-input-area').classList.add('hidden');
    } else {
        document.getElementById('audio-input-area').classList.add('hidden');
        document.getElementById('text-input-area').classList.remove('hidden');
    }
}

// --- Loading & Toast Utils ---
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove("hidden");
}

function hideLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
}

function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.className = "show";

    if (type === "error") toast.style.backgroundColor = "#cf6679";
    else if (type === "success") toast.style.backgroundColor = "#03dac6";
    else toast.style.backgroundColor = "#bb86fc";

    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- API Calls ---

window.login = async function () {
    console.log("Login clicked");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const btn = document.getElementById("login-btn");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) return showToast("Please enter email and password", "error");

    btn.disabled = true;
    btn.innerText = "Logging in...";

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Login failed");
        }

        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem("user_name", email.split('@')[0]);

        showToast("Login Successful!", "success");
        setTimeout(showDashboard, 500);
    } catch (err) {
        console.error("Login error:", err);
        showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerText = "Login";
    }
}

window.signup = async function () {
    console.log("Signup clicked");
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const btn = document.getElementById("signup-btn");

    if (!email || !password || !name) return showToast("Please fill all fields", "error");

    btn.disabled = true;
    btn.innerText = "Signing up...";

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                full_name: name
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Signup failed");
        }

        showToast("Account created! Please login.", "success");
        window.toggleAuth('login');
        document.getElementById("login-email").value = email;
    } catch (err) {
        console.error("Signup error:", err);
        showToast(err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerText = "Sign Up";
    }
}

window.logout = function () {
    removeToken();
    localStorage.removeItem("user_name");
    showAuth();
    showToast("Logged out", "info");
}

window.transcribeAudio = async function () {
    const fileInput = document.getElementById("audio-file");
    const file = fileInput.files[0];
    const btn = document.getElementById("transcribe-btn");

    if (!file) return showToast("Please select a file", "error");

    btn.disabled = true;
    showLoading("transcribe-loading");
    document.getElementById("transcription-result").classList.add("hidden");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/transcribe/`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) throw new Error("Transcription failed");

        const data = await response.json();

        document.getElementById("transcription-result").classList.remove("hidden");
        document.getElementById("transcription-text").innerText = data.text;
        document.getElementById("transcription-id").value = data.transcription_id;
        showToast("Audio transcribed!", "success");

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        hideLoading("transcribe-loading");
        btn.disabled = false;
    }
}

window.generateSRS = async function () {
    const templateName = document.getElementById("template-select").value;
    const btn = document.getElementById("generate-btn");
    let payload = { template_name: templateName };

    if (currentMethod === 'audio') {
        const transcriptionId = document.getElementById("transcription-id").value;
        if (!transcriptionId) return showToast("Please transcribe audio first", "error");
        payload.transcription_id = transcriptionId;
    } else {
        const text = document.getElementById("direct-text").value;
        if (!text) return showToast("Please enter requirements", "error");
        payload.input_text = text;
    }

    btn.disabled = true;
    showLoading("generate-loading");

    try {
        const token = getToken();
        // Updated route to match previous conversations
        const response = await fetch(`${API_URL}/generate_srs/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Generation failed");
        }

        const data = await response.json();
        showToast("SRS Generated Successfully!", "success");
        loadSRSList();

    } catch (err) {
        showToast(err.message, "error");
    } finally {
        hideLoading("generate-loading");
        btn.disabled = false;
    }
}

window.loadSRSList = async function () {
    showLoading("list-loading");
    try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/generate_srs/list`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to load list");

        const list = await response.json();
        const tbody = document.getElementById("srs-list-body");
        if (tbody) {
            tbody.innerHTML = "";
            if (list.length === 0) {
                tbody.innerHTML = "<tr><td colspan='4' style='text-align:center'>No documents yet. Generate one!</td></tr>";
            } else {
                list.forEach(item => {
                    const date = new Date(item.created_at).toLocaleDateString();
                    const textShort = item.input_text ? item.input_text.substring(0, 50) + "..." : "Audio Transcription";

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${textShort}</td>
                        <td><span class="badge">${item.template_used}</span></td>
                        <td>${date}</td>
                        <td>
                            <button onclick="downloadSRS('${item.srs_id}', this)" class="secondary-btn small-btn">Download PDF</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }

    } catch (err) {
        console.error(err);
        showToast("Failed to load history", "error");
    } finally {
        hideLoading("list-loading");
    }
}

window.downloadSRS = function (srsId, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "Downloading...";
    btnElement.disabled = true;

    fetch(`${API_URL}/export/${srsId}`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
        .then(resp => {
            if (resp.status === 200) return resp.blob();
            throw new Error("Download failed");
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `srs_${srsId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showToast("Download started", "success");
        })
        .catch(err => {
            showToast("Download failed: " + err.message, "error");
        })
        .finally(() => {
            btnElement.innerText = originalText;
            btnElement.disabled = false;
        });
}

// Init
document.addEventListener("DOMContentLoaded", checkAuth);
