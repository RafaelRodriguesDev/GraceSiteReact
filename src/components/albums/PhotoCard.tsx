import React from 'react';
import { Foto } from '../../types/albums';
import {
  Edit,
  Trash2
} from 'lucide-react';

interface PhotoCardProps {
  photo: Foto;
  onEdit: (photo: Foto) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (photoId: string, selected: boolean) => void;
  selectionMode?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  selectionMode = false
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(photo.id, e.target.checked);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={photo.thumbnail_url || photo.url}
          alt={photo.titulo || 'Foto'}
          className="w-full h-full object-cover"
        />
        
        {/* Checkbox de seleção */}
        {selectionMode && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
        )}
      </div>
      
      <div className="p-4">
        {photo.titulo && (
          <h4 className="text-sm font-medium text-gray-900 mb-1">{photo.titulo}</h4>
        )}
        {photo.descricao && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{photo.descricao}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">#{photo.ordem}</span>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(photo)}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Editar"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={() => onDelete(photo.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;