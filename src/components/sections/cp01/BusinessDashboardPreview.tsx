"use client";

import { motion } from "motion/react";
import { useState } from "react";

type PeriodKey = "today" | "7d" | "30d";
type ChannelKey = "all" | "online" | "store";

interface QueueOrder {
  id: string;
  item: string;
  channel: "Online" | "Store";
  status: "Queued" | "In Progress" | "Dispatched";
}

const KPI_DATA: Record<
  PeriodKey,
  Record<
    ChannelKey,
    {
      revenue: string;
      orders: string;
      sla: string;
      aov: string;
      onlineSeries: number[];
      storeSeries: number[];
    }
  >
> = {
  today: {
    all: {
      revenue: "Rp 8.4M",
      orders: "94",
      sla: "97%",
      aov: "Rp 89K",
      onlineSeries: [18, 28, 36, 44, 58, 69, 82],
      storeSeries: [22, 31, 40, 48, 52, 61, 74],
    },
    online: {
      revenue: "Rp 4.1M",
      orders: "44",
      sla: "96%",
      aov: "Rp 93K",
      onlineSeries: [18, 28, 36, 44, 58, 69, 82],
      storeSeries: [0, 0, 0, 0, 0, 0, 0],
    },
    store: {
      revenue: "Rp 4.3M",
      orders: "50",
      sla: "98%",
      aov: "Rp 86K",
      onlineSeries: [0, 0, 0, 0, 0, 0, 0],
      storeSeries: [22, 31, 40, 48, 52, 61, 74],
    },
  },
  "7d": {
    all: {
      revenue: "Rp 56.2M",
      orders: "618",
      sla: "96%",
      aov: "Rp 91K",
      onlineSeries: [42, 48, 54, 62, 71, 84, 92],
      storeSeries: [50, 46, 58, 60, 68, 75, 81],
    },
    online: {
      revenue: "Rp 28.9M",
      orders: "302",
      sla: "95%",
      aov: "Rp 96K",
      onlineSeries: [42, 48, 54, 62, 71, 84, 92],
      storeSeries: [0, 0, 0, 0, 0, 0, 0],
    },
    store: {
      revenue: "Rp 27.3M",
      orders: "316",
      sla: "98%",
      aov: "Rp 86K",
      onlineSeries: [0, 0, 0, 0, 0, 0, 0],
      storeSeries: [50, 46, 58, 60, 68, 75, 81],
    },
  },
  "30d": {
    all: {
      revenue: "Rp 234M",
      orders: "2,540",
      sla: "97%",
      aov: "Rp 92K",
      onlineSeries: [35, 49, 55, 67, 74, 88, 96],
      storeSeries: [48, 54, 61, 63, 70, 77, 85],
    },
    online: {
      revenue: "Rp 121M",
      orders: "1,260",
      sla: "96%",
      aov: "Rp 96K",
      onlineSeries: [35, 49, 55, 67, 74, 88, 96],
      storeSeries: [0, 0, 0, 0, 0, 0, 0],
    },
    store: {
      revenue: "Rp 113M",
      orders: "1,280",
      sla: "98%",
      aov: "Rp 88K",
      onlineSeries: [0, 0, 0, 0, 0, 0, 0],
      storeSeries: [48, 54, 61, 63, 70, 77, 85],
    },
  },
};

const TOP_ITEMS = [
  { name: "Signature Tiramisu Box", pct: 86, share: "34%" },
  { name: "Basque Burnt Cheesecake", pct: 68, share: "27%" },
  { name: "Belgian Fudge Brownies", pct: 54, share: "21%" },
];

const INITIAL_QUEUE: QueueOrder[] = [
  { id: "#408", item: "Tiramisu Box ×6", channel: "Online", status: "Queued" },
  { id: "#407", item: "Cheesecake Whole", channel: "Store", status: "In Progress" },
  { id: "#406", item: "Mille Crêpe ×4", channel: "Online", status: "In Progress" },
  { id: "#405", item: "Assorted Pudding ×12", channel: "Store", status: "Dispatched" },
];

const NEXT_STATUS: Record<QueueOrder["status"], QueueOrder["status"]> = {
  Queued: "In Progress",
  "In Progress": "Dispatched",
  Dispatched: "Queued",
};

function toPoints(series: number[]): string {
  return series
    .map((val, idx) => `${(idx / (series.length - 1)) * 100},${96 - val * 0.85}`)
    .join(" ");
}

