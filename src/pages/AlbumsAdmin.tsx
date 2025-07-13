import React, { useState, useEffect, useRef } from "react";
import { Album, Foto, CreateAlbumData, CreateFotoData } from "../types/albums";
import { useAlbums } from "../hooks/useAlbums";
import { usePhotos } from "../hooks/usePhotos";
import { useBulkUpload } from "../hooks/useBulkUpload";

import { AdminLayout } from "../components/albums/AdminLayout";
import { AlbumCard } from "../components/albums/AlbumCard";
import { PhotoCard } from "../components/albums/PhotoCard";
import { AlbumForm } from "../components/albums/AlbumForm";
import { PhotoForm } from "../components/albums/PhotoForm";
import { BulkUploadModal } from "../components/albums/BulkUploadModal";
import { Plus, FolderOpen, Camera, X, Trash2 } from "lucide-react";

export default function AlbumsAdmin() {
  // Estado para controlar o modal de bulk upload após criação de álbum
  const [pendingBulkUpload, setPendingBulkUpload] = useState<{
    albumId: string;
    bulkFiles?: FileList | null;
    zipFile?: File | null;
  } | null>(null);
  const uploadProcessedRef = useRef<string | null>(null);

  const { albums, loading, error, createAlbum, updateAlbum, deleteAlbum } =
    useAlbums();
  const {
    photos: albumFotos,
    loading: photosLoading,
    error: photosError,
    loadPhotos,
    createPhoto,
    updatePhoto,
    deletePhoto,
    clearPhotos,
  } = usePhotos();

  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | undefined>(
    undefined,
  );
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [showFotoForm, setShowFotoForm] = useState(false);
  const [editingFoto, setEditingFoto] = useState<Foto | undefined>(undefined);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  // Hook para upload múltiplo
  const {
    bulkUploading,
    uploadProgress,
    handleMultipleFileUpload,
    handleZipUpload,
  } = useBulkUpload({
    albumId: pendingBulkUpload?.albumId || selectedAlbum?.id || "",
    onPhotoCreated: async (photoData: CreateFotoData) => {
      await createPhoto(photoData);
    },
    onUploadComplete: () => {
      const albumId = pendingBulkUpload?.albumId || selectedAlbum?.id;
      if (albumId) {
        loadPhotos(albumId);
      }
      setShowBulkUpload(false);
      setPendingBulkUpload(null);
      uploadProcessedRef.current = null; // Reset da ref para permitir novos uploads
    },
    currentPhotosCount: albumFotos.length,
  });

  // Efeito para processar upload pendente automaticamente (com delay para estabilidade)
  useEffect(() => {
    if (pendingBulkUpload && showBulkUpload && pendingBulkUpload.albumId) {
      // Verificar se já processamos este upload específico
      if (uploadProcessedRef.current === pendingBulkUpload.albumId) {
        return;
      }

      const { bulkFiles, zipFile } = pendingBulkUpload;

      // Marcar como processado imediatamente para evitar execuções múltiplas
      uploadProcessedRef.current = pendingBulkUpload.albumId;

      // Task em background: aguardar mais 200ms para garantir estabilidade do estado
      const uploadTask = setTimeout(() => {
        if (bulkFiles) {
          handleMultipleFileUpload(bulkFiles);
        } else if (zipFile) {
          handleZipUpload(zipFile);
        }
      }, 200);

      // Cleanup do timeout se o componente for desmontado
      return () => clearTimeout(uploadTask);
    }
  }, [
    pendingBulkUpload,
    showBulkUpload,
    handleMultipleFileUpload,
    handleZipUpload,
  ]);

  // Funções para gerenciar visualização de álbuns
  const handleViewAlbum = (album: Album) => {
    setSelectedAlbum(album);
    loadPhotos(album.id);
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    clearPhotos();
  };

  // Funções para gerenciar formulários
  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setShowForm(true);
  };

  const handleEditPhoto = (photo: Foto) => {
    setEditingFoto(photo);
    setShowFotoForm(true);
  };

  const handleAlbumSubmit = async (
    data: CreateAlbumData,
    enableBulkUpload?: boolean,
    bulkFiles?: FileList | null,
    zipFile?: File | null,
  ) => {
    try {
      let newAlbum;
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, data);
      } else {
        newAlbum = await createAlbum(data);
      }

      setShowForm(false);
      setEditingAlbum(undefined);

      // Se habilitou upload em lote e criou um novo álbum, preparar para upload em background
      if (enableBulkUpload && newAlbum && (bulkFiles || zipFile)) {
        // Selecionar o álbum recém-criado
        setSelectedAlbum(newAlbum);
        await loadPhotos(newAlbum.id);

        // Task em background: aguardar 500ms antes de processar upload
        setTimeout(() => {
          setPendingBulkUpload({
            albumId: newAlbum.id,
            bulkFiles,
            zipFile,
          });
          setShowBulkUpload(true);
        }, 500);
      }
    } catch (err) {
      console.error("Erro ao salvar álbum:", err);
    }
  };

  const handlePhotoSubmit = async (data: CreateFotoData) => {
    try {
      if (editingFoto) {
        await updatePhoto(editingFoto.id, data);
      } else {
        await createPhoto(data);
      }
      setShowFotoForm(false);
      setEditingFoto(undefined);
      if (selectedAlbum) {
        loadPhotos(selectedAlbum.id);
      }
    } catch (err) {
      console.error("Erro ao salvar foto:", err);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este álbum?")) {
      try {
        await deleteAlbum(albumId);
      } catch (err) {
        console.error("Erro ao excluir álbum:", err);
      }
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await deletePhoto(id);
        if (selectedAlbum) {
          await loadPhotos(selectedAlbum.id);
        }
      } catch (err) {
        console.error("Erro ao excluir foto:", err);
      }
    }
  };

  const handlePhotoSelect = (photoId: string, selected: boolean) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(photoId);
      } else {
        newSet.delete(photoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === albumFotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(albumFotos.map((foto) => foto.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPhotos.size === 0) return;

    if (
      window.confirm(
        `Tem certeza que deseja excluir ${selectedPhotos.size} foto(s) selecionada(s)?`,
      )
    ) {
      try {
        // Deletar todas as fotos selecionadas
        await Promise.all(
          Array.from(selectedPhotos).map((photoId) => deletePhoto(photoId)),
        );

        // Recarregar fotos e limpar seleção
        if (selectedAlbum) {
          await loadPhotos(selectedAlbum.id);
        }
        setSelectedPhotos(new Set());
        setSelectionMode(false);
      } catch (err) {
        console.error("Erro ao excluir fotos:", err);
      }
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPhotos(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout
      title={
        selectedAlbum ? `Álbum: ${selectedAlbum.titulo}` : "Gerenciar Álbuns"
      }
      subtitle={
        selectedAlbum
          ? "Gerencie as fotos deste álbum"
          : "Administre seus álbuns de fotos"
      }
      showBackButton={!!selectedAlbum}
      onBackClick={handleBackToAlbums}
      backButtonText="Voltar"
    >
      {(error || photosError) && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || photosError}
        </div>
      )}

      {!selectedAlbum ? (
        // Lista de Álbuns
        <div className="space-y-8">
          {/* Header com botão de adicionar */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Álbuns de Fotos
                </h2>
                <p className="text-gray-600 mt-1">
                  Gerencie seus álbuns e organize suas fotos
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Álbum
              </button>
            </div>
          </div>

          {/* Grid de Álbuns */}
          {albums.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nenhum álbum encontrado
              </h3>
              <p className="mt-2 text-gray-500">
                Comece criando seu primeiro álbum de fotos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onView={handleViewAlbum}
                  onEdit={handleEditAlbum}
                  onDelete={handleDeleteAlbum}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Visualização de Fotos do Álbum
        <div className="space-y-8">
          {/* Header com botão de adicionar foto */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Fotos do Álbum
                </h2>
                <p className="text-gray-600 mt-1">
                  {albumFotos.length} foto(s) neste álbum
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {!selectionMode ? (
                  <>
                    {albumFotos.length > 0 && (
                      <button
                        onClick={toggleSelectionMode}
                        className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Selecionar
                      </button>
                    )}
                    <button
                      onClick={() => setShowBulkUpload(true)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Upload Múltiplo
                    </button>
                    <button
                      onClick={() => setShowFotoForm(true)}
                      className="flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Adicionar Foto
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center sm:text-left">
                      <span className="text-sm text-gray-600">
                        {selectedPhotos.size} de {albumFotos.length}{" "}
                        selecionada(s)
                      </span>
                    </div>
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      {selectedPhotos.size === albumFotos.length
                        ? "Desmarcar Todas"
                        : "Selecionar Todas"}
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedPhotos.size === 0}
                      className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir ({selectedPhotos.size})
                    </button>
                    <button
                      onClick={toggleSelectionMode}
                      className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Grid de Fotos */}
          {albumFotos.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nenhuma foto encontrada
              </h3>
              <p className="mt-2 text-gray-500">
                Adicione a primeira foto a este álbum.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albumFotos.map((foto) => (
                <PhotoCard
                  key={foto.id}
                  photo={foto}
                  onEdit={handleEditPhoto}
                  onDelete={handleDeletePhoto}
                  isSelected={selectedPhotos.has(foto.id)}
                  onSelect={handlePhotoSelect}
                  selectionMode={selectionMode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Formulário de Álbum */}
      {showForm && (
        <AlbumForm
          album={editingAlbum}
          onSubmit={handleAlbumSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAlbum(undefined);
          }}
        />
      )}

      {/* Modal de Formulário de Foto */}
      {showFotoForm && selectedAlbum && (
        <PhotoForm
          photo={editingFoto}
          albumId={selectedAlbum.id}
          onSubmit={handlePhotoSubmit}
          onCancel={() => {
            setShowFotoForm(false);
            setEditingFoto(undefined);
          }}
        />
      )}

      {/* Modal de Upload Múltiplo */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onMultipleFileUpload={handleMultipleFileUpload}
        onZipUpload={handleZipUpload}
        bulkUploading={bulkUploading}
        uploadProgress={uploadProgress}
      />
    </AdminLayout>
  );
}
