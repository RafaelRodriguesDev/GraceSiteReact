import React from 'react';
import { Album } from '../../types/albums';
import {
  Camera,
  Edit,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  onView: (album: Album) => void;
  onEdit: (album: Album) => void;
  onDelete: (id: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 relative">
        {album.capa_url ? (
          <img
            src={album.capa_url}
            alt={album.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {!album.ativo && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Inativo
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{album.titulo}</h3>
        {album.descricao && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{album.descricao}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Ordem: {album.ordem}</span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(album)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ver fotos"
            >
              <Camera className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onEdit(album)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(album.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;