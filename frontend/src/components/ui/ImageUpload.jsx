import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { formatFileSize } from '../../utils/formatters';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Sample realistic facility issue presets for instant prototyping convenience
const SAMPLE_PRESETS = [
  {
    name: 'Tumpahan Minuman',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Wastafel Mampet',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tempat Sampah Penuh',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lantai Kotor',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
  },
];

export const ImageUpload = ({
  value, // string URL or dataURL
  onChange,
  error,
  required = false,
  label = 'Upload Foto Bukti',
  helperText = 'Pastikan foto menunjukkan kondisi area yang perlu dibersihkan dengan jelas (Maks. 5 MB).',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setFileError('');
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`Ukuran file terlalu besar (${formatFileSize(file.size)}). Maksimum ukuran foto adalah 5 MB.`);
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.onerror = () => {
      setFileError('Gagal membaca file foto. Silakan coba kembali.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileInfo(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handlePresetSelect = (url, name) => {
    onChange(url);
    setFileInfo({ name: `Contoh Foto: ${name}`, size: 1024 * 350 });
    setFileError('');
  };

  const activeError = error || fileError;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Foto terpasang
          </span>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group">
          <img
            src={value}
            alt="Preview Bukti Kebersihan"
            className="w-full h-56 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4 opacity-95 sm:opacity-90 sm:hover:opacity-100 transition-opacity">
            <div className="flex justify-between items-start">
              {fileInfo && (
                <div className="bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md max-w-[70%] truncate">
                  <span className="font-medium">{fileInfo.name}</span>
                  {fileInfo.size && (
                    <span className="text-slate-300 ml-1.5">({formatFileSize(fileInfo.size)})</span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="bg-rose-600/90 hover:bg-rose-700 text-white p-2 rounded-lg transition-colors shadow-md ml-auto"
                title="Hapus Foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 hover:bg-white text-slate-800 text-xs"
              >
                Ganti Foto
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Camera}
                onClick={() => cameraInputRef.current?.click()}
                className="sm:hidden bg-white/90 hover:bg-white text-slate-800 text-xs"
              >
                Ambil Ulang
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/10'
              : activeError
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-sm font-semibold text-slate-800 mb-1">
              Tarik & lepaskan foto di sini, atau
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Format JPG, PNG, WEBP hingga 5 MB
            </p>

            <div className="flex flex-wrap justify-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={ImageIcon}
                onClick={() => fileInputRef.current?.click()}
              >
                Pilih File Foto
              </Button>
              
              {/* Mobile camera direct trigger */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Camera}
                onClick={() => cameraInputRef.current?.click()}
                className="sm:hidden"
              >
                Ambil Foto
              </Button>
            </div>

            {/* Quick Demo Preset selector */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 w-full max-w-md">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Atau pilih contoh foto cepat (Demo):
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url, preset.name)}
                    className="text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error or Helper text */}
      {activeError ? (
        <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">{helperText}</p>
      ) : null}
    </div>
  );
};
