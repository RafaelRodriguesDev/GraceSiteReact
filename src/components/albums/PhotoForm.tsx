import React, { useState, useEffect } from 'react';
import { Foto, CreateFotoData } from '../../types/albums';
import { albumsService } from '../../services/albumsService';
import {
  X,
  Save
} from 'lucide-react';

interface PhotoFormProps {
  photo?: Foto;
  albumId: string;
  onSubmit: (data: CreateFotoData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PhotoForm: React.FC<PhotoFormProps> = ({
  photo,
  albumId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateFotoData>({
    album_id: albumId,
    titulo: '',
    descricao: '',
    url: '',
    thumbnail_url: '',
    ordem: 1
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (photo) {
      setFormData({
        album_id: photo.album_id,
        titulo: photo.titulo || '',
        descricao: photo.descricao || '',
        url: photo.url,
        thumbnail_url: photo.thumbnail_url || photo.url,
        ordem: photo.ordem
      });
    } else {
      setFormData(prev => ({ ...prev, album_id: albumId }));
    }
  }, [photo, albumId]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await albumsService.uploadFile(file, 'albums');
      setFormData(prev => ({ ...prev, url, thumbnail_url: url }));
    } catch (err) {
      console.error('Erro ao fazer upload do arquivo:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!photo;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Editar Foto' : 'Nova Foto'}
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
                Título
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem *
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
                {formData.url && (
                  <div className="mt-2">
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
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
                disabled={uploading || loading || !formData.url}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {isEditing ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoForm;