"use client";

import { useState } from "react";
import { SystemHomeLink, SystemNavigation } from "@/app/components/SystemNavigation";
import { buildTrendSeries, TrendLineChart } from "@/app/components/TrendLineChart";
import { usePersistentState } from "@/app/components/usePersistentState";
import Link from "next/link";

export default function PoolsPage() {
  const pools = [
    { id: "pool-1", name: "1号育苗池", species: "虾夷扇贝", batch: "2026-XYSB-07", stage: "附着变态期", status: "正常", startDate: "2026-07-02", density: "18 个/mL", waterVolume: "42 m³", manager: "张师傅", description: "当前幼虫发育稳定，已进入附着变态观察阶段。", metrics: [{ id: "temperature", name: "水温", value: "22.6℃", status: "正常" }, { id: "ph", name: "pH", value: "8.12", status: "正常" }, { id: "oxygen", name: "溶解氧", value: "7.4 mg/L", status: "正常" }, { id: "salinity", name: "盐度", value: "30.8‰", status: "正常" }, { id: "turbidity", name: "浊度", value: "3.2 NTU", status: "正常" }, { id: "ammonia", name: "氨氮", value: "0.06 mg/L", status: "正常" }] },
    { id: "pool-2", name: "2号育苗池", species: "栉孔扇贝", batch: "2026-ZKSB-05", stage: "壳顶幼虫期", status: "预警", startDate: "2026-07-04", density: "21 个/mL", waterVolume: "38 m³", manager: "李师傅", description: "溶解氧和浊度接近预警范围，正在加强观察。", metrics: [{ id: "temperature", name: "水温", value: "24.2℃", status: "预警" }, { id: "ph", name: "pH", value: "8.36", status: "正常" }, { id: "oxygen", name: "溶解氧", value: "5.7 mg/L", status: "预警" }, { id: "salinity", name: "盐度", value: "31.4‰", status: "正常" }, { id: "turbidity", name: "浊度", value: "4.6 NTU", status: "预警" }, { id: "ammonia", name: "氨氮", value: "0.10 mg/L", status: "预警" }] },
    { id: "pool-3", name: "3号育苗池", species: "长牡蛎", batch: "2026-CML-03", stage: "附着变态期", status: "异常", startDate: "2026-06-29", density: "16 个/mL", waterVolume: "45 m³", manager: "王师傅", description: "多项指标超过正常范围，已进入异常处理流程。", metrics: [{ id: "temperature", name: "水温", value: "25.8℃", status: "异常" }, { id: "ph", name: "pH", value: "8.72", status: "异常" }, { id: "oxygen", name: "溶解氧", value: "4.6 mg/L", status: "异常" }, { id: "salinity", name: "盐度", value: "33.4‰", status: "异常" }, { id: "turbidity", name: "浊度", value: "6.8 NTU", status: "异常" }, { id: "ammonia", name: "氨氮", value: "0.18 mg/L", status: "异常" }] },
    { id: "pool-4", name: "4号育苗池", species: "海湾扇贝", batch: "2026-HWSB-06", stage: "D形幼虫期", status: "正常", startDate: "2026-07-06", density: "20 个/mL", waterVolume: "36 m³", manager: "赵师傅", description: "当前水质与幼虫活动状态稳定，按计划进行常规监测。", metrics: [{ id: "temperature", name: "水温", value: "22.8℃", status: "正常" }, { id: "ph", name: "pH", value: "8.16", status: "正常" }, { id: "oxygen", name: "溶解氧", value: "7.3 mg/L", status: "正常" }, { id: "salinity", name: "盐度", value: "30.8‰", status: "正常" }, { id: "turbidity", name: "浊度", value: "3.0 NTU", status: "正常" }, { id: "ammonia", name: "氨氮", value: "0.05 mg/L", status: "正常" }] },
  ];
  const tabs = ["水质历史", "异常与处理", "投放记录", "投放后监测"];
  const metricTabs = ["temperature", "ph", "oxygen", "salinity", "turbidity", "ammonia"];
  const metricNames: Record<string, string> = { temperature: "水温", ph: "pH", oxygen: "溶解氧", salinity: "盐度", turbidity: "浊度", ammonia: "氨氮" };
  const alertHistories = Object.fromEntries(pools.map((pool) => [pool.id, [
    { time: "今天 18:02", metric: pool.status === "异常" ? "氨氮" : "浊度", level: pool.status === "正常" ? "预警" : pool.status, value: pool.metrics[5].value, status: pool.status === "异常" ? "处理中" : pool.status === "预警" ? "观察中" : "已关闭", action: "检查换水、增氧与过滤条件", result: pool.status === "正常" ? "指标已恢复" : "持续跟踪变化" },
    { time: "今天 15:40", metric: "溶解氧", level: "预警", value: pool.metrics[2].value, status: pool.status === "异常" ? "处理中" : "已关闭", action: "调整增氧设备运行时段", result: "完成现场复核" },
    { time: "昨天 20:10", metric: "水温", level: "预警", value: pool.metrics[0].value, status: pool.status === "正常" ? "已关闭" : "观察中", action: "检查进水与遮光条件", result: "保留观察记录" },
  ]])) as Record<string, Array<{ time: string; metric: string; level: string; value: string; status: string; action: string; result: string }>>;
  const dosingHistories = Object.fromEntries(pools.map((pool) => [pool.id, [
    { time: "今天 16:30", agent: "肾上腺素", concentration: "10⁻⁴ mol/L", dosage: "2.0 L", operator: pool.manager, judgment: "环境条件满足投放要求", result: pool.status === "异常" ? "暂缓投放" : pool.status === "预警" ? "观察中" : "效果良好" },
    { time: "昨天 14:15", agent: "氯化钾", concentration: "18 mmol/L", dosage: "2.1 L", operator: "值班人员", judgment: "完成投放前水质检查", result: pool.status === "异常" ? "效果一般" : "效果良好" },
    { time: "07-08 10:20", agent: "去甲肾上腺素", concentration: "5×10⁻⁵ mol/L", dosage: "1.6 L", operator: pool.manager, judgment: "结合幼虫阶段进行评估", result: pool.status === "预警" ? "观察中" : "效果良好" },
  ]])) as Record<string, Array<{ time: string; agent: string; concentration: string; dosage: string; operator: string; judgment: string; result: string }>>;
  const monitoringHistories = Object.fromEntries(pools.map((pool) => [pool.id, [
    { time: "今天 17:10", agent: "肾上腺素", duration: "6小时", conclusion: "水质整体趋于稳定", recovery: pool.status === "异常" ? "持续处理" : pool.status === "预警" ? "持续观察" : "异常已解除", result: pool.status === "异常" ? "需要观察" : "效果良好", status: pool.status === "异常" ? "正在监测" : "已完成" },
    { time: "今天 13:20", agent: "氯化钾", duration: "12小时", conclusion: "溶解氧与浊度改善", recovery: "已改善", result: "效果良好", status: "已完成" },
    { time: "昨天 19:40", agent: "去甲肾上腺素", duration: "24小时", conclusion: "完成阶段性水质复核", recovery: pool.status === "预警" ? "持续观察" : "异常已解除", result: pool.status === "异常" ? "效果一般" : "效果良好", status: "已完成" },
  ]])) as Record<string, Array<{ time: string; agent: string; duration: string; conclusion: string; recovery: string; result: string; status: string }>>;

  const [selectedPoolId, setSelectedPoolId] = usePersistentState("jack-pools-selected", "pool-1");
  const [selectedHistoryTab, setSelectedHistoryTab] = usePersistentState("jack-pools-history-tab", "水质历史");
  const [selectedMetricId, setSelectedMetricId] = usePersistentState("jack-pools-metric", "temperature");
  const [selectedRange, setSelectedRange] = usePersistentState("jack-pools-range", "24h");
  const [exportMessage, setExportMessage] = useState("");
  const selectedPool = pools.find((pool) => pool.id === selectedPoolId) ?? pools[0];
  const selectedMetric = selectedPool.metrics.find((metric) => metric.id === selectedMetricId) ?? selectedPool.metrics[0];
  const toneClass = (status: string) => status === "正常" || status === "已关闭" || status === "效果良好" ? "text-emerald-300" : status === "异常" || status === "未处理" || status === "暂缓投放" ? "text-rose-300" : "text-amber-300";
  const badgeClass = (status: string) => `${toneClass(status)} border ${status === "正常" || status === "已关闭" || status === "效果良好" ? "border-emerald-300/30 bg-emerald-300/10" : status === "异常" || status === "未处理" || status === "暂缓投放" ? "border-rose-300/30 bg-rose-300/10" : "border-amber-300/30 bg-amber-300/10"}`;
  const selectPool = (id: string) => { setSelectedPoolId(id); setExportMessage(""); };
  const historyTrend = buildTrendSeries({ metricId: selectedMetric.id, currentValue: selectedMetric.value, range: "24h", seed: `${selectedPool.id}-${selectedPool.batch}`, status: selectedMetric.status });
  const historyIndexes = [historyTrend.values.length - 1, historyTrend.values.length - 5, historyTrend.values.length - 9, historyTrend.values.length - 13, historyTrend.values.length - 21, 0];
  const historySamples = historyIndexes.map((sampleIndex) => {
    const numericValue = historyTrend.values[Math.max(0, sampleIndex)];
    const status = numericValue >= historyTrend.config.normalLow && numericValue <= historyTrend.config.normalHigh ? "正常" : numericValue >= historyTrend.config.warningLow && numericValue <= historyTrend.config.warningHigh ? "预警" : "异常";
    return { value: `${numericValue.toFixed(historyTrend.config.decimals)}${historyTrend.config.unit}`, status };
  });
  const exportPoolReport = () => {
    const rows = [
      ["育苗池", selectedPool.name],
      ["苗种", selectedPool.species],
      ["批次", selectedPool.batch],
      ["运行状态", selectedPool.status],
      [],
      ["指标", "当前数值", "状态"],
      ...selectedPool.metrics.map((metric) => [metric.name, metric.value, metric.status]),
      [],
      ["历史时间", selectedMetric.name, "状态"],
      ...["当前", "2小时前", "4小时前", "6小时前", "10小时前", "12小时前"].map((time, index) => [time, historySamples[index].value, historySamples[index].status]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPool.name}-${selectedPool.batch}-监测报告.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportMessage(`已生成并下载${selectedPool.name}的演示监测报告。`);
  };

  return <main className="system-page min-h-screen px-5 py-8 text-[#d7e2ea] sm:px-10 sm:py-12">
    <SystemHomeLink />
    <SystemNavigation active="pools" />
    <p className="system-demo-notice">本页使用确定性的演示育苗池与历史监测数据；当前筛选会保存在此设备，并可导出当前育苗池的演示监测报告。</p>
    <section className="mx-auto max-w-6xl py-12">
      <div className="relative flex flex-col items-center gap-6 text-center lg:block"><div className="mx-auto max-w-3xl text-center"><p className="mb-5 text-sm tracking-[0.2em] text-black">哈喽，Jack</p><h1 className="text-5xl font-black tracking-tight text-black sm:text-7xl">育苗池管理</h1><p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-black sm:text-lg">查看各育苗池的基础信息、当前水质状态与完整历史记录。</p></div><span className="self-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-200 lg:absolute lg:bottom-0 lg:right-0">支持查看与导出</span></div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-cyan-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">育苗池总数</span><strong className="mt-3 block text-3xl text-cyan-200">4</strong></div><div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-emerald-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">正常运行</span><strong className="mt-3 block text-3xl text-emerald-300">2</strong></div><div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-amber-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">存在预警</span><strong className="mt-3 block text-3xl text-amber-300">1</strong></div><div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-rose-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">存在异常</span><strong className="mt-3 block text-3xl text-rose-300">1</strong></div></div>
      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)]"><aside className="space-y-6"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-[#d7e2ea]/55">育苗池列表</p><h2 className="mt-1 text-xl font-semibold text-[#e0f2fe]">选择育苗池</h2><div className="mt-5 space-y-3">{pools.map(pool => <button key={pool.id} type="button" onClick={() => selectPool(pool.id)} aria-pressed={pool.id === selectedPool.id} className={pool.id === selectedPool.id ? "w-full rounded-xl border border-cyan-300/35 bg-cyan-300/[0.08] p-4 text-left ring-1 ring-inset ring-cyan-300/20" : "w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-cyan-300/25"}><div className="flex justify-between gap-3"><div><p className="font-semibold text-[#e0f2fe]">{pool.name}</p><p className="mt-1 text-sm text-[#d7e2ea]/55">{pool.species}</p></div><span className={`text-xs font-medium ${toneClass(pool.status)}`}>{pool.status}</span></div><p className="mt-3 text-sm text-[#d7e2ea]/65">{pool.batch} · {pool.stage}</p><p className="mt-2 text-xs text-[#d7e2ea]/45">负责人：{pool.manager}</p></button>)}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-[#d7e2ea]/55">育苗池信息</p><h2 className="mt-1 text-xl font-semibold text-[#e0f2fe]">{selectedPool.name}</h2><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-[#d7e2ea]/45">苗种</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.species}</dd></div><div><dt className="text-[#d7e2ea]/45">批次编号</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.batch}</dd></div><div><dt className="text-[#d7e2ea]/45">生长阶段</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.stage}</dd></div><div><dt className="text-[#d7e2ea]/45">投苗日期</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.startDate}</dd></div><div><dt className="text-[#d7e2ea]/45">当前密度</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.density}</dd></div><div><dt className="text-[#d7e2ea]/45">水体体积</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.waterVolume}</dd></div><div><dt className="text-[#d7e2ea]/45">负责人</dt><dd className="mt-1 text-[#e0f2fe]">{selectedPool.manager}</dd></div><div><dt className="text-[#d7e2ea]/45">运行状态</dt><dd className={`mt-1 font-medium ${toneClass(selectedPool.status)}`}>{selectedPool.status}</dd></div></dl><p className="mt-5 border-t border-white/[0.06] pt-4 text-sm leading-7 text-[#d7e2ea]/65">{selectedPool.description}</p></div></aside>
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-[#d7e2ea]/55">实时概览</p><h2 className="mt-1 text-xl font-semibold text-[#e0f2fe]">当前水质状态</h2></div><span className={`rounded-full px-3 py-1.5 text-xs font-medium ${badgeClass(selectedPool.status)}`}>{selectedPool.status}</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{selectedPool.metrics.map(metric => <div key={metric.id} className="rounded-xl border border-white/10 bg-[#08131b] p-4"><span className="text-sm text-[#d7e2ea]/55">{metric.name}</span><strong className="mt-2 block text-2xl text-[#e0f2fe]">{metric.value}</strong><span className={`mt-3 inline-block text-sm font-medium ${toneClass(metric.status)}`}>{metric.status}</span></div>)}</div>
          <div className="mt-8 border-t border-white/10 pt-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{tabs.map(tab => <button key={tab} type="button" onClick={() => setSelectedHistoryTab(tab)} aria-pressed={selectedHistoryTab === tab} className={selectedHistoryTab === tab ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{tab}</button>)}</div><button type="button" onClick={exportPoolReport} className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-medium text-cyan-200">导出育苗池报告</button></div>{exportMessage && <p className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100">{exportMessage}</p>}
            {selectedHistoryTab === "水质历史" && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">{metricTabs.map(id => <button key={id} type="button" onClick={() => setSelectedMetricId(id)} aria-pressed={selectedMetricId === id} className={selectedMetricId === id ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{metricNames[id]}</button>)}</div>
                <div className="mt-3 flex flex-wrap gap-2">{[["24h", "最近24小时"], ["7d", "最近7天"], ["30d", "最近30天"]].map(([id, label]) => <button key={id} type="button" onClick={() => setSelectedRange(id)} aria-pressed={selectedRange === id} className={selectedRange === id ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{label}</button>)}</div>
                <div className="mt-6 rounded-xl border border-white/10 bg-[#08131b] p-5">
                  <p className="text-sm text-[#d7e2ea]/55">{selectedPool.name} · {selectedMetric.name}</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#e0f2fe]">历史趋势 · 当前值 {selectedMetric.value}</h3>
                  <TrendLineChart className="mt-5" metricId={selectedMetric.id} currentValue={selectedMetric.value} range={selectedRange} seed={`${selectedPool.id}-${selectedPool.batch}`} status={selectedMetric.status} />
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#d7e2ea]/55"><span>青色曲线：历史监测值</span><span>黄色虚线：预警参考</span><span>红色虚线：异常参考</span></div>
                </div>
                <div className="mt-5 overflow-x-auto"><table className="w-full min-w-130 text-left text-sm"><thead className="text-[#d7e2ea]/45"><tr><th className="pb-3 font-medium">时间</th><th className="pb-3 font-medium">指标</th><th className="pb-3 font-medium">数值</th><th className="pb-3 font-medium">状态</th></tr></thead><tbody>{["当前", "2小时前", "4小时前", "6小时前", "10小时前", "12小时前"].map((time, index) => <tr key={time} className="border-t border-white/[0.06]"><td className="py-3 text-[#d7e2ea]/60">{time}</td><td className="py-3 text-[#e0f2fe]">{selectedMetric.name}</td><td className="py-3 text-[#d7e2ea]/70">{historySamples[index].value}</td><td className={`py-3 font-medium ${toneClass(historySamples[index].status)}`}>{historySamples[index].status}</td></tr>)}</tbody></table></div>
              </div>
            )}
            {selectedHistoryTab === "异常与处理" && <HistoryCards records={alertHistories[selectedPool.id]} kind="alert" badgeClass={badgeClass} />}
            {selectedHistoryTab === "投放记录" && <HistoryCards records={dosingHistories[selectedPool.id]} kind="dosing" badgeClass={badgeClass} poolId={selectedPool.id} />}
            {selectedHistoryTab === "投放后监测" && <HistoryCards records={monitoringHistories[selectedPool.id]} kind="monitoring" badgeClass={badgeClass} />}
          </div></section></div>
    </section>
  </main>;
}

function HistoryCards({ records, kind, badgeClass, poolId }: { records: Record<string, string>[]; kind: string; badgeClass: (status: string) => string; poolId?: string }) {
  return <div className="mt-6 space-y-3">{records.map((record, index) => <div key={`${record.time}-${index}`} className="rounded-xl border border-white/10 bg-[#08131b] p-4">{kind === "alert" ? <><div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-[#e0f2fe]">{record.metric} · {record.value}</strong><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(record.status)}`}>{record.status}</span></div><p className="mt-2 text-sm text-[#d7e2ea]/60">{record.time} · {record.level} · 采取措施：{record.action}</p><p className="mt-2 text-sm text-[#d7e2ea]/75">处理结果：{record.result}</p></> : kind === "dosing" ? <><div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-[#e0f2fe]">{record.agent} · {record.dosage}</strong><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(record.result)}`}>{record.result}</span></div><p className="mt-2 text-sm text-[#d7e2ea]/60">{record.time} · {record.concentration} · 操作人员：{record.operator}</p><p className="mt-2 text-sm text-[#d7e2ea]/75">投放前判断：{record.judgment}</p><Link href={`/main/dosing?pool=${poolId}`} className="mt-3 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">查看投放指导</Link></> : <><div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-[#e0f2fe]">{record.agent} · {record.duration}</strong><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(record.result)}`}>{record.result}</span></div><p className="mt-2 text-sm text-[#d7e2ea]/60">{record.time} · 任务状态：{record.status}</p><p className="mt-2 text-sm text-[#d7e2ea]/75">水质结论：{record.conclusion}；异常解除：{record.recovery}</p><Link href="/main/monitoring" className="mt-3 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">查看投放后监测</Link></>}</div>)}</div>;
}
