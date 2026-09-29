import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  CircleDot,
  User,
  Wrench,
  ShieldCheck,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { REPORT_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export const StatusTimeline = ({
  currentStatus,
  timeline = [],
  createdAt,
  approvedAt,
  processedAt,
  resolvedAt,
  rejectionReason,
}) => {
  const isRejected = currentStatus === REPORT_STATUS.REJECTED;

  const steps = [
    {
      key: REPORT_STATUS.PENDING_VERIFICATION,
      label: 'Menunggu Verifikasi',
      description: 'Laporan baru dibuat dan menunggu pemeriksaan Admin.',
      time: createdAt,
      icon: Clock,
    },
    {
      key: isRejected ? REPORT_STATUS.REJECTED : REPORT_STATUS.APPROVED,
      label: isRejected ? 'Ditolak Admin' : 'Disetujui Admin',
      description: isRejected
        ? 'Laporan ditolak oleh Admin.'
        : 'Admin memverifikasi dan meneruskan ke Petugas.',
      time: approvedAt,
      icon: isRejected ? XCircle : ShieldCheck,
    },
    {
      key: REPORT_STATUS.PROCESSING,
      label: 'Diproses Petugas',
      description: 'Petugas kebersihan aktif menangani di lokasi.',
      time: processedAt,
      icon: Loader2,
    },
    {
      key: REPORT_STATUS.RESOLVED,
      label: 'Selesai Ditangani',
      description: 'Area telah bersih tuntas dan siap digunakan.',
      time: resolvedAt,
      icon: CheckCircle2,
    },
  ];

  const getStepState = (stepIndex) => {
    if (isRejected) {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'rejected';
      return 'disabled';
    }

    switch (currentStatus) {
      case REPORT_STATUS.RESOLVED:
        return 'completed';
      case REPORT_STATUS.PROCESSING:
        if (stepIndex <= 1) return 'completed';
        if (stepIndex === 2) return 'current';
        return 'upcoming';
      case REPORT_STATUS.APPROVED:
        if (stepIndex === 0) return 'completed';
        if (stepIndex === 1) return 'completed';
        if (stepIndex === 2) return 'upcoming';
        return 'upcoming';
      case REPORT_STATUS.PENDING_VERIFICATION:
      default:
        if (stepIndex === 0) return 'current';
        return 'upcoming';
    }
  };

  const getProgressPercentage = () => {
    if (isRejected) return 33;
    switch (currentStatus) {
      case REPORT_STATUS.RESOLVED:
        return 100;
      case REPORT_STATUS.PROCESSING:
        return 66;
      case REPORT_STATUS.APPROVED:
        return 33;
      case REPORT_STATUS.PENDING_VERIFICATION:
      default:
        return 0;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-emerald-600" />
          Tahapan & Alur Verifikasi Laporan
        </h4>
      </div>

      {/* Rejection Alert Banner if Rejected */}
      {isRejected && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Laporan Ditolak oleh Admin</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed pl-6">
            {rejectionReason
              ? `Alasan penolakan: "${rejectionReason}"`
              : 'Laporan ini tidak memenuhi kriteria verifikasi Admin.'}
          </p>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <div className="relative px-2">
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className={`h-full transition-all duration-500 ${
              isRejected ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        <div className="relative flex justify-between z-10">
          {steps.map((step, idx) => {
            const state = getStepState(idx);
            const isCompleted = state === 'completed';
            const isCurrent = state === 'current';
            const isStepRejected = state === 'rejected';
            const isDisabled = state === 'disabled';
            const StepIcon = step.icon;

            return (
              <div
                key={step.key + idx}
                className={`flex flex-col items-center max-w-[85px] sm:max-w-[120px] text-center ${
                  isDisabled ? 'opacity-40' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isStepRejected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 ring-4 ring-rose-50'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-4 ring-amber-50 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  <StepIcon
                    className={`w-5 h-5 ${
                      isCurrent && step.key === REPORT_STATUS.PROCESSING
                        ? 'animate-spin'
                        : ''
                    }`}
                  />
                </div>

                <p
                  className={`mt-2 text-[11px] sm:text-xs font-semibold ${
                    isStepRejected
                      ? 'text-rose-700'
                      : isCompleted || isCurrent
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.time && (
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {formatDate(step.time)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log List */}
      {timeline && timeline.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Riwayat Log Aktivitas:
          </p>
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <div className="relative pb-8">
                    {itemIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3 items-start">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                            item.status === REPORT_STATUS.RESOLVED
                              ? 'bg-emerald-100 text-emerald-600'
                              : item.status === REPORT_STATUS.PROCESSING
                              ? 'bg-sky-100 text-sky-600'
                              : item.status === REPORT_STATUS.APPROVED
                              ? 'bg-blue-100 text-blue-600'
                              : item.status === REPORT_STATUS.REJECTED
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          {item.status === REPORT_STATUS.RESOLVED ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : item.status === REPORT_STATUS.PROCESSING ? (
                            <Wrench className="w-4 h-4" />
                          ) : item.status === REPORT_STATUS.APPROVED ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : item.status === REPORT_STATUS.REJECTED ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                          {item.actor && (
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{item.actor}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-[11px] whitespace-nowrap text-slate-400">
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
