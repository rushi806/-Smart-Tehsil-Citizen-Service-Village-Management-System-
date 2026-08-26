# 🏛️ Smart Tehsil Citizen Service & Village Management System

A full-stack, government-grade digital platform for Tehsil office operations, citizen certificate applications, village directory, interactive Leaflet maps, queue management, and rule-based AI guidance.
- http://localhost:5173

## 🌟 Key Features

### 1. Citizen Portal
- **Service Directory**: Complete catalog of certificates (Income, Caste, Domicile, Non-Creamy Layer, Residence).
- **Document Checklist Generator**: Dynamic generator for official document requirements.
- **Online Application Submission**: Apply for certificates with secure file uploads (`.pdf`, `.jpg`, `.png`).
- **Application Tracking**: Real-time progress timeline tracking by unique Application ID (e.g. `INC-2026-000123`).
- **Desk Appointment Booking**: Select department and time slots for hassle-free office visits.
- **Digital Token / Queue System**: Live queue token generation with estimated wait times.
- **Grievance Redressal**: Lodge and track complaints with official resolution notes.
- **Smart Search**: Global search across services, villages, schemes, notices, and staff.

### 2. Village & Scheme Management
- **Village Directory**: Demographics, population, households, area, and infrastructure indicators (schools, health centers, electricity).
- **Interactive OpenStreetMap**: Leaflet map displaying village markers and popups.
- **Government Schemes**: Welfare schemes catalog categorized for farmers, students, women, and housing.

### 3. Role-Based Dashboards & Security
- **Role-Based JWT Auth**: 4 distinct user roles (**Citizen**, **Staff**, **Officer**, **Admin**).
- **Staff Workstation**: Update authorized live availability status (`PRESENT`, `BUSY`, `ON_LEAVE`, `OFFLINE`) and verify application documents.
- **Officer Review Portal**: Review verified applications, issue approvals, or record rejection reasons.
- **Admin Control Panel**: Full CRUD for Users, Staff, Services, Villages, Schemes, Notices, Complaints, and AI Knowledge Base.
- **Recharts Analytics**: Visual charts for application status breakdown and system workload.

### 4. AI & Voice Assistant
- **Rule-Based Verified Guidance**: Answers strictly from admin-managed knowledge base rules to prevent legal/fee hallucination.
- **Multilingual Support**: Supports English, Hindi, and Marathi answers.
- **Browser Voice Input**: Web Speech API integration for voice-to-text queries.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide React, Leaflet, Recharts, Vanilla CSS3.
- **Backend**: Python 3.14 / 3.12, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, bcrypt.
- **Database**: SQLite (local development) / PostgreSQL (production ready).

---

## 🚀 Running the Project Locally

### 1. Backend Setup
```bash
cd backend
source venv/bin/activate
export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`


### 2. Frontend Setup
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔑 Test Demo Credentials

| Role | Email | Password | Access & Features |
|------|-------|----------|-------------------|
| **Admin** | `admin@tehsil.gov.in` | `Admin@123` | Full system control, CRUD all modules, analytics |
| **Officer** | `officer@tehsil.gov.in` | `Officer@123` | Application approval/rejection, grievance review |
| **Staff** | `staff@tehsil.gov.in` | `Staff@123` | Document verification, live queue operator, presence status |
| **Citizen** | `citizen@example.com` | `Citizen@123` | Apply online, book appointments, token, track status |

---

## 🐳 Docker Support

To run the full stack with PostgreSQL via Docker Compose:
```bash
docker-compose up --build
```
