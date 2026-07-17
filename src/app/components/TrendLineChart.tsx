"use client";

import { useId, useMemo } from "react";

export type TrendStatus = "正常" | "预警" | "异常" | string;
export type TrendProfile = "monitoring" | "event" | "recovery";

type MetricChartConfig = {
  name: string;
  unit: string;
  min: number;
  max: number;
  normalLow: number;
  normalHigh: number;
  warningLow: number;
  warningHigh: number;
  decimals: number;
};

const metricAliases: Record<string, string> = {
  oxygen: "dissolved-oxygen",
  ammonia: "ammonia-nitrogen",
};

export const metricChartConfigs: Record<string, MetricChartConfig> = {
  temperature: { name: "水温", unit: "℃", min: 18, max: 28, normalLow: 20, normalHigh: 24, warningLow: 19, warningHigh: 25, decimals: 1 },
  ph: { name: "pH", unit: "", min: 7, max: 9, normalLow: 7.8, normalHigh: 8.5, warningLow: 7.5, warningHigh: 8.6, decimals: 2 },
  "dissolved-oxygen": { name: "溶解氧", unit: "mg/L", min: 3, max: 10, normalLow: 6, normalHigh: 9, warningLow: 5, warningHigh: 9.5, decimals: 1 },
  salinity: { name: "盐度", unit: "‰", min: 24, max: 36, normalLow: 28, normalHigh: 32, warningLow: 26, warningHigh: 32.5, decimals: 1 },
  turbidity: { name: "浊度", unit: "NTU", min: 0, max: 8, normalLow: 0, normalHigh: 4, warningLow: 0, warningHigh: 5.5, decimals: 1 },
  "ammonia-nitrogen": { name: "氨氮", unit: "mg/L", min: 0, max: 0.25, normalLow: 0, normalHigh: 0.1, warningLow: 0, warningHigh: 0.15, decimals: 2 },
};

export const normalizeMetricId = (metricId: string) => metricAliases[metricId] ?? metricId;
export const parseMetricValue = (value: string | number) => typeof value === "number" ? value : Number.parseFloat(value);

const sampleCounts: Record<string, number> = { "1h": 25, "6h": 37, "24h": 49, "7d": 57, "30d": 61 };
const timeLabels: Record<string, string[]> = {
  "1h": ["60分钟前", "45分钟前", "30分钟前", "15分钟前", "当前"],
  "6h": ["6小时前", "4.5小时前", "3小时前", "1.5小时前", "当前"],
  "24h": ["00:00", "06:00", "12:00", "18:00", "当前"],
  "7d": ["第1天", "第3天", "第5天", "第7天"],
  "30d": ["第1天", "第10天", "第20天", "第30天"],
};

const hashSeed = (source: string) => {
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
};

const seededNoise = (seed: number, index: number) => {
  const value = Math.sin((seed + index * 37.17) * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

export function buildTrendSeries({
  metricId,
  currentValue,
  range,
  seed,
  status = "正常",
  profile = "monitoring",
  startValue,
}: {
  metricId: string;
  currentValue: string | number;
  range: string;
  seed: string;
  status?: TrendStatus;
  profile?: TrendProfile;
  startValue?: string | number;
}) {
  const normalizedId = normalizeMetricId(metricId);
  const config = metricChartConfigs[normalizedId] ?? metricChartConfigs.temperature;
  const count = sampleCounts[range] ?? 49;
  const finalValue = Number.isFinite(parseMetricValue(currentValue)) ? parseMetricValue(currentValue) : (config.normalLow + config.normalHigh) / 2;
  const initial = startValue === undefined || !Number.isFinite(parseMetricValue(startValue)) ? finalValue : parseMetricValue(startValue);
  const span = config.max - config.min;
  const seedValue = hashSeed(`${normalizedId}-${range}-${seed}-${status}-${profile}`);
  const direction = normalizedId === "dissolved-oxygen" ? -1 : 1;
  const statusStrength = status === "异常" ? 0.16 : status === "预警" ? 0.09 : 0.045;

  const values = Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const wave = Math.sin(t * Math.PI * (3.2 + (seedValue % 5) * 0.22) + (seedValue % 17) / 4) * span * 0.025;
    const ripple = Math.sin(t * Math.PI * 11 + (seedValue % 11)) * span * 0.009;
    const noise = seededNoise(seedValue, index) * span * 0.012;
    const drift = (t - 0.5) * span * (((seedValue % 9) - 4) / 180);
    let value = finalValue + wave + ripple + noise + drift;

    if (profile === "event") {
      const eventPeak = Math.exp(-Math.pow((t - 0.7) / 0.15, 2));
      value += direction * eventPeak * span * statusStrength;
    } else if (profile === "recovery") {
      value = initial + (finalValue - initial) * (1 - Math.exp(-3.6 * t));
      value += wave * (1 - t * 0.55) + ripple + noise * 0.65;
    }

    return Math.min(config.max, Math.max(config.min, value));
  });
  values[values.length - 1] = Math.min(config.max, Math.max(config.min, finalValue));
  return { config, values };
}

