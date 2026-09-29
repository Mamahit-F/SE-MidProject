import React from 'react';

export const StatusDistributionChart = ({ waiting = 0, inProgress = 0, resolved = 0 }) => {
  const total = (waiting + inProgress + resolved) || 1;
  const waitingPct = Math.round((waiting / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const resolvedPct = Math.round((resolved / total) * 100);

  return (
    <div className="space-y-4">
      {/* Visual Multi-segment Progress Bar */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${waitingPct}%` }}
          className="bg-amber-500 h-full transition-all duration-500 hover:opacity-90"
          title={`Menunggu: ${waiting} (${waitingPct}%)`}
        />
        <div
          style={{ width: `${inProgressPct}%` }}
          className="bg-sky-500 h-full transition-all duration-500 hover:opacity-90"
          title={`Diproses: ${inProgress} (${inProgressPct}%)`}
        />
        <div
          style={{ width: `${resolvedPct}%` }}
          className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-90"
          title={`Ditangani: ${resolved} (${resolvedPct}%)`}
        />
      </div>

      {/* Legend & Numbers */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Menunggu
          </div>
          <p className="text-lg font-bold text-amber-900 mt-1">{waiting}</p>
          <span className="text-[11px] text-amber-700">{waitingPct}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Diproses
          </div>
          <p className="text-lg font-bold text-sky-900 mt-1">{inProgress}</p>
          <span className="text-[11px] text-sky-700">{inProgressPct}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ditangani
          </div>
          <p className="text-lg font-bold text-emerald-900 mt-1">{resolved}</p>
          <span className="text-[11px] text-emerald-700">{resolvedPct}%</span>
        </div>
      </div>
    </div>
  );
};

export const WeeklyTrendChart = () => {
  const days = [
    { day: 'Sen', count: 4, height: '40%' },
    { day: 'Sel', count: 7, height: '70%' },
    { day: 'Rab', count: 5, height: '50%' },
    { day: 'Kam', count: 9, height: '90%' },
    { day: 'Jum', count: 6, height: '60%' },
    { day: 'Sab', count: 2, height: '20%' },
    { day: 'Min', count: 1, height: '10%' },
  ];

  return (
    <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
      {days.map((item) => (
        <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="relative w-full max-w-[28px] h-28 bg-slate-100 rounded-t-md flex items-end justify-center overflow-hidden">
            <div
              style={{ height: item.height }}
              className="w-full bg-emerald-500 group-hover:bg-emerald-600 transition-all duration-300 rounded-t-md"
            />
            <span className="absolute -top-6 text-[11px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.count}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

export const LocationRankingList = ({ locationCounts = {} }) => {
  const entries = Object.entries(locationCounts);
  if (entries.length === 0) {
    entries.push(['Gedung A', 2], ['Gedung B', 1], ['Gedung C', 1], ['Taman', 1]);
  }

  const maxVal = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="space-y-3">
      {entries.map(([location, count], idx) => {
        const pct = Math.round((count / maxVal) * 100);
        return (
          <div key={location} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {location}
              </span>
              <span className="font-semibold text-slate-900">{count} laporan</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${pct}%` }}
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
