"use client";

import { SystemHomeLink, SystemNavigation } from "@/app/components/SystemNavigation";
import { TrendLineChart } from "@/app/components/TrendLineChart";
import { usePersistentState } from "@/app/components/usePersistentState";

export default function MonitoringPage() {
  const monitoringTasks = [
    {
      id: "monitor-1",
      pool: "1号育苗池",
      species: "虾夷扇贝",
      agent: "肾上腺素",
      concentration: "10⁻⁴ mol/L",
      dosage: "2.0 L",
      startTime: "今天 16:30",
      status: "正在监测",
      result: "观察中",
      description: "投放后幼虫活动状态稳定，氨氮逐步下降，继续观察附着变态情况。",
      beforeMetrics: [
        { id: "temperature", name: "水温", value: "22.8℃" },
        { id: "ph", name: "pH", value: "8.10" },
        { id: "oxygen", name: "溶解氧", value: "6.3 mg/L" },
        { id: "salinity", name: "盐度", value: "30.7‰" },
        { id: "turbidity", name: "浊度", value: "4.5 NTU" },
        { id: "ammonia", name: "氨氮", value: "0.14 mg/L" },
      ],
      afterMetrics: [
        { id: "temperature", name: "水温", value: "22.6℃", change: "-0.2℃", state: "正常" },
        { id: "ph", name: "pH", value: "8.12", change: "+0.02", state: "正常" },
        { id: "oxygen", name: "溶解氧", value: "7.1 mg/L", change: "+0.8 mg/L", state: "改善" },
        { id: "salinity", name: "盐度", value: "30.8‰", change: "+0.1‰", state: "正常" },
        { id: "turbidity", name: "浊度", value: "3.8 NTU", change: "-0.7 NTU", state: "改善" },
        { id: "ammonia", name: "氨氮", value: "0.09 mg/L", change: "-0.05 mg/L", state: "改善" },
      ],
    },
    {
      id: "monitor-2",
      pool: "2号育苗池",
      species: "栉孔扇贝",
      agent: "去甲肾上腺素",
      concentration: "5×10⁻⁵ mol/L",
      dosage: "1.6 L",
      startTime: "今天 17:10",
      status: "正在监测",
      result: "需要观察",
      description: "溶解氧有所恢复，但浊度仍接近预警范围，建议继续增氧并观察。",
      beforeMetrics: [
        { id: "temperature", name: "水温", value: "23.9℃" },
        { id: "ph", name: "pH", value: "8.36" },
        { id: "oxygen", name: "溶解氧", value: "5.6 mg/L" },
        { id: "salinity", name: "盐度", value: "31.5‰" },
        { id: "turbidity", name: "浊度", value: "4.8 NTU" },
        { id: "ammonia", name: "氨氮", value: "0.11 mg/L" },
      ],
      afterMetrics: [
        { id: "temperature", name: "水温", value: "24.0℃", change: "+0.1℃", state: "正常" },
        { id: "ph", name: "pH", value: "8.34", change: "-0.02", state: "正常" },
        { id: "oxygen", name: "溶解氧", value: "6.2 mg/L", change: "+0.6 mg/L", state: "改善" },
        { id: "salinity", name: "盐度", value: "31.4‰", change: "-0.1‰", state: "正常" },
        { id: "turbidity", name: "浊度", value: "4.3 NTU", change: "-0.5 NTU", state: "观察" },
        { id: "ammonia", name: "氨氮", value: "0.10 mg/L", change: "-0.01 mg/L", state: "观察" },
      ],
    },
    {
      id: "monitor-3",
      pool: "3号育苗池",
      species: "长牡蛎",
      agent: "氯化钾",
      concentration: "20 mmol/L",
      dosage: "2.4 L",
      startTime: "今天 13:20",
      status: "已完成",
      result: "效果良好",
      description: "水质指标稳定，幼虫附着率明显提高，本次监测已完成。",
      beforeMetrics: [
        { id: "temperature", name: "水温", value: "22.4℃" },
        { id: "ph", name: "pH", value: "8.08" },
        { id: "oxygen", name: "溶解氧", value: "6.8 mg/L" },
        { id: "salinity", name: "盐度", value: "30.3‰" },
        { id: "turbidity", name: "浊度", value: "3.9 NTU" },
        { id: "ammonia", name: "氨氮", value: "0.08 mg/L" },
      ],
      afterMetrics: [
        { id: "temperature", name: "水温", value: "22.5℃", change: "+0.1℃", state: "正常" },
        { id: "ph", name: "pH", value: "8.11", change: "+0.03", state: "正常" },
        { id: "oxygen", name: "溶解氧", value: "7.5 mg/L", change: "+0.7 mg/L", state: "改善" },
        { id: "salinity", name: "盐度", value: "30.4‰", change: "+0.1‰", state: "正常" },
        { id: "turbidity", name: "浊度", value: "3.1 NTU", change: "-0.8 NTU", state: "改善" },
        { id: "ammonia", name: "氨氮", value: "0.05 mg/L", change: "-0.03 mg/L", state: "改善" },
      ],
    },
    {
      id: "monitor-4",
      pool: "4号育苗池",
      species: "海湾扇贝",
      agent: "肾上腺素",
      concentration: "8×10⁻⁵ mol/L",
      dosage: "1.8 L",
      startTime: "昨天 19:40",
      status: "已完成",
      result: "效果良好",
      description: "投放后水质稳定，未出现新的异常，附着变态过程正常。",
      beforeMetrics: [
        { id: "temperature", name: "水温", value: "22.9℃" },
        { id: "ph", name: "pH", value: "8.18" },
        { id: "oxygen", name: "溶解氧", value: "6.6 mg/L" },
        { id: "salinity", name: "盐度", value: "30.9‰" },
        { id: "turbidity", name: "浊度", value: "3.7 NTU" },
        { id: "ammonia", name: "氨氮", value: "0.07 mg/L" },
      ],
      afterMetrics: [
        { id: "temperature", name: "水温", value: "22.8℃", change: "-0.1℃", state: "正常" },
        { id: "ph", name: "pH", value: "8.16", change: "-0.02", state: "正常" },
        { id: "oxygen", name: "溶解氧", value: "7.3 mg/L", change: "+0.7 mg/L", state: "改善" },
        { id: "salinity", name: "盐度", value: "30.8‰", change: "-0.1‰", state: "正常" },
        { id: "turbidity", name: "浊度", value: "3.0 NTU", change: "-0.7 NTU", state: "改善" },
        { id: "ammonia", name: "氨氮", value: "0.05 mg/L", change: "-0.02 mg/L", state: "改善" },
      ],
    },
    {
      id: "monitor-5",
      pool: "1号育苗池",
      species: "虾夷扇贝",
      agent: "氯化钾",
      concentration: "18 mmol/L",
      dosage: "2.1 L",
      startTime: "昨天 14:15",
      status: "已完成",
      result: "效果一般",
      description: "水质恢复正常，但附着效果低于预期，建议复核投放时间与幼虫发育阶段。",
      beforeMetrics: [
        { id: "temperature", name: "水温", value: "23.1℃" },
        { id: "ph", name: "pH", value: "8.21" },
        { id: "oxygen", name: "溶解氧", value: "6.1 mg/L" },
        { id: "salinity", name: "盐度", value: "30.6‰" },
        { id: "turbidity", name: "浊度", value: "4.2 NTU" },
        { id: "ammonia", name: "氨氮", value: "0.10 mg/L" },
      ],
      afterMetrics: [
        { id: "temperature", name: "水温", value: "23.0℃", change: "-0.1℃", state: "正常" },
        { id: "ph", name: "pH", value: "8.18", change: "-0.03", state: "正常" },
        { id: "oxygen", name: "溶解氧", value: "6.8 mg/L", change: "+0.7 mg/L", state: "改善" },
        { id: "salinity", name: "盐度", value: "30.7‰", change: "+0.1‰", state: "正常" },
        { id: "turbidity", name: "浊度", value: "3.9 NTU", change: "-0.3 NTU", state: "观察" },
        { id: "ammonia", name: "氨氮", value: "0.08 mg/L", change: "-0.02 mg/L", state: "改善" },
      ],
    },
  ];
  const [selectedCategory, setSelectedCategory] = usePersistentState("jack-monitoring-category", "正在监测");
  const [selectedTaskId, setSelectedTaskId] = usePersistentState("jack-monitoring-task", "monitor-1");
  const [selectedTrendMetricId, setSelectedTrendMetricId] = usePersistentState("jack-monitoring-metric", "ammonia");
  const [selectedTrendRange, setSelectedTrendRange] = usePersistentState("jack-monitoring-range", "24h");
  const visibleTasks = monitoringTasks.filter((task) =>
    selectedCategory === "正在监测"
      ? task.status === "正在监测"
      : task.status === "已完成",
  );
  const selectedTask =
    visibleTasks.find((task) => task.id === selectedTaskId) ?? visibleTasks[0];
  const selectedAfterMetric = selectedTask?.afterMetrics.find((metric) => metric.id === selectedTrendMetricId) ?? selectedTask?.afterMetrics[0];
  const selectedBeforeMetric = selectedTask?.beforeMetrics.find((metric) => metric.id === selectedAfterMetric?.id);

  const setCategory = (category: string) => {
    setSelectedCategory(category);
    const nextTasks = monitoringTasks.filter((task) =>
      category === "正在监测"
        ? task.status === "正在监测"
        : task.status === "已完成",
    );

    if (nextTasks[0]) {
      setSelectedTaskId(nextTasks[0].id);
    }
  };

  const resultClass = (result: string) =>
    result === "效果良好"
      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
      : "border-amber-300/30 bg-amber-300/10 text-amber-300";
  const stateClass = (state: string) =>
    state === "改善"
      ? "text-emerald-300"
      : state === "观察"
        ? "text-amber-300"
        : state === "异常"
          ? "text-rose-300"
          : "text-cyan-200";
  const recoveryStatus = (state: string) =>
    state === "正常"
      ? "已恢复"
      : state === "改善"
        ? "已改善"
        : state === "观察"
          ? "持续观察"
          : "尚未解除";
  const recoveryClass = (state: string) =>
    state === "正常" || state === "改善"
      ? "text-emerald-300"
      : state === "观察"
        ? "text-amber-300"
        : "text-rose-300";

  return (
    <main className="system-page min-h-screen px-5 py-8 text-[#d7e2ea] sm:px-10 sm:py-12">
      <SystemHomeLink />
      <SystemNavigation active="monitoring" />
      <p className="system-demo-notice">本页曲线为根据育苗池、指标、任务和时间范围生成的确定性演示序列，末端值与当前监测值一致。</p>

      <section className="mx-auto max-w-6xl py-12">
        <div className="relative flex flex-col items-center gap-6 text-center lg:block">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm tracking-[0.2em] text-black">哈喽，Jack</p>
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-7xl">投放后监测</h1>
            <p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-black sm:text-lg">持续跟踪诱导剂投放后的水质变化、异常解除情况与育苗效果。</p>
          </div>
          <div className="self-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-200 lg:absolute lg:bottom-0 lg:right-0">当前有 2 项任务正在监测</div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-cyan-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">正在监测</span><strong className="mt-3 block text-3xl font-semibold text-cyan-200">2</strong></div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-indigo-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">今日完成</span><strong className="mt-3 block text-3xl font-semibold text-indigo-200">3</strong></div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-emerald-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">效果良好</span><strong className="mt-3 block text-3xl font-semibold text-emerald-300">4</strong></div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-amber-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20"><span className="text-sm font-medium text-slate-100">需要观察</span><strong className="mt-3 block text-3xl font-semibold text-amber-300">1</strong></div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-[#d7e2ea]/55">任务列表</p>
            <h2 className="mt-1 text-xl font-semibold text-[#e0f2fe]">投放监测任务</h2>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {["正在监测", "最近完成"].map((category) => (
                <button key={category} type="button" onClick={() => setCategory(category)} aria-pressed={selectedCategory === category} className={selectedCategory === category ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2.5 text-sm font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-[#d7e2ea]/65 transition-colors hover:border-cyan-300/30"}>{category}</button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {visibleTasks.map((task) => (
                <button key={task.id} type="button" onClick={() => setSelectedTaskId(task.id)} aria-pressed={task.id === selectedTask?.id} className={task.id === selectedTask?.id ? "w-full rounded-xl border border-cyan-300/35 bg-cyan-300/[0.08] p-4 text-left ring-1 ring-inset ring-cyan-300/20" : "w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-cyan-300/25"}>
                  <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#e0f2fe]">{task.pool}</p><p className="mt-1 text-sm text-[#d7e2ea]/55">{task.species}</p></div><span className="text-xs text-[#d7e2ea]/45">{task.startTime}</span></div>
                  <p className="mt-4 text-lg font-semibold text-[#e0f2fe]">{task.agent}</p><p className="mt-1 text-sm text-[#d7e2ea]/60">{task.concentration}</p>
                  <div className="mt-4 flex flex-wrap gap-2"><span className={task.status === "正在监测" ? "rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-200" : "rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-300"}>{task.status}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${resultClass(task.result)}`}>{task.result}</span></div>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            {selectedTask && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div><p className="text-sm text-[#d7e2ea]/55">当前任务详情</p><h2 className="mt-2 text-2xl font-semibold text-[#e0f2fe]">{selectedTask.pool} · {selectedTask.agent}</h2><p className="mt-2 text-sm text-[#d7e2ea]/60">{selectedTask.species} · 开始于 {selectedTask.startTime}</p></div>
                  <div className="flex flex-wrap gap-2"><span className={selectedTask.status === "正在监测" ? "rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-200" : "rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-300"}>{selectedTask.status}</span><span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${resultClass(selectedTask.result)}`}>{selectedTask.result}</span></div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-[#08131b] p-4"><span className="text-sm text-[#d7e2ea]/55">使用浓度</span><strong className="mt-2 block text-lg text-[#e0f2fe]">{selectedTask.concentration}</strong></div><div className="rounded-xl border border-white/10 bg-[#08131b] p-4"><span className="text-sm text-[#d7e2ea]/55">实际剂量</span><strong className="mt-2 block text-lg text-[#e0f2fe]">{selectedTask.dosage}</strong></div><div className="rounded-xl border border-white/10 bg-[#08131b] p-4"><span className="text-sm text-[#d7e2ea]/55">诱导剂</span><strong className="mt-2 block text-lg text-[#e0f2fe]">{selectedTask.agent}</strong></div></div>
                <p className="mt-5 rounded-xl border border-white/10 bg-[#08131b] p-4 text-sm leading-7 text-[#d7e2ea]/65">{selectedTask.description}</p>

                <div className="mt-8"><p className="text-sm text-[#d7e2ea]/55">水质变化</p><h3 className="mt-1 text-xl font-semibold text-[#e0f2fe]">投放前后水质对比</h3><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{selectedTask.afterMetrics.map((metric) => { const beforeMetric = selectedTask.beforeMetrics.find((item) => item.id === metric.id); return (<div key={metric.id} className="rounded-xl border border-white/10 bg-[#08131b] p-4"><div className="flex items-center justify-between gap-3"><span className="font-medium text-[#e0f2fe]">{metric.name}</span><span className={`text-xs font-medium ${stateClass(metric.state)}`}>{metric.state}</span></div><div className="mt-4 flex items-end gap-2 text-sm"><div><span className="block text-[#d7e2ea]/45">投放前</span><strong className="mt-1 block text-[#d7e2ea]/70">{beforeMetric?.value}</strong></div><span className="pb-0.5 text-cyan-300">→</span><div><span className="block text-[#d7e2ea]/45">投放后</span><strong className="mt-1 block text-[#e0f2fe]">{metric.value}</strong></div></div><p className={`mt-4 text-sm font-medium ${stateClass(metric.state)}`}>变化 {metric.change}</p></div>); })}</div></div>

                <div className="mt-8 rounded-xl border border-white/10 bg-[#08131b] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><p className="text-sm text-[#d7e2ea]/55">趋势展示</p><h3 className="mt-1 font-semibold text-[#e0f2fe]">{selectedAfterMetric?.name}投放后变化趋势</h3></div>
                    <div className="flex flex-wrap gap-2">{[["1h", "最近1小时"], ["6h", "最近6小时"], ["24h", "最近24小时"]].map(([id, label]) => <button key={id} type="button" onClick={() => setSelectedTrendRange(id)} aria-pressed={selectedTrendRange === id} className={selectedTrendRange === id ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{label}</button>)}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">{selectedTask.afterMetrics.map((metric) => <button key={metric.id} type="button" onClick={() => setSelectedTrendMetricId(metric.id)} aria-pressed={selectedTrendMetricId === metric.id} className={selectedTrendMetricId === metric.id ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{metric.name}</button>)}</div>
                  {selectedAfterMetric && <TrendLineChart className="mt-5" metricId={selectedAfterMetric.id} currentValue={selectedAfterMetric.value} startValue={selectedBeforeMetric?.value} range={selectedTrendRange} seed={`${selectedTask.id}-${selectedTask.pool}`} status={selectedAfterMetric.state === "观察" ? "预警" : "正常"} profile="recovery" />}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#d7e2ea]/55"><span>青色曲线：投放后监测值</span><span>黄色虚线：预警参考</span><span>红色虚线：异常参考</span></div>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-white/10 bg-[#08131b] p-5"><p className="text-sm text-[#d7e2ea]/55">异常解除情况</p><h3 className="mt-1 font-semibold text-[#e0f2fe]">指标恢复进度</h3><div className="mt-5 space-y-3">{selectedTask.afterMetrics.map((metric) => <div key={metric.id} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><span className="text-sm text-[#d7e2ea]/70">{metric.name}</span><span className={`text-sm font-medium ${recoveryClass(metric.state)}`}>{recoveryStatus(metric.state)}</span></div>)}</div></div><div className="rounded-xl border border-white/10 bg-[#08131b] p-5"><p className="text-sm text-[#d7e2ea]/55">综合效果评价</p><h3 className={`mt-2 text-2xl font-semibold ${selectedTask.result === "效果良好" ? "text-emerald-300" : "text-amber-300"}`}>{selectedTask.result}</h3><p className="mt-5 text-sm leading-7 text-[#d7e2ea]/65">系统评价仅用于辅助决策，最终投放效果应结合幼虫附着率、变态率及现场观察综合判断。</p></div></div>

                <div className="mt-8"><p className="text-sm text-[#d7e2ea]/55">过程记录</p><h3 className="mt-1 font-semibold text-[#e0f2fe]">监测时间线</h3><div className="mt-5 space-y-5 border-l border-white/10 pl-5"><div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-cyan-300"></span><p className="text-xs text-[#d7e2ea]/45">投放前30分钟</p><p className="mt-1 font-medium text-[#e0f2fe]">投放前环境检查完成</p><p className="mt-1 text-sm text-[#d7e2ea]/60">已确认六项水质指标与育苗池运行条件。</p></div><div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-cyan-300"></span><p className="text-xs text-[#d7e2ea]/45">投放时</p><p className="mt-1 font-medium text-[#e0f2fe]">工作人员确认诱导剂与剂量</p><p className="mt-1 text-sm text-[#d7e2ea]/60">按任务方案完成药剂与浓度复核。</p></div><div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-amber-300"></span><p className="text-xs text-[#d7e2ea]/45">投放后1小时</p><p className="mt-1 font-medium text-[#e0f2fe]">诱导剂投放完成</p><p className="mt-1 text-sm text-[#d7e2ea]/60">开始记录投放后的水质与幼虫反应。</p></div><div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-amber-300"></span><p className="text-xs text-[#d7e2ea]/45">投放后6小时</p><p className="mt-1 font-medium text-[#e0f2fe]">开始投放后连续监测</p><p className="mt-1 text-sm text-[#d7e2ea]/60">持续采集水质变化并评估异常解除进度。</p></div><div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-300"></span><p className="text-xs text-[#d7e2ea]/45">当前</p><p className="mt-1 font-medium text-[#e0f2fe]">当前效果评价生成</p><p className="mt-1 text-sm text-[#d7e2ea]/60">当前评价为：{selectedTask.result}。</p></div>{selectedTask.status === "已完成" && <div className="relative"><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-300"></span><p className="text-xs text-[#d7e2ea]/45">当前</p><p className="mt-1 font-medium text-[#e0f2fe]">本次监测任务已完成</p><p className="mt-1 text-sm text-[#d7e2ea]/60">已归档本次投放后的监测结果，供后续育苗决策参考。</p></div>}</div></div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
