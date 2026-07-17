"use client";

import { type CSSProperties } from "react";
import { SystemHomeLink, SystemNavigation } from "@/app/components/SystemNavigation";
import { TrendLineChart } from "@/app/components/TrendLineChart";
import { usePersistentState } from "@/app/components/usePersistentState";
import Link from "next/link";

type DemoMode = "normal" | "warning" | "abnormal";
type MetricStatus = "正常" | "预警" | "异常";

const metricDefinitions: Record<
  string,
  { name: string; unit: string; normalRange: string }
> = {
  temperature: { name: "水温", unit: "℃", normalRange: "20.0–24.0℃" },
  ph: { name: "pH", unit: "", normalRange: "7.80–8.50" },
  "dissolved-oxygen": { name: "溶解氧", unit: " mg/L", normalRange: "6.0–9.0 mg/L" },
  salinity: { name: "盐度", unit: "‰", normalRange: "28.0–32.0‰" },
  turbidity: { name: "浊度", unit: " NTU", normalRange: "0–4.0 NTU" },
  "ammonia-nitrogen": { name: "氨氮", unit: " mg/L", normalRange: "0–0.10 mg/L" },
};

type MetricReading = {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  value: string;
  status: MetricStatus;
};

type GaugeZone = {
  from: number;
  to: number;
  color: string;
};

type GaugeConfig = {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  zones: GaugeZone[];
};

const gaugeConfigs: Record<string, GaugeConfig> = {
  temperature: {
    min: 18,
    max: 28,
    minLabel: "18",
    maxLabel: "28",
    zones: [
      { from: 18, to: 19, color: "#FF0000" },
      { from: 19, to: 20, color: "#FFD400" },
      { from: 20, to: 24, color: "#00E676" },
      { from: 24, to: 25, color: "#FFD400" },
      { from: 25, to: 28, color: "#FF0000" },
    ],
  },
  ph: {
    min: 7,
    max: 9,
    minLabel: "7",
    maxLabel: "9",
    zones: [
      { from: 7, to: 7.5, color: "#FF0000" },
      { from: 7.5, to: 7.8, color: "#FFD400" },
      { from: 7.8, to: 8.5, color: "#00E676" },
      { from: 8.5, to: 8.6, color: "#FFD400" },
      { from: 8.6, to: 9, color: "#FF0000" },
    ],
  },
  "dissolved-oxygen": {
    min: 3,
    max: 10,
    minLabel: "3",
    maxLabel: "10",
    zones: [
      { from: 3, to: 5, color: "#FF0000" },
      { from: 5, to: 6, color: "#FFD400" },
      { from: 6, to: 9, color: "#00E676" },
      { from: 9, to: 9.5, color: "#FFD400" },
      { from: 9.5, to: 10, color: "#FF0000" },
    ],
  },
  salinity: {
    min: 24,
    max: 36,
    minLabel: "24",
    maxLabel: "36",
    zones: [
      { from: 24, to: 26, color: "#FF0000" },
      { from: 26, to: 28, color: "#FFD400" },
      { from: 28, to: 32, color: "#00E676" },
      { from: 32, to: 32.5, color: "#FFD400" },
      { from: 32.5, to: 36, color: "#FF0000" },
    ],
  },
  turbidity: {
    min: 0,
    max: 8,
    minLabel: "0",
    maxLabel: "8",
    zones: [
      { from: 0, to: 4, color: "#00E676" },
      { from: 4, to: 5.5, color: "#FFD400" },
      { from: 5.5, to: 8, color: "#FF0000" },
    ],
  },
  "ammonia-nitrogen": {
    min: 0,
    max: 0.25,
    minLabel: "0",
    maxLabel: "0.25",
    zones: [
      { from: 0, to: 0.1, color: "#00E676" },
      { from: 0.1, to: 0.15, color: "#FFD400" },
      { from: 0.15, to: 0.25, color: "#FF0000" },
    ],
  },
};

const statusColors: Partial<Record<MetricStatus, string>> = {
  正常: "#00E676",
  预警: "#FFD400",
  异常: "#FF0000",
};

const gaugePoint = (value: number, config: GaugeConfig, radius: number) => {
  const ratio = Math.min(1, Math.max(0, (value - config.min) / (config.max - config.min)));
  const radians = ((135 + ratio * 270) * Math.PI) / 180;
  return {
    x: 110 + radius * Math.cos(radians),
    y: 98 + radius * Math.sin(radians),
  };
};

