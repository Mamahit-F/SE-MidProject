import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  CheckCircle2,
  UserPlus,
  Clock,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, timeAgo } from '../../utils/formatters';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);

    if (notif.relatedReportId) {
      if (role === 'ADMIN') {
        navigate(`/admin/reports/${notif.relatedReportId}`);
      } else if (role === 'STAFF') {
        navigate(`/staff/reports/${notif.relatedReportId}`);
      } else {
        navigate(`/user/reports/${notif.relatedReportId}`);
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'REPORT_CREATED':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'REPORT_APPROVED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'REPORT_REJECTED':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'REPORT_PROCESSING':
        return <Loader2 className="w-4 h-4 text-sky-500" />;
      case 'REPORT_RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'USER_REGISTERED':
        return <UserPlus className="w-4 h-4 text-indigo-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-100 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                title="Tandai semua telah dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai dibaca</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-medium">Belum ada notifikasi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Aktivitas dan pembaruan laporan akan muncul di sini.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                    !notif.isRead ? 'bg-sky-50/50' : 'bg-white'
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {formatDate(notif.createdAt)}
                      </span>
                      {!notif.isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
