import React, { useState, useEffect } from "react";
import { albumsService } from "../services/albumsService";
import { Album, Foto } from "../types/albums";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Heart,
  Star,
  Download,
} from "lucide-react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import {
  AlbumCardSkeleton,
  PhotoCardSkeleton,
} from "../components/ui/LoadingSkeleton";
import {
  NoAlbumsState,
  NoPhotosState,
  ErrorState,
} from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { LogoWatermark } from "../components/Logo";

export function NewPortfolio() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumFotos, setAlbumFotos] = useState<Foto[]>([]);
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null);
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingFotos, setLoadingFotos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await albumsService.getAlbumsAtivos();
      setAlbums(data);
    } catch (error) {
      console.error("Erro ao carregar álbuns:", error);
      setError("Erro ao carregar álbuns. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const loadAlbumFotos = async (albumId: string) => {
    try {
      setLoadingFotos(true);
      setError(null);
      const fotos = await albumsService.getFotosByAlbum(albumId);
      setAlbumFotos(fotos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      setError("Erro ao carregar fotos. Tente novamente.");
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

  const toggleFavorite = (fotoId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(fotoId)) {
      newFavorites.delete(fotoId);
    } else {
      newFavorites.add(fotoId);
    }
    setFavorites(newFavorites);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCloseLightbox();
    } else if (e.key === "ArrowLeft") {
      handlePrevFoto();
    } else if (e.key === "ArrowRight") {
      handleNextFoto();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-safe py-12">
          <div className="text-center mb-16">
            <div className="skeleton h-12 w-64 mx-auto mb-4"></div>
            <div className="skeleton h-6 w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <AlbumCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-safe py-12">
        {!selectedAlbum ? (
          // Lista de Álbuns
          <div>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-[HappyBirthday4] text-gray-900 mb-6">
                Portfólio
              </h1>
              <div className="w-24 h-1 bg-gray-900 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore nossa coleção de momentos especiais capturados com
                carinho e dedicação. Cada álbum conta uma história única e
                emocionante.
              </p>
            </div>

            {error ? (
              <ErrorState
                title="Erro ao carregar álbuns"
                description={error}
                onRetry={loadAlbums}
              />
            ) : albums.length === 0 ? (
              <NoAlbumsState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {albums.map((album, index) => (
                  <div
                    key={album.id}
                    onClick={() => handleAlbumClick(album)}
                    className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        {album.capa_url ? (
                          <div className="relative">
                            <img
                              src={album.capa_url}
                              alt={album.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Marca d'água grande cobrindo o card */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <img
                                src="/logo/LG_PRETO.png"
                                alt=""
                                className="w-3/4 h-3/4 object-contain opacity-10 grayscale"
                                style={{
                                  filter: "grayscale(100%)",
                                  mixBlendMode: "multiply",
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <div className="flex items-center gap-2 text-gray-900">
                              <Camera className="h-5 w-5" />
                              <span className="font-semibold">Ver Álbum</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          {album.titulo}
                        </h3>
                        {album.descricao && (
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {album.descricao}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          <span>Ver fotos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Visualização de Fotos do Álbum
          <div>
            <div className="mb-12">
              <Button
                onClick={handleBackToAlbums}
                variant="ghost"
                leftIcon={<ChevronLeft className="h-5 w-5" />}
                className="mb-8"
              >
                Voltar aos álbuns
              </Button>

              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-[HappyBirthday4] text-gray-900 mb-4">
                  {selectedAlbum.titulo}
                </h1>
                <div className="w-16 h-1 bg-gray-900 mx-auto mb-6"></div>
                {selectedAlbum.descricao && (
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {selectedAlbum.descricao}
                  </p>
                )}
              </div>
            </div>

            {loadingFotos ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <PhotoCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Erro ao carregar fotos"
                description={error}
                onRetry={() =>
                  selectedAlbum && loadAlbumFotos(selectedAlbum.id)
                }
              />
            ) : albumFotos.length === 0 ? (
              <NoPhotosState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {albumFotos.map((foto, index) => (
                  <div
                    key={foto.id}
                    onClick={() => handleFotoClick(foto, index)}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                          src={foto.thumbnail_url || foto.url}
                          alt={foto.titulo || "Foto"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        <LogoWatermark position="bottom-right" size="xs" />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                              <ImageIcon className="h-6 w-6 text-gray-700" />
                            </div>
                          </div>
                        </div>

                        {/* Botão de favorito */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(foto.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${
                              favorites.has(foto.id)
                                ? "text-red-500 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>

                      {foto.titulo && (
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {foto.titulo}
                          </h4>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Melhorado */}
      {selectedFoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleCloseLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Header do Lightbox */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {currentFotoIndex + 1} de {albumFotos.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(selectedFoto.id);
                  }}
                  className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Favoritar"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.has(selectedFoto.id)
                        ? "text-red-500 fill-current"
                        : "text-white"
                    }`}
                  />
                </button>

                <button
                  onClick={handleCloseLightbox}
                  className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navegação */}
            {currentFotoIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevFoto();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {currentFotoIndex < albumFotos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextFoto();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Imagem */}
            <div className="relative flex items-center justify-center h-full">
              <img
                src={selectedFoto.url}
                alt={selectedFoto.titulo || "Foto"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Informações da foto */}
              {(selectedFoto.titulo || selectedFoto.descricao) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  {selectedFoto.titulo && (
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {selectedFoto.titulo}
                    </h3>
                  )}
                  {selectedFoto.descricao && (
                    <p className="text-gray-300 leading-relaxed">
                      {selectedFoto.descricao}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
