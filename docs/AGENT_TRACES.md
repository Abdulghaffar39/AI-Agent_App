# Agent Trace Logs Documentation

## What Are Agent Traces?

Agent traces are detailed logs that record every decision made by the AI agent pipeline during a service request. They provide **full transparency** into the system's reasoning process.

## Trace Structure

Each trace log contains:

```json
{
  "requestId": "unique-request-id",
  "totalDurationMs": 2500,
  "totalSteps": 7,
  "pipeline": [
    {
      "timestamp": "2026-05-19T00:00:00.000Z",
      "requestId": "...",
      "agent": "IntentParser",
      "step": "Parse User Intent",
      "input": { "userMessage": "Mujhe kal subah G-13 mein AC technician chahiye" },
      "output": {
        "service_type": "AC Technician",
        "location": "G-13",
        "time_expression": "kal subah",
        "urgency": "medium",
        "language_detected": "roman_urdu",
        "confidence": 0.95
      },
      "reasoning": "Detected language: roman_urdu. Extracted service: AC Technician, location: G-13, time: kal subah. Confidence: 0.95",
      "durationMs": 1200,
      "stepNumber": 1
    }
  ]
}
```

## How to Access Trace Logs

### Via API
```bash
# Get all trace logs
GET http://localhost:3000/api/trace

# Get trace for specific request
GET http://localhost:3000/api/trace/{requestId}
```

### Via Files
Trace logs are saved as JSON files in `backend/logs/` directory:
```
backend/logs/
├── trace_abc123_1716076800000.json
├── trace_def456_1716076900000.json
└── ...
```

### Via Mobile App
Navigate to any Results screen → tap "View Agent Trace Logs" button.

## Sample Complete Trace

A typical service request generates 7 trace entries:

| Step | Agent | Action | Duration |
|------|-------|--------|----------|
| 1 | Orchestrator | Pipeline Started | 0ms |
| 2 | IntentParser | Parse User Intent | ~1200ms |
| 3 | ProviderFinder | Find Matching Providers | ~5ms |
| 4 | Ranker | Rank & Recommend Providers | ~2ms |
| 5 | BookingAgent | Simulate Booking | ~3ms |
| 6 | FollowUpAgent | Schedule Follow-Ups | ~1ms |
| 7 | Orchestrator | Pipeline Completed | 0ms |

## What's Logged

For each agent step:
- **Input**: What data the agent received
- **Output**: What the agent produced
- **Reasoning**: Why the agent made its decision (natural language)
- **Duration**: How long the step took
- **Timestamp**: Exact time of execution
