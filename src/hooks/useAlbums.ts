import { useState, useEffect } from 'react';
import { Album, CreateAlbumData } from '../types/albums';
import { albumsService } from '../services/albumsService';

export const useAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await albumsService.getAllAlbums();
      setAlbums(data);
    } catch (err) {
      setError('Erro ao carregar álbuns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async (albumData: CreateAlbumData): Promise<Album | null> => {
    try {
      setError(null);
      const newAlbum = await albumsService.createAlbum(albumData);
      setAlbums(prev => [...prev, newAlbum]);
      return newAlbum;
    } catch (err) {
      setError('Erro ao criar álbum');
      console.error(err);
      return null;
    }
  };

  const updateAlbum = async (id: string, albumData: CreateAlbumData): Promise<boolean> => {
    try {
      setError(null);
      const updatedAlbum = await albumsService.updateAlbum(id, albumData);
      setAlbums(prev => prev.map(album => 
        album.id === id ? updatedAlbum : album
      ));
      return true;
    } catch (err) {
      setError('Erro ao atualizar álbum');
      console.error(err);
      return false;
    }
  };

  const deleteAlbum = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await albumsService.deleteAlbum(id);
      setAlbums(prev => prev.filter(album => album.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir álbum');
      console.error(err);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  return {
    albums,
    loading,
    error,
    loadAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    clearError
  };
};

export default useAlbums;