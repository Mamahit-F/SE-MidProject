import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200 animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-slate-200 animate-slide-up`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-5 border-b border-slate-100">
              <div>
                {title && <h3 className="text-lg font-semibold text-slate-900 leading-tight">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Tutup dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'success'
  isLoading = false,
  icon,
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-100';
      case 'warning':
        return 'bg-amber-100';
      case 'success':
        return 'bg-emerald-100';
      default:
        return 'bg-emerald-100';
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={!isLoading}>
      <div className="text-center sm:text-left sm:flex sm:items-start gap-4">
        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getIconBg()} sm:mx-0`}>
          {getIcon()}
        </div>
        <div className="mt-3 sm:mt-0 flex-1">
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={getConfirmButtonVariant()}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
