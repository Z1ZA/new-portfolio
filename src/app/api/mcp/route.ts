import { NextResponse } from "next/server";
import { executeMcpTool, MCP_TOOLS } from "@/lib/mcpTools";

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
}

export async function POST(request: Request) {
  const t0 = performance.now();
  let body: JsonRpcRequest;

  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: invalid JSON" } },
      { status: 400 },
    );
  }

  const id = body.id ?? 1;
  const method = body.method ?? "";

  try {
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "abdul-aziz-mcp", version: "1.0.0" },
        },
        _meta: { durationMs: Number((performance.now() - t0).toFixed(2)) },
      });
    }

    if (method === "tools/list") {
      return NextResponse.json({
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
      });
    }

    if (method === "tools/call") {
      const toolName = body.params?.name ?? "";
      const toolArgs = body.params?.arguments ?? {};
      const data = executeMcpTool(toolName, toolArgs);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
        },
        _meta: { durationMs: Number((performance.now() - t0).toFixed(2)) },
      });
    }

    return NextResponse.json(
      { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } },
      { status: 404 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: err instanceof Error ? err.message : "Tool execution error" },
      },
      { status: 400 },
    );
  }
}
