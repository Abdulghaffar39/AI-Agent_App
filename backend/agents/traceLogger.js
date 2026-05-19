const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

class TraceLogger {
  constructor(requestId) {
    this.requestId = requestId;
    this.traces = [];
    this.startTime = Date.now();
  }

  log(agentName, step, input, output, reasoning, durationMs) {
    const entry = {
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      agent: agentName,
      step: step,
      input: input,
      output: output,
      reasoning: reasoning,
      durationMs: durationMs || 0,
      stepNumber: this.traces.length + 1
    };
    this.traces.push(entry);
    console.log(`[TRACE] Agent: ${agentName} | Step: ${step} | Duration: ${durationMs}ms`);
    return entry;
  }

  getTraces() {
    return {
      requestId: this.requestId,
      totalDurationMs: Date.now() - this.startTime,
      totalSteps: this.traces.length,
      pipeline: this.traces
    };
  }

  // Save traces to file for submission
  saveToFile() {
    const filename = `trace_${this.requestId}_${Date.now()}.json`;
    const filepath = path.join(LOGS_DIR, filename);
    const data = JSON.stringify(this.getTraces(), null, 2);
    fs.writeFileSync(filepath, data, 'utf-8');
    console.log(`[TRACE] Saved to ${filepath}`);
    return filepath;
  }

  // Get all saved trace logs
  static getAllLogs() {
    if (!fs.existsSync(LOGS_DIR)) return [];
    const files = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.json'));
    return files.map(f => {
      const content = fs.readFileSync(path.join(LOGS_DIR, f), 'utf-8');
      return JSON.parse(content);
    });
  }

  // Get trace by requestId
  static getByRequestId(requestId) {
    if (!fs.existsSync(LOGS_DIR)) return null;
    const files = fs.readdirSync(LOGS_DIR).filter(f => f.includes(requestId));
    if (files.length === 0) return null;
    const content = fs.readFileSync(path.join(LOGS_DIR, files[0]), 'utf-8');
    return JSON.parse(content);
  }
}

module.exports = TraceLogger;
