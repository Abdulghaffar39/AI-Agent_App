# System Architecture

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      MOBILE APP (Expo)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Home    │  │ Results  │  │ Booking  │  │  Trace   │      │
│  │  Screen  │→ │  Screen  │→ │  Screen  │  │  Screen  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                      ↕ HTTP API                                │
└────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  POST /api/service-request                             │    │
│  │  GET  /api/bookings                                    │    │
│  │  GET  /api/trace                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                       │                                        │
│                       ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              ORCHESTRATOR                               │    │
│  │                                                         │    │
│  │  ┌─────────────┐     ┌─────────────────┐               │    │
│  │  │   Agent 1   │     │   TRACE LOGGER  │               │    │
│  │  │ IntentParser │────→│  Logs every     │               │    │
│  │  │ (Gemini API)│     │  decision with  │               │    │
│  │  └──────┬──────┘     │  reasoning      │               │    │
│  │         ↓            └─────────────────┘               │    │
│  │  ┌──────┴──────┐                                       │    │
│  │  │   Agent 2   │                                       │    │
│  │  │ ProviderFind│──→ providers.json                     │    │
│  │  └──────┬──────┘                                       │    │
│  │         ↓                                               │    │
│  │  ┌──────┴──────┐                                       │    │
│  │  │   Agent 3   │                                       │    │
│  │  │   Ranker    │  Weights: Dist 35%, Rate 30%,         │    │
│  │  └──────┬──────┘  Reviews 15%, Verified 10%, Avail 10% │    │
│  │         ↓                                               │    │
│  │  ┌──────┴──────┐                                       │    │
│  │  │   Agent 4   │                                       │    │
│  │  │BookingAgent │──→ bookings.json                      │    │
│  │  └──────┬──────┘                                       │    │
│  │         ↓                                               │    │
│  │  ┌──────┴──────┐                                       │    │
│  │  │   Agent 5   │                                       │    │
│  │  │ FollowUpAgt │──→ Scheduled notifications            │    │
│  │  └─────────────┘                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                       │                                        │
│                       ▼                                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ providers   │  │ bookings     │  │ logs/        │         │
│  │ .json       │  │ .json        │  │ trace_*.json │         │
│  └─────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Input** → Mobile app sends natural language message to backend
2. **Intent Parsing** → Gemini API extracts service type, location, time
3. **Provider Search** → Filters mock DB by service type + location proximity
4. **Ranking** → Weighted scoring algorithm ranks providers
5. **Booking** → Simulates booking with slot assignment and confirmation
6. **Follow-Up** → Schedules reminder notifications
7. **Response** → Returns complete result with trace logs to mobile app

## Agent Communication

All agents communicate through the **Orchestrator** which:
- Executes agents in strict sequence
- Passes output of each agent as input to the next
- Captures trace logs at every step
- Handles errors with graceful fallbacks

## File Structure

```
kaamwala/
├── backend/
│   ├── server.js                 # Express entry point
│   ├── agents/
│   │   ├── orchestrator.js       # Pipeline coordinator
│   │   ├── intentParser.js       # Agent 1: NLP
│   │   ├── providerFinder.js     # Agent 2: Search
│   │   ├── ranker.js             # Agent 3: Scoring
│   │   ├── bookingAgent.js       # Agent 4: Booking
│   │   ├── followUpAgent.js      # Agent 5: Follow-up
│   │   └── traceLogger.js        # Decision logging
│   ├── routes/                   # API endpoints
│   ├── data/                     # Mock database (JSON)
│   ├── logs/                     # Saved trace logs
│   ├── middleware/               # Request logger
│   └── utils/                    # Helper functions
├── mobile/
│   ├── App.js                    # Navigation setup
│   └── src/
│       ├── screens/              # 5 app screens
│       └── constants/            # Theme & config
├── docs/                         # Documentation
├── README.md                     # Project overview
└── PROJECT_STATUS.md             # Build status tracker
```