export function BusinessDashboardPreview() {
  const [period, setPeriod] = useState<PeriodKey>("7d");
  const [channel, setChannel] = useState<ChannelKey>("all");
  const [queue, setQueue] = useState<QueueOrder[]>(INITIAL_QUEUE);

  const view = KPI_DATA[period][channel];

  function cycleOrder(id: string) {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: NEXT_STATUS[q.status] } : q)),
    );
  }

  return (
    <div className="space-y-4">
      {/* Interactive Time Range & Channel Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-grid-strong bg-surface/60 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`hud px-3 py-1.5 transition-colors ${
                period === p.id
                  ? "bg-signal text-white"
                  : "border border-grid-strong bg-canvas text-secondary hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "all", label: "All Channels" },
              { id: "online", label: "Online Delivery" },
              { id: "store", label: "Walk-In Store" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChannel(c.id)}
              className={`hud px-3 py-1.5 transition-colors ${
                channel === c.id
                  ? "border border-telemetry bg-telemetry/15 text-telemetry"
                  : "border border-grid bg-canvas text-muted hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Card Live KPI Strip */}
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Net Revenue", val: view.revenue, accent: "text-telemetry" },
          { label: "Orders Completed", val: view.orders, accent: "text-ink" },
          { label: "On-Time Fulfillment", val: view.sla, accent: "text-signal" },
          { label: "Avg. Order Value", val: view.aov, accent: "text-ink" },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-grid-strong bg-canvas/90 p-3.5">
            <dt className="hud text-muted">{kpi.label}</dt>
            <dd className={`mt-1 font-mono text-xl font-extrabold sm:text-2xl tabular ${kpi.accent}`}>
              {kpi.val}
            </dd>
          </div>
        ))}
      </dl>

      {/* Split Lower View: Dual-Series Trend Chart + Actionable Production Queue */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Trend Chart & Top SKUs */}
        <div className="flex flex-col justify-between gap-4 border border-grid-strong bg-surface/60 p-4 lg:col-span-7">
          <div>
            <div className="hud mb-3 flex items-center justify-between text-muted">
              <span>CHANNEL VOLUME TREND</span>
              <span className="flex items-center gap-3">
                <span className="text-telemetry">● Online</span>
                <span className="text-signal">● Walk-In</span>
              </span>
            </div>

            <div className="border border-grid bg-canvas p-3">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-28 w-full"
                role="img"
                aria-label="Online versus walk-in store volume chart"
              >
                {channel !== "store" && (
                  <motion.polyline
                    key={`on-${period}-${channel}`}
                    points={toPoints(view.onlineSeries)}
                    fill="none"
                    stroke="var(--accent-telemetry)"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                )}
                {channel !== "online" && (
                  <motion.polyline
                    key={`st-${period}-${channel}`}
                    points={toPoints(view.storeSeries)}
                    fill="none"
                    stroke="var(--accent-signal)"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                )}
              </svg>
            </div>
          </div>

          <div className="space-y-2 border-t border-grid pt-3">
            <div className="hud text-muted">TOP MOVING PRODUCTS</div>
            {TOP_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center gap-3 font-mono text-xs">
                <span className="w-32 shrink-0 truncate text-secondary sm:w-40">{item.name}</span>
                <div className="h-2 flex-1 bg-canvas">
                  <div className="h-full bg-telemetry" style={{ width: `${item.pct}%` }} />
                </div>
                <span className="w-9 text-right font-bold text-ink">{item.share}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Clickable Live Production & Dispatch Queue */}
        <div className="flex flex-col justify-between border border-grid-strong bg-canvas/90 p-4 lg:col-span-5">
          <div>
            <div className="hud mb-3 flex items-center justify-between text-muted">
              <span>PRODUCTION QUEUE</span>
              <span className="text-telemetry">CLICK ROW TO ADVANCE</span>
            </div>

            <div className="space-y-2">
              {queue.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => cycleOrder(order.id)}
                  className="flex w-full items-center justify-between gap-2 border border-grid bg-surface/70 px-3 py-2.5 text-left transition-colors hover:border-telemetry"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-signal">{order.id}</span>
                      <span className="truncate font-semibold text-ink">{order.item}</span>
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-muted">{order.channel} Channel</div>
                  </div>
                  <span
                    className={`hud shrink-0 px-2 py-1 text-[10px] font-bold ${
                      order.status === "Dispatched"
                        ? "bg-telemetry/15 text-telemetry"
                        : order.status === "In Progress"
                          ? "bg-signal/15 text-signal"
                          : "border border-grid-strong bg-canvas text-secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="hud mt-4 border-t border-grid pt-3 text-muted">
            SAMPLE OPS DATA · MODELLED AFTER BALI F&amp;B WORKFLOW
          </div>
        </div>
      </div>
    </div>
  );
}
