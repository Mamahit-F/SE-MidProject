import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 6)}`;
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors py-2.5 
            ${Icon ? 'pl-10' : 'pl-3.5'} 
            ${isPasswordType ? 'pr-10' : 'pr-3.5'}
            ${
              error
                ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20'
            }
            focus:outline-none focus:ring-4 bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  id,
  maxLength,
  ...props
}) => {
  const inputId = id || name || `textarea-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {maxLength && (
            <span className="text-xs text-slate-400">
              {(value || '').length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <div className="relative rounded-lg shadow-sm">
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`block w-full rounded-lg border text-sm transition-colors p-3.5 
            ${
              error
                ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20'
            }
            focus:outline-none focus:ring-4 bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = '-- Pilih Opsi --',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || name || `select-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors py-2.5 px-3.5 
            ${
              error
                ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20'
            }
            focus:outline-none focus:ring-4 bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