const gaugeArcPath = (from: number, to: number, config: GaugeConfig) => {
  const start = gaugePoint(from, config, 79);
  const end = gaugePoint(to, config, 79);
  const ratio = (to - from) / (config.max - config.min);
  return `M ${start.x} ${start.y} A 79 79 0 ${ratio > 0.5 ? 1 : 0} 1 ${end.x} ${end.y}`;
};

function MetricGauge({
  metric,
  selected,
  onSelect,
}: {
  metric: MetricReading;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = gaugeConfigs[metric.id];
  const numericValue = Number.parseFloat(metric.value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : config.min;
  const ratio = Math.min(1, Math.max(0, (safeValue - config.min) / (config.max - config.min)));
  const needleAngle = -135 + ratio * 270;
  const pointerColor = statusColors[metric.status] ?? "#0066FF";
  const needleStyle = {
    "--gauge-angle": `${needleAngle}deg`,
    "--gauge-color": pointerColor,
  } as CSSProperties;
  const statusClass = metric.status === "正常"
    ? "is-normal"
    : metric.status === "预警"
      ? "is-warning"
      : metric.status === "异常"
        ? "is-abnormal"
        : "is-unknown";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${metric.name}，当前数值${metric.value}${metric.unit}，状态${metric.status}`}
      className={`metric-gauge-card ${selected ? "is-selected" : ""}`}
    >
      <span className="metric-gauge-layout">
        <span className="metric-gauge-dial" aria-hidden="true">
          <svg className="metric-gauge-svg" viewBox="0 0 220 184">
            <path
              className="metric-gauge-track"
              d={gaugeArcPath(config.min, config.max, config)}
            />
            {config.zones.map((zone) => (
              <path
                key={`${zone.from}-${zone.to}`}
                className="metric-gauge-zone"
                d={gaugeArcPath(zone.from, zone.to, config)}
                stroke={zone.color}
              />
            ))}
            {Array.from({ length: 21 }, (_, index) => {
              const tickValue = config.min + ((config.max - config.min) * index) / 20;
              const outer = gaugePoint(tickValue, config, 92);
              const inner = gaugePoint(tickValue, config, index % 5 === 0 ? 82 : 86);
              return (
                <line
                  key={index}
                  className={index % 5 === 0 ? "metric-gauge-tick is-major" : "metric-gauge-tick"}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                />
              );
            })}
            <g className="metric-gauge-needle-position" style={needleStyle}>
              <g className="metric-gauge-needle-sway">
                <line className="metric-gauge-needle" x1="110" y1="98" x2="110" y2="31" />
              </g>
            </g>
            <circle className="metric-gauge-hub-ring" cx="110" cy="98" r="13" />
            <circle className="metric-gauge-hub" cx="110" cy="98" r="7" style={{ fill: pointerColor }} />
            <text className="metric-gauge-endpoint" x="23" y="174">{config.minLabel}</text>
            <text className="metric-gauge-endpoint" x="197" y="174" textAnchor="end">{config.maxLabel}</text>
          </svg>
        </span>
        <span className="metric-gauge-copy">
          <span className="metric-gauge-name">{metric.name}</span>
          <strong className="metric-gauge-value">
            {metric.value}<small>{metric.unit}</small>
          </strong>
          <span className="metric-gauge-range">正常范围：{metric.normalRange}</span>
        </span>
        <span className="metric-gauge-status-strip" aria-hidden="true">
          <span className={statusClass === "is-normal" ? "is-active is-normal" : ""}>正常</span>
          <span className={statusClass === "is-warning" ? "is-active is-warning" : ""}>预警</span>
          <span className={statusClass === "is-abnormal" ? "is-active is-abnormal" : ""}>异常</span>
        </span>
      </span>
    </button>
  );
}

const reading = (
  id: string,
  value: string,
  status: MetricStatus,
): MetricReading => ({ ...metricDefinitions[id], id, value, status });

const poolMetricScenarios: Record<string, Record<DemoMode, MetricReading[]>> = {
  "pool-1": {
    normal: [reading("temperature", "22.6", "正常"), reading("ph", "8.12", "正常"), reading("dissolved-oxygen", "7.4", "正常"), reading("salinity", "30.8", "正常"), reading("turbidity", "3.2", "正常"), reading("ammonia-nitrogen", "0.06", "正常")],
    warning: [reading("temperature", "24.1", "预警"), reading("ph", "8.34", "正常"), reading("dissolved-oxygen", "5.9", "预警"), reading("salinity", "31.5", "正常"), reading("turbidity", "4.5", "预警"), reading("ammonia-nitrogen", "0.11", "预警")],
    abnormal: [reading("temperature", "25.4", "异常"), reading("ph", "8.63", "异常"), reading("dissolved-oxygen", "4.8", "异常"), reading("salinity", "33.0", "异常"), reading("turbidity", "6.5", "异常"), reading("ammonia-nitrogen", "0.17", "异常")],
  },
  "pool-2": {
    normal: [reading("temperature", "24.2", "正常"), reading("ph", "8.36", "正常"), reading("dissolved-oxygen", "5.7", "预警"), reading("salinity", "31.4", "正常"), reading("turbidity", "4.6", "预警"), reading("ammonia-nitrogen", "0.10", "预警")],
    warning: [reading("temperature", "24.7", "预警"), reading("ph", "8.42", "正常"), reading("dissolved-oxygen", "5.4", "预警"), reading("salinity", "31.8", "正常"), reading("turbidity", "5.0", "预警"), reading("ammonia-nitrogen", "0.13", "预警")],
    abnormal: [reading("temperature", "25.2", "异常"), reading("ph", "8.61", "异常"), reading("dissolved-oxygen", "4.8", "异常"), reading("salinity", "32.8", "异常"), reading("turbidity", "6.2", "异常"), reading("ammonia-nitrogen", "0.17", "异常")],
  },
  "pool-3": {
    normal: [reading("temperature", "25.8", "异常"), reading("ph", "8.72", "异常"), reading("dissolved-oxygen", "4.6", "异常"), reading("salinity", "33.4", "异常"), reading("turbidity", "6.8", "异常"), reading("ammonia-nitrogen", "0.18", "异常")],
    warning: [reading("temperature", "25.0", "预警"), reading("ph", "8.56", "预警"), reading("dissolved-oxygen", "5.3", "预警"), reading("salinity", "32.4", "预警"), reading("turbidity", "5.4", "预警"), reading("ammonia-nitrogen", "0.14", "预警")],
    abnormal: [reading("temperature", "26.2", "异常"), reading("ph", "8.79", "异常"), reading("dissolved-oxygen", "4.2", "异常"), reading("salinity", "34.0", "异常"), reading("turbidity", "7.3", "异常"), reading("ammonia-nitrogen", "0.21", "异常")],
  },
  "pool-4": {
    normal: [reading("temperature", "22.8", "正常"), reading("ph", "8.16", "正常"), reading("dissolved-oxygen", "7.3", "正常"), reading("salinity", "30.8", "正常"), reading("turbidity", "3.0", "正常"), reading("ammonia-nitrogen", "0.05", "正常")],
    warning: [reading("temperature", "23.8", "正常"), reading("ph", "8.29", "正常"), reading("dissolved-oxygen", "6.1", "预警"), reading("salinity", "31.3", "正常"), reading("turbidity", "4.3", "预警"), reading("ammonia-nitrogen", "0.09", "正常")],
    abnormal: [reading("temperature", "25.0", "异常"), reading("ph", "8.60", "异常"), reading("dissolved-oxygen", "4.9", "异常"), reading("salinity", "32.9", "异常"), reading("turbidity", "6.1", "异常"), reading("ammonia-nitrogen", "0.16", "异常")],
  },
};

export default function MainPage() {
  const pools = [
    {
      id: "pool-1",
      name: "1号育苗池",
      species: "虾夷扇贝",
      status: "正常",
      selected: true,
    },
    {
      id: "pool-2",
      name: "2号育苗池",
      species: "栉孔扇贝",
      status: "预警",
      selected: false,
    },
    {
      id: "pool-3",
      name: "3号育苗池",
      species: "长牡蛎",
      status: "异常",
      selected: false,
    },
    {
      id: "pool-4",
      name: "4号育苗池",
      species: "海湾扇贝",
      status: "正常",
      selected: false,
    },
  ];
  const [selectedPoolId, setSelectedPoolId] = usePersistentState("jack-dashboard-pool", "pool-1");
  const [selectedMetricId, setSelectedMetricId] = usePersistentState("jack-dashboard-metric", "temperature");
  const [selectedTimeRange, setSelectedTimeRange] = usePersistentState("jack-dashboard-range", "1h");
  const [selectedDemoMode, setSelectedDemoMode] = usePersistentState<DemoMode>("jack-dashboard-scenario", "normal");
  const [isAlertDismissed, setIsAlertDismissed] = usePersistentState("jack-dashboard-alert-dismissed", false);
  const selectedPool =
    pools.find((pool) => pool.id === selectedPoolId) ?? pools[0];

  const selectDemoMode = (
    mode: DemoMode,
  ) => {
    setSelectedDemoMode(mode);
    setIsAlertDismissed(false);
  };

  const activeMetrics =
    poolMetricScenarios[selectedPoolId]?.[selectedDemoMode] ??
    poolMetricScenarios["pool-1"].normal;
  const selectedMetric =
    activeMetrics.find((metric) => metric.id === selectedMetricId) ??
    activeMetrics[0];
  const activeAlert =
    selectedDemoMode === "warning"
      ? {
          title: "检测到水质预警",
          status: "需关注",
          message:
            `${selectedPool.name}水温、溶解氧、浊度和氨氮接近或超过正常范围，建议加强观察并提前检查换水与增氧条件。`,
          symbol: "!",
          tone: "warning" as const,
        }
      : selectedDemoMode === "abnormal"
        ? {
            title: "检测到水质异常",
            status: "未处理",
            message:
              `${selectedPool.name}氨氮当前值为 0.18 mg/L，多项指标已超过正常范围，请及时检查换水情况并持续观察。`,
            symbol: "!",
          tone: "abnormal" as const,
          }
        : null;
  const activeAlertCount =
    selectedDemoMode === "warning"
      ? 4
      : selectedDemoMode === "abnormal"
        ? 6
        : 0;
  const activeAlertSummary =
    selectedDemoMode === "warning"
      ? {
          normalCount: 2,
          warningCount: 4,
          abnormalCount: 0,
          event: `${selectedPool.name} · 多项指标预警`,
          handlingStatus: "需关注",
          description:
            "水温、溶解氧、浊度和氨氮已接近或超过正常范围，建议加强观察并提前检查换水与增氧条件。",
          tone: "warning" as const,
        }
      : selectedDemoMode === "abnormal"
        ? {
            normalCount: 0,
            warningCount: 0,
            abnormalCount: 6,
            event: `${selectedPool.name} · 多项指标异常`,
            handlingStatus: "未处理",
            description:
              "氨氮当前值为 0.18 mg/L，六项水质指标均已超过正常范围，建议立即检查换水、增氧及育苗池运行情况。",
            tone: "abnormal" as const,
          }
      : {
          normalCount: 6,
            warningCount: 0,
            abnormalCount: 0,
            event: "当前无异常事件",
            handlingStatus: "运行正常",
            description:
              "当前六项水质指标均处于正常范围，系统运行稳定，请继续保持常规监测。",
          tone: "normal" as const,
        };
  const activeDosingStatus =
    selectedDemoMode === "warning"
      ? {
          title: "建议暂缓投放",
          environmentStatus: "需要观察",
          description:
            "部分水质指标处于预警状态，建议先加强观察并检查换水与增氧条件，待环境稳定后再确认投放。",
          tone: "warning" as const,
        }
      : selectedDemoMode === "abnormal"
        ? {
            title: "当前不建议投放",
            environmentStatus: "环境存在风险",
            description:
              "多项水质指标出现异常，建议先完成水质处理并确认指标恢复，再由工作人员决定是否进行诱导剂投放。",
            tone: "abnormal" as const,
          }
        : {
            title: "当前环境适合投放",
            environmentStatus: "条件良好",
            description:
              "当前六项水质指标均处于正常范围，可根据育苗计划由工作人员确认诱导剂种类、浓度和投放时间。",
            tone: "normal" as const,
          };
  return (
    <main className="system-page min-h-screen px-5 py-8 text-[#d7e2ea] sm:px-10 sm:py-12">
      <SystemHomeLink />
      <SystemNavigation
        active="dashboard"
        activeAlertCount={activeAlertCount}
        alertTone={selectedDemoMode === "abnormal" ? "abnormal" : "warning"}
      />
      <p className="system-demo-notice">当前展示为确定性的演示监测数据，用于呈现系统交互与业务流程；接入传感器服务后可替换为真实实时数据。</p>
      <section className="mx-auto max-w-6xl py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm tracking-[0.2em] text-black">哈喽，Jack</p>
          <h1 className="text-5xl font-black tracking-tight text-black sm:text-7xl">综合驾驶舱</h1>
          <p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-black sm:text-lg">集中查看各育苗池的实时水质、运行状态与异常情况。</p>
        </div>
        {activeAlert && !isAlertDismissed && (
          <div
            className={
              activeAlert.tone === "warning"
                ? "mt-8 flex flex-wrap items-start justify-between gap-5 rounded-2xl border border-amber-300/25 bg-amber-300/[0.08] px-5 py-4"
                : "mt-8 flex flex-wrap items-start justify-between gap-5 rounded-2xl border border-rose-300/25 bg-rose-300/[0.08] px-5 py-4"
            }
          >
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={
                  activeAlert.tone === "warning"
                    ? "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-lg text-amber-200"
                    : "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-300/30 bg-rose-300/10 text-lg text-rose-200"
                }
              >
                {activeAlert.symbol}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    className={`font-semibold ${
                      activeAlert.tone === "warning"
                        ? "text-amber-100"
                        : "text-rose-100"
                    }`}
                  >
                    {activeAlert.title}
                  </p>

                  <span
                    className={
                      activeAlert.tone === "warning"
                        ? "rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-200"
                        : "rounded-full border border-rose-300/25 bg-rose-300/10 px-2.5 py-1 text-xs font-medium text-rose-200"
                    }
                  >
                    {activeAlert.status}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#d7e2ea]/70">
                  {activeAlert.message}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/main/alerts"
                className={
                  activeAlert.tone === "warning"
                    ? "rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/15"
                    : "rounded-lg border border-rose-300/30 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-300/15"
                }
              >
                查看异常
              </Link>

              <button
                type="button"
                onClick={() => setIsAlertDismissed(true)}
                aria-label="关闭异常提示"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-lg text-[#d7e2ea]/55"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div>
            <p className="text-sm font-medium text-[#e0f2fe]">监测场景</p>
            <p className="mt-1 text-xs leading-5 text-[#d7e2ea]/50">
              “当前状态”保留各育苗池实际状态；预警和异常场景用于演示对应处置流程。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectDemoMode("normal")}
              aria-pressed={selectedDemoMode === "normal"}
              className={
                selectedDemoMode === "normal"
                  ? "rounded-lg border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200"
                  : "rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#d7e2ea]/65 transition-colors hover:border-emerald-300/30 hover:text-emerald-200"
              }
            >
              当前状态
            </button>

            <button
              type="button"
              onClick={() => selectDemoMode("warning")}
              aria-pressed={selectedDemoMode === "warning"}
              className={
                selectedDemoMode === "warning"
                  ? "rounded-lg border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-200"
                  : "rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#d7e2ea]/65 transition-colors hover:border-amber-300/30 hover:text-amber-200"
              }
            >
              预警
            </button>

            <button
              type="button"
              onClick={() => selectDemoMode("abnormal")}
              aria-pressed={selectedDemoMode === "abnormal"}
              className={
                selectedDemoMode === "abnormal"
                  ? "rounded-lg border border-rose-300/35 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-200"
                  : "rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#d7e2ea]/65 transition-colors hover:border-rose-300/30 hover:text-rose-200"
              }
            >
              异常
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold tracking-wide text-[#e0f2fe]">
            育苗池切换
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pools.map((pool) => (
              <button
                key={pool.id}
                type="button"
                onClick={() => setSelectedPoolId(pool.id)}
                aria-pressed={pool.id === selectedPoolId}
                className={
                  pool.id === selectedPoolId
                    ? "rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-4 text-left"
                    : "rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left"
                }
              >
                <span className="block text-base font-semibold text-[#e0f2fe]">
                  {pool.name}
                </span>
                <span className="mt-2 block text-sm text-[#d7e2ea]/65">
                  {pool.species}
                </span>
                <span
                  className={
                    pool.status === "正常"
                      ? "mt-3 inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
                      : pool.status === "预警"
                        ? "mt-3 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-300"
                        : "mt-3 inline-flex rounded-full border border-rose-300/30 bg-rose-300/10 px-2.5 py-1 text-xs font-medium text-rose-300"
                  }
                >
                  {pool.status}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-wide text-[#e0f2fe]">
            实时监测
          </h2>

          <div className="metric-gauge-grid mt-5">
            {activeMetrics.map((metric) => (
              <MetricGauge
                key={metric.id}
                metric={metric}
                selected={metric.id === selectedMetricId}
                onSelect={() => setSelectedMetricId(metric.id)}
              />
            ))}
          </div>
        </div>
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm text-[#d7e2ea]/55">指标趋势</p>
              <h2 className="mt-2 text-xl font-semibold text-[#e0f2fe]">
                {selectedMetric.name}变化趋势
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTimeRange("1h")}
                aria-pressed={selectedTimeRange === "1h"}
                className={
                  selectedTimeRange === "1h"
                    ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200"
                    : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"
                }
              >
                最近1小时
              </button>

              <button
                type="button"
                onClick={() => setSelectedTimeRange("6h")}
                aria-pressed={selectedTimeRange === "6h"}
                className={
                  selectedTimeRange === "6h"
                    ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200"
                    : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"
                }
              >
                最近6小时
              </button>

              <button
                type="button"
                onClick={() => setSelectedTimeRange("24h")}
                aria-pressed={selectedTimeRange === "24h"}
                className={
                  selectedTimeRange === "24h"
                    ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200"
                    : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"
                }
              >
                最近24小时
              </button>

              <button
                type="button"
                onClick={() => setSelectedTimeRange("7d")}
                aria-pressed={selectedTimeRange === "7d"}
                className={
                  selectedTimeRange === "7d"
                    ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200"
                    : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"
                }
              >
                最近7天
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="text-[#d7e2ea]/65">
              当前值：
              <strong className="ml-1 font-semibold text-[#e0f2fe]">
                {`${selectedMetric.value}${selectedMetric.unit}`}
              </strong>
            </span>

            <span className="text-[#d7e2ea]/65">
              正常范围：
              <strong className="ml-1 font-semibold text-emerald-300">
                {selectedMetric.normalRange}
              </strong>
            </span>

            <span className="text-[#d7e2ea]/65">
              当前状态：
              <strong
                className={`ml-1 font-semibold ${
                  selectedMetric.status === "正常"
                    ? "text-emerald-300"
                    : selectedMetric.status === "预警"
                      ? "text-amber-300"
                      : "text-rose-300"
                }`}
              >
                {selectedMetric.status}
              </strong>
            </span>
          </div>

          <TrendLineChart
            className="mt-7"
            metricId={selectedMetric.id}
            currentValue={selectedMetric.value}
            range={selectedTimeRange}
            seed={`${selectedPool.id}-${selectedDemoMode}`}
            status={selectedMetric.status}
          />

          <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#d7e2ea]/55">
            <span>绿色区域：正常范围</span>
            <span>黄色虚线：预警线</span>
            <span>红色虚线：异常线</span>
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#d7e2ea]/55">异常摘要</p>
                <h2 className="mt-2 text-xl font-semibold text-[#e0f2fe]">
                  当前水质状态
                </h2>
              </div>

              <Link
                href="/main/alerts"
                className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                查看详情
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
                <span className="block text-sm text-[#d7e2ea]/60">正常</span>
                <strong className="mt-2 block text-2xl font-semibold text-emerald-300">
                  {activeAlertSummary.normalCount}
                </strong>
              </div>

              <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
                <span className="block text-sm text-[#d7e2ea]/60">预警</span>
                <strong className="mt-2 block text-2xl font-semibold text-amber-300">
                  {activeAlertSummary.warningCount}
                </strong>
              </div>

              <div className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-4">
                <span className="block text-sm text-[#d7e2ea]/60">异常</span>
                <strong className="mt-2 block text-2xl font-semibold text-rose-300">
                  {activeAlertSummary.abnormalCount}
                </strong>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-rose-200">
                  {activeAlertSummary.event}
                </span>
                <span
                  className={`rounded-full bg-rose-300/10 px-2.5 py-1 text-xs font-medium ${
                    activeAlertSummary.tone === "normal"
                      ? "text-emerald-300"
                      : activeAlertSummary.tone === "warning"
                        ? "text-amber-300"
                        : "text-rose-300"
                  }`}
                >
                  {activeAlertSummary.handlingStatus}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#d7e2ea]/65">
                {activeAlertSummary.description}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-[#d7e2ea]/55">诱导剂投放状态</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold text-amber-200">
                {activeDosingStatus.title}
              </span>

              <span
                className={`rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium ${
                  activeDosingStatus.tone === "normal"
                    ? "text-emerald-300"
                    : activeDosingStatus.tone === "warning"
                      ? "text-amber-300"
                      : "text-rose-300"
                }`}
              >
                {activeDosingStatus.environmentStatus}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-[#d7e2ea]/65">
              {activeDosingStatus.description}
            </p>

            <Link
              href="/main/dosing"
              className={
                activeDosingStatus.tone === "normal"
                  ? "mt-7 inline-flex rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-300/15"
                  : activeDosingStatus.tone === "warning"
                    ? "mt-7 inline-flex rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/15"
                    : "mt-7 inline-flex rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-2.5 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-300/15"
              }
            >
              查看投放指导
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
