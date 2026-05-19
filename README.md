# 🔧 KaamWala — AI Service Orchestrator for Informal Economy

> کام والا — ذہین سروس بکنگ سسٹم

An **Agentic AI System** that automates the end-to-end lifecycle of a service request — from natural language user intent (Urdu/Roman Urdu/English) to provider discovery, ranking, booking, and follow-up.

Built for **AI Seekho Hackathon - Challenge 2** using **Google Antigravity** as the development IDE.

---

## 🎯 Problem Statement

Pakistan's informal economy (plumbers, electricians, AC technicians, tutors, beauticians) operates through WhatsApp, phone calls, and word-of-mouth. This leads to:
- Inefficient service matching
- Missed opportunities for providers
- Poor user experience for customers
- No automation in booking/follow-ups

**KaamWala** solves this with an AI-powered agentic system.

---

## 🏗️ System Architecture

```
User (Mobile App) → API Gateway (Express.js) → AI Agent Pipeline → Mock DB

AI Agent Pipeline (5 Agents):
  1. Intent Parser (Gemini API) — NLP understanding
  2. Provider Finder — Search & filter
  3. Ranker — Score & recommend
  4. Booking Agent — Simulate booking
  5. Follow-Up Agent — Schedule reminders

Trace Logger — Records all agent decisions
```

---

## ✨ Key Features

- **Multilingual NLP**: English, Urdu, Roman Urdu via Gemini 2.5 Flash
- **30+ Mock Providers**: Across Islamabad (AC, Plumber, Electrician, Tutor, Beautician, etc.)
- **Smart Ranking**: Distance (35%), Rating (30%), Reviews (15%), Verified (10%), Availability (10%)
- **Booking Simulation**: Slot assignment, bilingual confirmations, receipts
- **Follow-Up Automation**: 5 automated notifications per booking
- **Full Traceability**: Every agent decision logged with reasoning

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native + Expo |
| Backend API | Express.js (Node.js) |
| AI/NLP | Google Gemini API (gemini-2.5-flash) |
| Database | JSON files (mock) |
| IDE | Google Antigravity |

---

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Add your GEMINI_API_KEY
npm start              # Runs on http://localhost:3000
```

### Mobile App
```bash
cd mobile
npm install
# Edit src/constants/theme.js → set API_BASE_URL to your IP
npx expo start         # Scan QR with Expo Go
```

### Build APK
```bash
cd mobile
npx eas build -p android --profile preview
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/service-request` | Full AI pipeline |
| GET | `/api/bookings` | All bookings |
| GET | `/api/bookings/:userId` | User bookings |
| GET | `/api/trace` | All trace logs |
| GET | `/api/trace/:requestId` | Specific trace |
| GET | `/api/health` | Health check |

### Example
```bash
curl -X POST http://localhost:3000/api/service-request \
  -H "Content-Type: application/json" \
  -d '{"message": "Mujhe kal subah G-13 mein AC technician chahiye", "userId": "user123"}'
```

---

## 🤖 Agentic Pipeline

### Agent 1: Intent Parser
- Gemini API structured prompt for NLP
- Roman Urdu/Urdu/English support
- Fallback keyword parser (offline capable)

### Agent 2: Provider Finder
- Haversine distance calculation
- Sector coordinates for Islamabad
- Availability filtering

### Agent 3: Ranker
- Multi-criteria weighted scoring
- Natural language reasoning generation

### Agent 4: Booking Agent
- Slot assignment, bilingual confirmations
- Receipt generation, persistent storage

### Agent 5: Follow-Up Agent
- 5 scheduled notifications (reminder, en-route, started, completion, payment)
- Multi-channel: SMS, Push, In-App

---

## 📱 Mobile App Screens

1. **Home** — Input with example queries & pipeline progress animation
2. **Results** — Provider cards, AI reasoning, booking confirmation
3. **Booking Details** — Full confirmation with receipt
4. **My Bookings** — History
5. **Agent Trace** — Detailed reasoning logs

---

## 📊 Agent Trace Logs

All agent decisions are saved in `backend/logs/` as JSON files. Each trace includes:
- Step number, agent name, timestamp
- Input/output for each stage
- Natural language reasoning
- Duration in milliseconds

---

## 🏢 Antigravity Usage

Google Antigravity was the core IDE used for:
- Architecture design & planning
- All code generation (backend, agents, mobile app)
- Debugging and testing
- Documentation generation
- See `docs/ANTIGRAVITY.md` for details

---

## ⚠️ Assumptions & Limitations

- Provider data is mock/simulated (30 providers in Islamabad)
- Booking is simulated (no real payment integration)
- Follow-up notifications are simulated (logged, not sent)
- Gemini API needs internet (fallback works offline)
- Location matching uses sector names, not GPS

---

## 👥 Team

KaamWala Team — AI Seekho Hackathon 2026

## 📄 License

MIT License
