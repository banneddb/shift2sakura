# Shift 2 Sakura 🌸

A web application that converts Western-style resumes into Japanese-format **rirekisho (履歴書)** documents. Upload your PDF resume, optionally paste a job description, and receive a properly formatted Japanese resume ready for download, with AI-powered guidance to help fill in any gaps.

---

## What It Does

Japanese job applications require a specific resume format (rirekisho) that is very different from Western resumes. Shift 2 Sakura automates this conversion by:

1. Extracting text from your uploaded PDF resume
2. Using a local AI model (Llama3 via Ollama) to translate and restructure your information into rirekisho format
3. Detecting any required fields that couldn't be filled from your resume and prompting you to fill them in
4. Optionally, generating AI advice for each missing field based on your background and the job description
5. Rendering the completed data into a properly formatted rirekisho PDF using a Japanese HTML template

---

## How It Works

### Data Flow

```
User uploads PDF + job description (optional)
        ↓
POST /extractText
        ↓
PDF buffer → raw text → cleaned text → Ollama/Llama3 → rirekisho JSON
        ↓
Missing fields detected → AI advice generated in parallel (Promise.all)
        ↓
Response: { result, missingFields[] }
        ↓
Frontend displays missing field questions + AI advice hints
User fills in answers → merged into result JSON
        ↓
POST /generateResume
        ↓
JSON → HTML template → Puppeteer → PDF buffer
        ↓
User downloads rirekisho.pdf
```

### Architecture

The backend saves each generated resume to PostgreSQL via Prisma. The frontend holds the `result` JSON in React state between the `/extractText` and `/generateResume` calls.

---

## Project Structure

```
shift2sakura/
├── backend-node/
│   └── src/
│       ├── server.js                        # Express app entry point, route definitions
│       ├── controllers/
│       │   ├── extract.controller.js        # Handles /extractText — PDF → JSON + missing fields + advice
│       │   └── generate.controller.js       # Handles /generateResume — JSON → PDF buffer
│       ├── services/
│       │   ├── extractText.js               # Extracts raw text from PDF buffer using pdf-parse
│       │   ├── cleanExtractedText.js        # Normalizes whitespace, removes noise from raw text
│       │   ├── ai.js                        # Sends cleaned text to Ollama, parses rirekisho JSON response
│       │   ├── generateAdvice.js            # Sends per-field advice prompts to Ollama, returns bullet points
│       │   └── convertToRirekisho.js        # Fills HTML template, launches Puppeteer, returns PDF buffer
│       ├── middleware/
│       │   ├── upload.middleware.js         # Multer config — memory storage, PDF-only filter, 5MB limit
│       │   └── error.middleware.js          # Global error handler
│       ├── templates/
│       │   └── rirekisho.html               # Japanese resume HTML template with {{placeholders}}
│       ├── models/
│       │   └── resumeModel.js               # (Reserved for Prisma model definitions)
│       └── utils/
│           ├── fileHandler.js               # (Reserved)
│           └── validators.js                # (Reserved)
│
└── frontend-node/
    ├── app/
    │   ├── page.tsx                         # Landing page
    │   ├── layout.tsx                       # Root layout, fonts, metadata
    │   ├── globals.css                      # Global styles
    │   ├── resume-converter/
    │   │   └── page.tsx                     # Main resume upload and conversion flow
    │   └── team/
    │       └── page.tsx                     # Team page
    └── components/
        └── navbar.tsx                       # Shared navigation component
```

---

## API Endpoints

### POST /extractText

Accepts a PDF resume and optional job description. Returns structured rirekisho JSON and a list of missing fields with AI advice.

Request: multipart/form-data
- resume (PDF file, required)
- jobDescription (string, optional)

Response:
{
  "result": {
    "氏名": "Behruz Omon",
    "フリガナ": "",
    "生年月日": "",
    "住所": "Yokohama, Japan",
    "電話番号": "",
    "メール": "behruz@email.com",
    "学歴": [{ "年月": "令和2年4月", "内容": "Temple University 入学" }],
    "職歴": [],
    "免許・資格": [],
    "志望動機": "",
    "自己PR": ""
  },
  "missingFields": [
    {
      "field": "志望動機",
      "question": "Why are you applying for this position?",
      "advice": [
        "• Your CS background aligns with their engineering focus",
        "• Mention your experience building full-stack applications",
        "• Reference your study abroad experience as motivation."
      ]
    }
  ]
}

---

### POST /generateResume

Accepts the completed rirekisho JSON and returns a formatted PDF file.

Request: application/json — the full rirekisho object (same shape as result above, all fields filled in)

Response: PDF binary (application/pdf) with Content-Disposition: attachment; filename=rirekisho.pdf

Frontend download pattern:
const response = await fetch("http://localhost:3000/generateResume", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(completedResumeData),
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "rirekisho.pdf";
a.click();
URL.revokeObjectURL(url);

---

## Installation

### Prerequisites
- Node.js v18+
- PostgreSQL — https://www.postgresql.org/download (or a hosted instance e.g. Supabase)
- Ollama installed and running — https://ollama.com
- Llama3 model pulled in Ollama
- A Clerk account — https://clerk.com (free)

### 0. Install and start PostgreSQL

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:** Download and run the installer from https://www.postgresql.org/download/windows

**Linux:**
```bash
sudo apt install postgresql
sudo service postgresql start
```

---

### 1. Clone the repo
```bash
git clone https://github.com/banneddb/shift2sakura.git
cd shift2sakura
```

---

### 2. Install Ollama and pull Llama3
```bash
ollama pull llama3
ollama serve
```
Ollama must be running on http://localhost:11434 before starting the backend.

---

### 3. Set up the backend

```bash
cd backend-node
npm install
```

Create a `.env` file inside `backend-node/`:
```
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shift2sakura
```

Replace `USER` and `PASSWORD` with your PostgreSQL credentials:
- **Mac** (Homebrew): default user is your macOS username, no password — e.g. `postgresql://john@localhost:5432/shift2sakura`
- **Windows/Linux**: default user is `postgres` with the password set during install — e.g. `postgresql://postgres:yourpassword@localhost:5432/shift2sakura`

Create the database:
```bash
createdb shift2sakura
```

Run Prisma migrations and generate the client:
```bash
npx prisma migrate deploy
npx prisma generate
```

Start the backend:
```bash
npm run dev
```
Backend runs on http://localhost:3000

---

### 4. Set up the frontend

```bash
cd ../frontend-node
npm install
```

Create a `.env.local` file inside `frontend-node/`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev -- -p 3001
```
Frontend runs on http://localhost:3001

---

### 5. Getting Clerk API keys

1. Go to https://dashboard.clerk.com
2. Create a new application (or use existing)
3. Go to API Keys
4. Copy the Publishable Key and Secret Key into your `.env.local` and `.env` files

---

## Dependencies

### Backend
- express        — Web server and routing
- cors           — Cross-origin request handling
- multer         — PDF file upload handling (memory storage)
- pdf-parse      — Extract text from PDF buffers
- puppeteer      — Headless browser for HTML → PDF rendering
- dotenv         — Environment variable management
- nodemon        — Auto-restart during development

### Frontend
- next               — React framework
- react / react-dom  — UI library
- @clerk/nextjs      — Authentication
- tailwindcss        — Utility-first CSS framework
- typescript         — Type safety

---

## Team
Hamza Mustafa - Frontend and Database ||
Behruz Omonullaev - Backend and AI
