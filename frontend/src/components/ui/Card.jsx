import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => {
  if (title || subtitle || action) {
    return (
      <div className={`p-5 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}>
        <div>
          {title && <h3 className="text-base font-semibold text-slate-900 leading-snug">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
  return <div className={`p-5 pb-3 border-b border-slate-100 ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`p-4 bg-slate-50/70 border-t border-slate-100 rounded-b-xl ${className}`}>{children}</div>;
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald', // 'emerald' | 'amber' | 'sky' | 'teal' | 'purple' | 'slate'
  trend,
  className = '',
  onClick,
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconText: 'text-emerald-600',
      iconBg: 'bg-emerald-100/80',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconText: 'text-amber-600',
      iconBg: 'bg-amber-100/80',
    },
    sky: {
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      iconText: 'text-sky-600',
      iconBg: 'bg-sky-100/80',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      iconText: 'text-teal-600',
      iconBg: 'bg-teal-100/80',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      iconText: 'text-purple-600',
      iconBg: 'bg-purple-100/80',
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      iconText: 'text-slate-600',
      iconBg: 'bg-slate-200/80',
    },
  };

  const currentTheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 ${
        onClick ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentTheme.iconBg} ${currentTheme.iconText}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
