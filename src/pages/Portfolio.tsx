import React, { useState, useEffect } from 'react';
import { albumsService } from '../services/albumsService';
import { Album, Foto } from '../types/albums';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

export function Portfolio() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumFotos, setAlbumFotos] = useState<Foto[]>([]);
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null);
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingFotos, setLoadingFotos] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumsService.getAlbumsAtivos();
      setAlbums(data);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlbumFotos = async (albumId: string) => {
    try {
      setLoadingFotos(true);
      const fotos = await albumsService.getFotosByAlbum(albumId);
      setAlbumFotos(fotos);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoadingFotos(false);
    }
  };

  const handleAlbumClick = async (album: Album) => {
    setSelectedAlbum(album);
    await loadAlbumFotos(album.id);
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setAlbumFotos([]);
    setSelectedFoto(null);
  };

  const handleFotoClick = (foto: Foto, index: number) => {
    setSelectedFoto(foto);
    setCurrentFotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedFoto(null);
  };

  const handlePrevFoto = () => {
    if (currentFotoIndex > 0) {
      const newIndex = currentFotoIndex - 1;
      setCurrentFotoIndex(newIndex);
      setSelectedFoto(albumFotos[newIndex]);
    }
  };

  const handleNextFoto = () => {
    if (currentFotoIndex < albumFotos.length - 1) {
      const newIndex = currentFotoIndex + 1;
      setCurrentFotoIndex(newIndex);
      setSelectedFoto(albumFotos[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseLightbox();
    } else if (e.key === 'ArrowLeft') {
      handlePrevFoto();
    } else if (e.key === 'ArrowRight') {
      handleNextFoto();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {!selectedAlbum ? (
          // Lista de Álbuns
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light text-gray-900 mb-4">Portfólio</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore nossa coleção de momentos especiais capturados com carinho e dedicação.
              </p>
            </div>

            {albums.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Em breve</h3>
                <p className="mt-2 text-gray-500">Nossos álbuns de fotos estarão disponíveis em breve.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => handleAlbumClick(album)}
                    className="group cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {album.capa_url ? (
                        <img
                          src={album.capa_url}
                          alt={album.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{album.titulo}</h3>
                      {album.descricao && (
                        <p className="text-gray-600 line-clamp-2">{album.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Visualização de Fotos do Álbum
          <div>
            <div className="mb-8">
              <button
                onClick={handleBackToAlbums}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Voltar aos álbuns
              </button>
              
              <div className="text-center">
                <h1 className="text-3xl font-light text-gray-900 mb-2">{selectedAlbum.titulo}</h1>
                {selectedAlbum.descricao && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{selectedAlbum.descricao}</p>
                )}
              </div>
            </div>

            {loadingFotos ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : albumFotos.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma foto encontrada</h3>
                <p className="mt-2 text-gray-500">Este álbum ainda não possui fotos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albumFotos.map((foto, index) => (
                  <div
                    key={foto.id}
                    onClick={() => handleFotoClick(foto, index)}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={foto.thumbnail_url || foto.url}
                        alt={foto.titulo || 'Foto'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ImageIcon className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    
                    {foto.titulo && (
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{foto.titulo}</h4>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedFoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Botão de fechar */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navegação anterior */}
            {currentFotoIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevFoto();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Navegação próxima */}
            {currentFotoIndex < albumFotos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextFoto();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Imagem */}
            <div className="relative">
              <img
                src={selectedFoto.url}
                alt={selectedFoto.titulo || 'Foto'}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Informações da foto */}
              {(selectedFoto.titulo || selectedFoto.descricao) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                  {selectedFoto.titulo && (
                    <h3 className="text-lg font-medium mb-1">{selectedFoto.titulo}</h3>
                  )}
                  {selectedFoto.descricao && (
                    <p className="text-sm text-gray-300">{selectedFoto.descricao}</p>
                  )}
                </div>
              )}
            </div>

            {/* Contador */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentFotoIndex + 1} / {albumFotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}