const smoothPath = (points: Array<{ x: number; y: number }>) => {
  if (points.length < 2) return "";
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const before = points[index - 1] ?? previous;
    const after = points[index + 2] ?? point;
    const control1X = previous.x + (point.x - before.x) / 6;
    const control1Y = previous.y + (point.y - before.y) / 6;
    const control2X = point.x - (after.x - previous.x) / 6;
    const control2Y = point.y - (after.y - previous.y) / 6;
    return `${path} C ${control1X.toFixed(2)} ${control1Y.toFixed(2)}, ${control2X.toFixed(2)} ${control2Y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);
};

export function TrendLineChart({
  metricId,
  currentValue,
  range,
  seed,
  status = "正常",
  profile = "monitoring",
  startValue,
  className = "",
}: {
  metricId: string;
  currentValue: string | number;
  range: string;
  seed: string;
  status?: TrendStatus;
  profile?: TrendProfile;
  startValue?: string | number;
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const { config, values } = useMemo(() => buildTrendSeries({ metricId, currentValue, range, seed, status, profile, startValue }), [metricId, currentValue, range, seed, status, profile, startValue]);
  const width = 800;
  const height = 260;
  const left = 58;
  const right = 18;
  const top = 18;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const scaleY = (value: number) => top + ((config.max - value) / (config.max - config.min)) * plotHeight;
  const points = values.map((value, index) => ({ x: left + (index / (values.length - 1)) * plotWidth, y: scaleY(value) }));
  const path = smoothPath(points);
  const areaPath = `${path} L ${points.at(-1)?.x ?? width - right} ${height - bottom} L ${left} ${height - bottom} Z`;
  const markerColor = status === "异常" ? "#FF0000" : status === "预警" ? "#FFD400" : "#00E676";
  const labels = timeLabels[range] ?? timeLabels["24h"];
  const format = (value: number) => value.toFixed(config.decimals);

  return (
    <div className={`trend-line-chart ${className}`} role="img" aria-label={`${config.name}${range}变化曲线，当前值${format(values.at(-1) ?? 0)}${config.unit}`}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`trend-area-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.02" />
          </linearGradient>
          <filter id={`trend-glow-${gradientId}`} x="-20%" y="-30%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x={left} y={scaleY(config.normalHigh)} width={plotWidth} height={Math.max(0, scaleY(config.normalLow) - scaleY(config.normalHigh))} fill="#00E676" fillOpacity="0.055" />
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => <line key={ratio} x1={left} x2={width - right} y1={top + plotHeight * ratio} y2={top + plotHeight * ratio} stroke="#00E5FF" strokeOpacity="0.13" />)}
        <line x1={left} x2={width - right} y1={scaleY(config.warningHigh)} y2={scaleY(config.warningHigh)} stroke="#FFD400" strokeOpacity="0.7" strokeDasharray="7 7" />
        {config.warningLow > config.min && <line x1={left} x2={width - right} y1={scaleY(config.warningLow)} y2={scaleY(config.warningLow)} stroke="#FF0000" strokeOpacity="0.62" strokeDasharray="5 7" />}
        <path d={areaPath} fill={`url(#trend-area-${gradientId})`} />
        <path d={path} fill="none" stroke="#00E5FF" strokeWidth="3" vectorEffect="non-scaling-stroke" filter={`url(#trend-glow-${gradientId})`} />
        {points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 12)) === 0).map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="2.2" fill="#BDF8FF" opacity="0.72" />)}
        <circle cx={points.at(-1)?.x} cy={points.at(-1)?.y} r="5" fill={markerColor} stroke="#FFFFFF" strokeWidth="2" />
        <text x="8" y={top + 4} className="trend-axis-label">{format(config.max)}</text>
        <text x="8" y={top + plotHeight / 2 + 4} className="trend-axis-label">{format((config.max + config.min) / 2)}</text>
        <text x="8" y={height - bottom + 4} className="trend-axis-label">{format(config.min)}</text>
      </svg>
      <div className="trend-time-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>
      <span className="trend-unit">单位：{config.unit || "pH"}</span>
    </div>
  );
}
