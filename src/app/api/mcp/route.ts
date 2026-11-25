import { NextResponse } from "next/server";
import { executeMcpTool, MCP_TOOLS } from "@/lib/mcpTools";
import { checkRateLimit, getClientIp, PayloadError, readBoundedJson } from "@/lib/rateLimit";

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: {
    name?: string;
    arguments?: unknown;
  };
}

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  const t0 = performance.now();
  const ip = getClientIp(request);

  if (checkRateLimit(`mcp:${ip}`, 40, 60_000)) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32000, message: "Rate limit exceeded (40/min)." } },
      { status: 429, headers: NO_STORE_HEADERS },
    );
  }

  let body: JsonRpcRequest;
  try {
    body = await readBoundedJson<JsonRpcRequest>(request, 16_384);
  } catch (err) {
    const status = err instanceof PayloadError ? err.status : 400;
    const message = err instanceof Error ? err.message : "Parse error: invalid JSON";
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message } },
      { status, headers: NO_STORE_HEADERS },
    );
  }

  const id = body.id ?? 1;
  const method = body.method ?? "";

  try {
    if (method === "initialize") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "abdul-aziz-mcp", version: "1.0.0" },
          },
          _meta: { durationMs: Number((performance.now() - t0).toFixed(2)) },
        },
        { headers: NO_STORE_HEADERS },
      );
    }

    if (method === "tools/list") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            tools: MCP_TOOLS.map(({ name, description, inputSchema }) => ({
              name,
              description,
              inputSchema,
            })),
          },
          _meta: { durationMs: Number((performance.now() - t0).toFixed(2)) },
        },
        { headers: NO_STORE_HEADERS },
      );
    }

    if (method === "tools/call") {
      const toolName = typeof body.params?.name === "string" ? body.params.name : "";
      const rawArgs = body.params?.arguments;
      if (rawArgs !== undefined && (typeof rawArgs !== "object" || rawArgs === null || Array.isArray(rawArgs))) {
        return NextResponse.json(
          { jsonrpc: "2.0", id, error: { code: -32602, message: "Invalid params: arguments must be an object." } },
          { status: 400, headers: NO_STORE_HEADERS },
        );
      }

      const data = executeMcpTool(toolName, (rawArgs as Record<string, unknown> | undefined) ?? {});
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            structuredContent: data,
          },
          _meta: { durationMs: Number((performance.now() - t0).toFixed(2)) },
        },
        { headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(
      { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } },
      { status: 404, headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: err instanceof Error ? err.message : "Tool execution error" },
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }
}
