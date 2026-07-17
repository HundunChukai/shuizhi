"use client";

import { useState } from "react";
import { SystemHomeLink, SystemNavigation } from "@/app/components/SystemNavigation";
import { TrendLineChart } from "@/app/components/TrendLineChart";
import { usePersistentState } from "@/app/components/usePersistentState";

export default function AlertsPage() {
  const alerts = [
    {
      id: "alert-1",
      pool: "1号育苗池",
      species: "虾夷扇贝",
      metric: "氨氮",
      value: "0.18 mg/L",
      level: "异常",
      status: "未处理",
      time: "今天 18:02",
      description: "氨氮浓度超过正常范围，可能影响幼虫活力与附着变态过程。",
      suggestion:
        "建议立即检查换水频率、残饵与有机物积累情况，并持续观察氨氮变化。",
    },
    {
      id: "alert-2",
      pool: "1号育苗池",
      species: "虾夷扇贝",
      metric: "浊度",
      value: "4.6 NTU",
      level: "预警",
      status: "处理中",
      time: "今天 17:48",
      description: "当前浊度高于建议范围，可能与悬浮颗粒或残饵积累有关。",
      suggestion: "建议检查过滤系统并适当调整换水量。",
    },
    {
      id: "alert-3",
      pool: "2号育苗池",
      species: "栉孔扇贝",
      metric: "溶解氧",
      value: "5.7 mg/L",
      level: "预警",
      status: "观察中",
      time: "今天 16:35",
      description: "溶解氧接近下限，需要关注夜间和高密度条件下的变化。",
      suggestion: "建议检查增氧设备，并提高短期监测频率。",
    },
    {
      id: "alert-4",
      pool: "3号育苗池",
      species: "长牡蛎",
      metric: "水温",
      value: "25.8℃",
      level: "异常",
      status: "未处理",
      time: "今天 15:20",
      description: "水温超过当前育苗阶段建议范围，可能增加幼虫代谢压力。",
      suggestion: "建议检查进水温度、遮光与换水条件。",
    },
    {
      id: "alert-5",
      pool: "4号育苗池",
      species: "海湾扇贝",
      metric: "pH",
      value: "8.58",
      level: "预警",
      status: "已关闭",
      time: "昨天 21:16",
      description: "pH曾短时超过正常范围，目前已恢复。",
      suggestion: "已完成换水并持续观察，当前无需进一步处理。",
    },
    {
      id: "alert-6",
      pool: "2号育苗池",
      species: "栉孔扇贝",
      metric: "盐度",
      value: "32.6‰",
      level: "预警",
      status: "已关闭",
      time: "昨天 18:42",
      description: "盐度短时偏高，可能与补水或蒸发有关。",
      suggestion: "已调整补水比例，盐度恢复正常。",
    },
  ];
  const filters = ["全部", "未处理", "处理中", "观察中", "已关闭"];
  const statusOptions = ["未处理", "处理中", "观察中", "已关闭"];
  const [selectedFilter, setSelectedFilter] = usePersistentState("jack-alert-filter", "全部");
  const [selectedAlertId, setSelectedAlertId] = usePersistentState("jack-alert-selected", "alert-1");
  const [selectedAlertRange, setSelectedAlertRange] = usePersistentState("jack-alert-range", "24h");
  const [alertStatuses, setAlertStatuses] = usePersistentState<Record<string, string>>("jack-alert-statuses",
    Object.fromEntries(alerts.map((alert) => [alert.id, alert.status])),
  );
  const [handlingNote, setHandlingNote] = useState("");
  const [handlingNotes, setHandlingNotes] = usePersistentState<
    Record<string, Array<{ title: string; description: string }>>
  >("jack-alert-handling-notes", {});

  const visibleAlerts =
    selectedFilter === "全部"
      ? alerts
      : alerts.filter((alert) => alertStatuses[alert.id] === selectedFilter);
  const selectedAlert =
    visibleAlerts.find((alert) => alert.id === selectedAlertId) ??
    visibleAlerts[0];
  const selectedAlertStatus = selectedAlert
    ? alertStatuses[selectedAlert.id]
    : "";
  const alertMetricIds: Record<string, string> = { 水温: "temperature", pH: "ph", 溶解氧: "dissolved-oxygen", 盐度: "salinity", 浊度: "turbidity", 氨氮: "ammonia-nitrogen" };

  const statusClass = (status: string) =>
    status === "未处理"
      ? "border-rose-300/30 bg-rose-300/10 text-rose-300"
      : status === "处理中"
        ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
        : status === "观察中"
          ? "border-amber-300/30 bg-amber-300/10 text-amber-300"
          : "border-emerald-300/30 bg-emerald-300/10 text-emerald-300";

  const setFilter = (filter: string) => {
    setSelectedFilter(filter);
    const nextAlerts =
      filter === "全部"
        ? alerts
        : alerts.filter((alert) => alertStatuses[alert.id] === filter);

    if (nextAlerts[0]) {
      setSelectedAlertId(nextAlerts[0].id);
    }
  };

  const updateSelectedAlertStatus = (status: string) => {
    if (!selectedAlert) {
      return;
    }

    setAlertStatuses((current) => ({
      ...current,
      [selectedAlert.id]: status,
    }));
  };

  const saveHandlingNote = () => {
    if (!selectedAlert || !handlingNote.trim()) {
      return;
    }

    setHandlingNotes((current) => ({
      ...current,
      [selectedAlert.id]: [
        ...(current[selectedAlert.id] ?? []),
        {
          title: "已保存处理备注",
          description: handlingNote.trim(),
        },
      ],
    }));
    setHandlingNote("");
  };
  const statusCounts = statusOptions.reduce<Record<string, number>>((counts, status) => {
    counts[status] = Object.values(alertStatuses).filter((value) => value === status).length;
    return counts;
  }, {});
  const openAlertCount = alerts.length - (statusCounts["已关闭"] ?? 0);

  return (
    <main className="system-page min-h-screen px-5 py-8 text-[#d7e2ea] sm:px-10 sm:py-12">
      <SystemHomeLink />
      <SystemNavigation active="alerts" />
      <p className="system-demo-notice">本页记录为演示预警数据；处理状态和备注会保存在当前设备浏览器中，接入业务数据库后可实现多人同步。</p>

      <section className="mx-auto max-w-6xl py-12">
        <div className="relative flex flex-col items-center gap-6 text-center lg:block">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-black">
              哈喽，Jack
            </p>
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-7xl">
              异常预警中心
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base font-light leading-8 text-black sm:text-lg">
              集中查看各育苗池的水质异常、处理进度与历史变化。
            </p>
          </div>

          <div className="self-center rounded-xl border border-amber-300/25 bg-amber-300/[0.08] px-4 py-3 text-sm font-medium text-amber-200 lg:absolute lg:bottom-0 lg:right-0">
            当前存在 {openAlertCount} 条待关注预警
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-rose-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20">
            <span className="text-sm font-medium text-slate-100">未处理</span>
            <strong className="mt-3 block text-3xl font-semibold text-rose-300">{statusCounts["未处理"] ?? 0}</strong>
          </div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-cyan-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20">
            <span className="text-sm font-medium text-slate-100">处理中</span>
            <strong className="mt-3 block text-3xl font-semibold text-cyan-200">{statusCounts["处理中"] ?? 0}</strong>
          </div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-amber-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20">
            <span className="text-sm font-medium text-slate-100">观察中</span>
            <strong className="mt-3 block text-3xl font-semibold text-amber-300">{statusCounts["观察中"] ?? 0}</strong>
          </div>
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-emerald-300/30 bg-[#06345b]/90 p-5 text-center shadow-lg shadow-slate-950/20">
            <span className="text-sm font-medium text-slate-100">已关闭</span>
            <strong className="mt-3 block text-3xl font-semibold text-emerald-300">{statusCounts["已关闭"] ?? 0}</strong>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#d7e2ea]/55">异常列表</p>
                <h2 className="mt-1 text-xl font-semibold text-[#e0f2fe]">待关注记录</h2>
              </div>
              <span className="text-sm text-[#d7e2ea]/50">{visibleAlerts.length} 条记录</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFilter(filter)}
                  aria-pressed={selectedFilter === filter}
                  className={
                    selectedFilter === filter
                      ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200"
                      : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65 transition-colors hover:border-cyan-300/30 hover:text-cyan-200"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {visibleAlerts.length > 0 ? (
                visibleAlerts.map((alert) => {
                  const currentStatus = alertStatuses[alert.id];

                  return (
                    <button
                      key={alert.id}
                      type="button"
                      onClick={() => setSelectedAlertId(alert.id)}
                      aria-pressed={alert.id === selectedAlert?.id}
                      className={
                        alert.id === selectedAlert?.id
                          ? "w-full rounded-xl border border-cyan-300/35 bg-cyan-300/[0.08] p-4 text-left ring-1 ring-inset ring-cyan-300/20"
                          : "w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-cyan-300/25"
                      }
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#e0f2fe]">{alert.pool}</p>
                          <p className="mt-1 text-sm text-[#d7e2ea]/55">{alert.species}</p>
                        </div>
                        <span className="text-xs text-[#d7e2ea]/45">{alert.time}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-[#e0f2fe]">{alert.metric}</span>
                        <span className="text-sm text-[#d7e2ea]/65">{alert.value}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={
                            alert.level === "异常"
                              ? "rounded-full border border-rose-300/30 bg-rose-300/10 px-2.5 py-1 text-xs font-medium text-rose-300"
                              : "rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-300"
                          }
                        >
                          {alert.level}
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-[#d7e2ea]/50">
                  当前筛选条件下没有异常记录。
                </p>
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            {selectedAlert ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-sm text-[#d7e2ea]/55">异常详情</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#e0f2fe]">
                      {selectedAlert.pool} · {selectedAlert.metric}
                    </h2>
                    <p className="mt-2 text-sm text-[#d7e2ea]/60">
                      {selectedAlert.species} · 发生于 {selectedAlert.time}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={
                        selectedAlert.level === "异常"
                          ? "rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-medium text-rose-300"
                          : "rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-300"
                      }
                    >
                      {selectedAlert.level}
                    </span>
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass(selectedAlertStatus)}`}>
                      {selectedAlertStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-[#08131b] p-4">
                    <span className="text-sm text-[#d7e2ea]/55">当前值</span>
                    <strong className="mt-2 block text-3xl font-semibold text-[#e0f2fe]">
                      {selectedAlert.value}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#08131b] p-4">
                    <span className="text-sm text-[#d7e2ea]/55">当前处理状态</span>
                    <strong className="mt-2 block text-xl font-semibold text-[#e0f2fe]">
                      {selectedAlertStatus}
                    </strong>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-[#08131b] p-5">
                  <h3 className="font-semibold text-[#e0f2fe]">异常说明</h3>
                  <p className="mt-3 text-sm leading-7 text-[#d7e2ea]/65">
                    {selectedAlert.description}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
                  <h3 className="font-semibold text-cyan-100">系统建议</h3>
                  <p className="mt-3 text-sm leading-7 text-[#d7e2ea]/70">
                    {selectedAlert.suggestion}
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#e0f2fe]">处理状态流转</h3>
                    <span className="text-xs text-[#d7e2ea]/45">可直接选择当前状态</span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateSelectedAlertStatus(status)}
                        aria-pressed={selectedAlertStatus === status}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${statusClass(status)} ${
                          selectedAlertStatus === status
                            ? "ring-1 ring-inset ring-[#e0f2fe]/35"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <h3 className="font-semibold text-[#e0f2fe]">处理备注</h3>
                  <textarea
                    value={handlingNote}
                    onChange={(event) => setHandlingNote(event.target.value)}
                    placeholder="填写本次采取的处理措施、现场情况或后续观察计划……"
                    className="mt-4 min-h-28 w-full resize-y rounded-xl border border-white/10 bg-[#08131b] px-4 py-3 text-sm leading-6 text-[#e0f2fe] outline-none placeholder:text-[#d7e2ea]/35 focus:border-cyan-300/35"
                  />
                  <button
                    type="button"
                    onClick={saveHandlingNote}
                    className="mt-3 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/15"
                  >
                    保存处理记录
                  </button>
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-[#08131b] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-[#d7e2ea]/55">历史趋势</p>
                      <h3 className="mt-1 font-semibold text-[#e0f2fe]">{selectedAlert.metric}事件前后变化</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[["1h", "最近1小时"], ["6h", "最近6小时"], ["24h", "最近24小时"]].map(([id, label]) => (
                        <button key={id} type="button" onClick={() => setSelectedAlertRange(id)} aria-pressed={selectedAlertRange === id} className={selectedAlertRange === id ? "rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200" : "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#d7e2ea]/65"}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <TrendLineChart className="mt-5" metricId={alertMetricIds[selectedAlert.metric] ?? "temperature"} currentValue={selectedAlert.value} range={selectedAlertRange} seed={`${selectedAlert.id}-${selectedAlert.pool}`} status={selectedAlert.level} profile="event" />
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#d7e2ea]/55">
                    <span>青色曲线：事件前后监测值</span>
                    <span>黄色虚线：预警参考</span>
                    <span>红色虚线：异常参考</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-[#e0f2fe]">处理时间线</h3>
                  <div className="mt-5 space-y-5 border-l border-white/10 pl-5">
                    <div className="relative">
                      <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-rose-300"></span>
                      <p className="text-xs text-[#d7e2ea]/45">{selectedAlert.time}</p>
                      <p className="mt-1 font-medium text-[#e0f2fe]">系统检测到指标异常</p>
                      <p className="mt-1 text-sm leading-6 text-[#d7e2ea]/60">{selectedAlert.metric} 指标触发预警规则。</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-cyan-300"></span>
                      <p className="text-xs text-[#d7e2ea]/45">{selectedAlert.time}</p>
                      <p className="mt-1 font-medium text-[#e0f2fe]">异常记录已创建</p>
                      <p className="mt-1 text-sm leading-6 text-[#d7e2ea]/60">系统已将异常同步至预警中心，等待工作人员处理。</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-amber-300"></span>
                      <p className="text-xs text-[#d7e2ea]/45">当前</p>
                      <p className="mt-1 font-medium text-[#e0f2fe]">{selectedAlertStatus === "未处理" ? "等待工作人员处理" : `当前状态：${selectedAlertStatus}`}</p>
                      <p className="mt-1 text-sm leading-6 text-[#d7e2ea]/60">可在上方更新处理状态并记录现场处置情况。</p>
                    </div>
                    {(handlingNotes[selectedAlert.id] ?? []).map((note, index) => (
                      <div key={`${note.title}-${index}`} className="relative">
                        <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-300"></span>
                        <p className="text-xs text-[#d7e2ea]/45">刚刚</p>
                        <p className="mt-1 font-medium text-[#e0f2fe]">{note.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#d7e2ea]/60">{note.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-96 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-[#d7e2ea]/50">
                当前筛选条件下没有可查看的异常详情。
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
