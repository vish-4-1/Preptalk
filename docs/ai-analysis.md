# AI Placement Reasoning Service (Groq & Grok API Support)

## Overview

PrepTrack supports both **Groq Cloud API** (`groq.com` with ultra-low latency models like `llama-3.3-70b-versatile` / `mixtral-8x7b-32768`) and **xAI Grok API** (`x.ai` with `grok-beta` / `grok-2-1212`) as server-side AI reasoning providers.

## Provider Order & Resolution

1. **Groq Cloud API (`GROQ_API_KEY`)**: Checked first if configured in `.env`. Calls `https://api.groq.com/openai/v1/chat/completions`.
2. **xAI Grok API (`GROK_API_KEY`)**: Checked if configured in `.env`. Calls `https://api.x.ai/v1/chat/completions`.
3. **Deterministic Fallback Engine**: If no API keys are provided or if external API requests time out, `GrokService` automatically invokes `generateFallbackAnalysis()` — generating structured recommendations directly from normalized student telemetry.

## Schema Validation

All AI responses are formatted using OpenAI-compatible JSON mode (`response_format: { type: 'json_object' }`) and parsed against `grokResponseSchema` using Zod before saving to PostgreSQL/Prisma.
