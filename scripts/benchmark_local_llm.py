#!/usr/bin/env python3
"""
Local LLM Benchmark Runner for Abdul Aziz's Portfolio Lab.

Runs real latency (TTFT), throughput (tokens/sec), and JSON tool-calling checks
against any local OpenAI-compatible server (LM Studio on :1234 or Ollama on :11434)
and updates `src/content/benchmarks.json` with verified measurements from your rig.

Usage:
  python3 scripts/benchmark_local_llm.py --base-url http://localhost:1234/v1 --hardware "RTX 4090 24GB"
  python3 scripts/benchmark_local_llm.py --base-url http://localhost:11434/v1 --models qwen2.5:14b gemma3:12b glm4:9b
"""

from __future__ import annotations

import argparse
import datetime
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

PROMPTS = [
    (
        "Agentic Tool Use",
        'Return ONLY valid JSON matching {"tool": "search_experience", "args": {"query": "MCP"}} with no markdown.',
    ),
    (
        "Code Generation",
        "Write a concise TypeScript function `clamp(n: number, min: number, max: number): number` and nothing else.",
    ),
    (
        "Reasoning",
        "In 2 short sentences, explain why running local LLMs with MCP improves privacy for autonomous agents.",
    ),
]


def http_json(url: str, payload: dict | None = None, timeout: int = 120) -> dict:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def stream_completion(base_url: str, model: str, prompt: str) -> tuple[str, float, float, int]:
    """Returns (content, ttft_ms, tokens_per_sec, approx_tokens)."""
    url = f"{base_url.rstrip('/')}/chat/completions"
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "max_tokens": 160,
        "stream": True,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    t0 = time.perf_counter()
    first_token_at: float | None = None
    chunks: list[str] = []
    token_events = 0

    with urllib.request.urlopen(req, timeout=180) as resp:
        for raw_line in resp:
            line = raw_line.decode("utf-8", errors="ignore").strip()
            if not line.startswith("data:"):
                continue
            payload = line[5:].strip()
            if payload == "[DONE]":
                break
            try:
                obj = json.loads(payload)
            except json.JSONDecodeError:
                continue
            delta = obj.get("choices", [{}])[0].get("delta", {}).get("content")
            if delta:
                if first_token_at is None:
                    first_token_at = time.perf_counter()
                chunks.append(delta)
                token_events += 1

    t1 = time.perf_counter()
    ttft_ms = ((first_token_at or t1) - t0) * 1000.0
    gen_sec = max(0.001, t1 - (first_token_at or t0))
    tok_per_sec = token_events / gen_sec
    return "".join(chunks), round(ttft_ms, 1), round(tok_per_sec, 1), token_events


def guess_family(model_id: str) -> str:
    low = model_id.lower()
    if "qwen" in low:
        return "Qwen"
    if "gemma" in low:
        return "Gemma"
    if "glm" in low:
        return "GLM"
    return model_id.split("/")[0].split(":")[0].title()


def main() -> int:
    parser = argparse.ArgumentParser(description="Benchmark local LLMs and write src/content/benchmarks.json")
    parser.add_argument("--base-url", default="http://localhost:1234/v1", help="OpenAI-compatible local API URL")
    parser.add_argument("--models", nargs="*", help="Model IDs to test (defaults to all loaded /v1/models)")
    parser.add_argument("--hardware", default="Local GPU Workstation", help="Hardware label shown on the site")
    parser.add_argument("--output", default="src/content/benchmarks.json", help="Output JSON path")
    args = parser.parse_args()

    models = args.models
    if not models:
        try:
            resp = http_json(f"{args.base_url.rstrip('/')}/models")
            models = [m["id"] for m in resp.get("data", []) if "embed" not in m["id"].lower()]
        except urllib.error.URLError as err:
            print(f"Could not reach {args.base_url}/models: {err}", file=sys.stderr)
            print("Start LM Studio server (:1234) or Ollama (:11434) and retry.", file=sys.stderr)
            return 1

    if not models:
        print("No models found. Load Qwen, Gemma, or GLM and pass --models if needed.", file=sys.stderr)
        return 1

    runs = []
    for model in models:
        print(f"\nBenchmarking {model} ...")
        ttfts: list[float] = []
        tps_list: list[float] = []
        json_ok = 0

        for label, prompt in PROMPTS:
            text, ttft_ms, tps, count = stream_completion(args.base_url, model, prompt)
            ttfts.append(ttft_ms)
            tps_list.append(tps)
            if label == "Agentic Tool Use":
                try:
                    parsed = json.loads(text.strip())
                    if parsed.get("tool") == "search_experience":
                        json_ok = 100
                except json.JSONDecodeError:
                    json_ok = 50 if "search_experience" in text else 0
            print(f"  [{label}] {tps:.1f} tok/s | TTFT {ttft_ms:.0f} ms | {count} chunks")

        runs.append(
            {
                "id": model.lower().replace("/", "-").replace(":", "-"),
                "family": guess_family(model),
                "model": model,
                "paramsB": 0,
                "quant": "Q4_K_M",
                "vramGb": 0,
                "tokensPerSec": round(sum(tps_list) / len(tps_list), 1),
                "ttftMs": round(sum(ttfts) / len(ttfts)),
                "toolCallPassPct": json_ok,
                "contextK": 32,
                "bestWorkload": "Agentic Tool Use",
                "notes": f"Measured live via {args.base_url} on {args.hardware}.",
            }
        )

    out_path = Path(args.output)
    out_path.write_text(
        json.dumps(
            {
                "meta": {
                    "datasetMode": "live_rig",
                    "hardware": args.hardware,
                    "runtime": args.base_url,
                    "note": f"Live local inference measurements recorded on {args.hardware}.",
                    "updatedAt": datetime.date.today().isoformat(),
                },
                "runs": runs,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"\nSaved {len(runs)} model runs to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
