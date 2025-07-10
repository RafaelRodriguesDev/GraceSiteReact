import React from 'react';
import { X, FileImage, FolderOpen } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMultipleFileUpload: (files: FileList) => void;
  onZipUpload: (file: File) => void;
  bulkUploading: boolean;
  uploadProgress: { current: number; total: number };
}

export function BulkUploadModal({
  isOpen,
  onClose,
  onMultipleFileUpload,
  onZipUpload,
  bulkUploading,
  uploadProgress
}: BulkUploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Upload Múltiplo de Fotos
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={bulkUploading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Upload de Múltiplas Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileImage className="h-4 w-4 inline mr-1" />
                Selecionar Múltiplas Imagens
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    onMultipleFileUpload(files);
                  }
                }}
                disabled={bulkUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Selecione múltiplas imagens (JPG, PNG, GIF, WebP)
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
            
            {/* Upload de ZIP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FolderOpen className="h-4 w-4 inline mr-1" />
                Upload de Arquivo ZIP
              </label>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onZipUpload(file);
                  }
                }}
                disabled={bulkUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Arquivo ZIP contendo imagens (JPG, PNG, GIF, WebP)
              </p>
            </div>
            
            {/* Progress Bar */}
            {bulkUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Fazendo upload...</span>
                  <span>{uploadProgress.current} de {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={bulkUploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                {bulkUploading ? 'Aguarde...' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}