# `abdul-aziz-mcp`

Zero-dependency Model Context Protocol (MCP) server exposing Abdul Aziz's engineering background, local LLM benchmarks (Qwen, Gemma, GLM), and verified endurance race telemetry.

## Run locally

```bash
node mcp-server/index.mjs
```

## Connect to Claude Desktop, Cursor, Hermes, or OpenClaw

```json
{
  "mcpServers": {
    "abdul-aziz": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.mjs"]
    }
  }
}
```

## Exposed Tools
- `get_candidate_profile` — summary, degree, location, relocation status, contact links.
- `search_experience` — filter work and leadership records by keyword or tech stack.
- `query_llm_benchmarks` — inspect Qwen / Gemma / GLM local inference benchmarks.
- `get_endurance_races` — official verified timing links (15 KM → 60 KM).
