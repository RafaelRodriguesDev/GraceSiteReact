import { useState, useEffect } from 'react';
import { Foto, CreateFotoData } from '../types/albums';
import { albumsService } from '../services/albumsService';

export const usePhotos = (albumId?: string) => {
  const [photos, setPhotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = async (id?: string) => {
    const targetAlbumId = id || albumId;
    if (!targetAlbumId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await albumsService.getFotosByAlbum(targetAlbumId);
      setPhotos(data);
    } catch (err) {
      setError('Erro ao carregar fotos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPhoto = async (photoData: CreateFotoData): Promise<Foto | null> => {
    try {
      setError(null);
      const newPhoto = await albumsService.createFoto(photoData);
      setPhotos(prev => [...prev, newPhoto]);
      return newPhoto;
    } catch (err) {
      setError('Erro ao criar foto');
      console.error(err);
      return null;
    }
  };

  const updatePhoto = async (id: string, photoData: CreateFotoData): Promise<boolean> => {
    try {
      setError(null);
      const updatedPhoto = await albumsService.updateFoto(id, photoData);
      setPhotos(prev => prev.map(photo => 
        photo.id === id ? updatedPhoto : photo
      ));
      return true;
    } catch (err) {
      setError('Erro ao atualizar foto');
      console.error(err);
      return false;
    }
  };

  const deletePhoto = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await albumsService.deleteFoto(id);
      setPhotos(prev => prev.filter(photo => photo.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir foto');
      console.error(err);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  useEffect(() => {
    if (albumId) {
      loadPhotos(albumId);
    }
  }, [albumId]);

  return {
    photos,
    loading,
    error,
    loadPhotos,
    createPhoto,
    updatePhoto,
    deletePhoto,
    clearError,
    clearPhotos
  };
};

export default usePhotos;