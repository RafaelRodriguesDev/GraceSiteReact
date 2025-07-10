import React, { useState, useEffect } from 'react';
import { Album, CreateAlbumData } from '../../types/albums';
import { albumsService } from '../../services/albumsService';
import {
  X,
  Save,
  FolderOpen,
  FileImage
} from 'lucide-react';

interface AlbumFormProps {
  album?: Album;
  onSubmit: (data: CreateAlbumData, enableBulkUpload?: boolean, bulkFiles?: FileList | null, zipFile?: File | null) => void;
  onCancel: () => void;
  loading?: boolean;
  bulkUploading?: boolean;
}

export const AlbumForm: React.FC<AlbumFormProps> = ({
  album,
  onSubmit,
  onCancel,
  loading = false,
  bulkUploading = false
}) => {
  const [formData, setFormData] = useState<CreateAlbumData>({
    titulo: '',
    descricao: '',
    capa_url: '',
    ativo: true,
    ordem: 1
  });
  
  const [uploading, setUploading] = useState(false);
  const [enableBulkUploadOnCreate, setEnableBulkUploadOnCreate] = useState(false);
  const [pendingBulkFiles, setPendingBulkFiles] = useState<FileList | null>(null);
  const [pendingZipFile, setPendingZipFile] = useState<File | null>(null);

  useEffect(() => {
    if (album) {
      setFormData({
        titulo: album.titulo,
        descricao: album.descricao || '',
        capa_url: album.capa_url,
        ativo: album.ativo,
        ordem: album.ordem
      });
    }
  }, [album]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await albumsService.uploadFile(file, 'albums');
      setFormData(prev => ({ ...prev, capa_url: url }));
    } catch (err) {
      console.error('Erro ao fazer upload do arquivo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, enableBulkUploadOnCreate, pendingBulkFiles, pendingZipFile);
  };

  const isEditing = !!album;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Álbum' : 'Novo Álbum'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem de Capa *
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {uploading && (
                  <p className="text-sm text-blue-600">Fazendo upload...</p>
                )}
                {formData.capa_url && (
                  <div className="mt-2">
                    <img
                      src={formData.capa_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.ativo ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'true' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
            
            {/* Seção de Upload Múltiplo (apenas para novos álbuns) */}
            {!isEditing && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="enableBulkUpload"
                    checked={enableBulkUploadOnCreate}
                    onChange={(e) => {
                      setEnableBulkUploadOnCreate(e.target.checked);
                      if (!e.target.checked) {
                        setPendingBulkFiles(null);
                        setPendingZipFile(null);
                      }
                    }}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableBulkUpload" className="text-sm font-medium text-gray-700">
                    <FolderOpen className="h-4 w-4 inline mr-1" />
                    Adicionar fotos após criar o álbum
                  </label>
                </div>
                
                {enableBulkUploadOnCreate && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
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
                            setPendingBulkFiles(files);
                            setPendingZipFile(null);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                        <span className="px-2 bg-gray-50 text-gray-500">ou</span>
                      </div>
                    </div>
                    
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
                            setPendingZipFile(file);
                            setPendingBulkFiles(null);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Arquivo ZIP contendo imagens (JPG, PNG, GIF, WebP)
                      </p>
                    </div>
                    
                    {(pendingBulkFiles || pendingZipFile) && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✓ {pendingBulkFiles ? `${pendingBulkFiles.length} arquivos` : 'Arquivo ZIP'} selecionado(s) para upload após criar o álbum
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading || bulkUploading || loading || !formData.titulo || !formData.capa_url}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {bulkUploading ? 'Fazendo Upload...' : (isEditing ? 'Atualizar' : 'Criar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlbumForm;