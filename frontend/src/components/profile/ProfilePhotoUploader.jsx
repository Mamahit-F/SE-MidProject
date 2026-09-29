import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resolveAvatarUrl, formatFileSize } from '../../utils/formatters';
import { Button } from '../ui/Button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfilePhotoUploader = ({ subtitle = 'Format yang didukung: JPG, PNG, WEBP (Maks 5 MB)' }) => {
  const { currentUser, uploadProfilePhoto } = useAuth();
  const { success, error: toastError } = useToast();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const currentAvatar = resolveAvatarUrl(currentUser?.avatar);

  const handleFileValidation = (file) => {
    setErrorMessage('');
    if (!file) return false;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      const msg = 'Format file tidak didukung. Harap pilih foto berformat JPG, PNG, atau WEBP.';
      setErrorMessage(msg);
      toastError('Format Tidak Valid', msg);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      const msg = `Ukuran file (${formatFileSize(file.size)}) melebihi batas maksimal 5 MB.`;
      setErrorMessage(msg);
      toastError('File Terlalu Besar', msg);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && handleFileValidation(file)) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file && handleFileValidation(file)) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleCancelPreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage('');

    try {
      await uploadProfilePhoto(selectedFile);
      success('Foto Profil Diperbarui', 'Foto profil Anda telah berhasil disimpan dan disinkronkan.');
      handleCancelPreview();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal mengunggah foto profil.';
      setErrorMessage(msg);
      toastError('Gagal Mengunggah', msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Display */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
            <img
              src={previewUrl || currentAvatar}
              alt={currentUser?.name || 'Foto Profil'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Ganti Foto Profil"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Action Description & Buttons */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Foto Profil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Upload}
                onClick={() => fileInputRef.current?.click()}
              >
                Pilih Foto Baru
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Foto dipilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={isUploading}
                  icon={Check}
                  onClick={handleSavePhoto}
                >
                  Simpan Foto Profil
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isUploading}
                  icon={X}
                  onClick={handleCancelPreview}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
