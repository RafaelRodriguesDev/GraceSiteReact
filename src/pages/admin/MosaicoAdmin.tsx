import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Trash2,
  Eye,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { MosaicoService, MosaicoImage } from "../../services/mosaicoService";

const MosaicoAdmin: React.FC = () => {
  const [images, setImages] = useState<MosaicoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await MosaicoService.getAllImagesWithFallback();
      setImages(data);

      // Se estamos usando imagens estáticas, mostrar informação para o usuário
      if (data.length > 0 && data[0].id.startsWith("static-")) {
        showMessage(
          "success",
          "Carregando imagens estáticas da pasta /images/. Para usar o sistema completo, configure o banco de dados.",
        );
      }
    } catch (err) {
      showMessage("error", "Erro ao carregar imagens do mosaico");
      console.error("Erro ao carregar imagens:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        showMessage("error", `${file.name} não é um arquivo de imagem válido`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        showMessage("error", `${file.name} é muito grande (máx. 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      uploadImages(validFiles);
    }
  };

  const uploadImages = async (files: File[]) => {
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        await MosaicoService.uploadAndAddImage(file);
        successCount++;
      } catch (error) {
        console.error(`Erro ao fazer upload de ${file.name}:`, error);
        errorCount++;
      }
    }

    setUploading(false);

    if (successCount > 0) {
      showMessage(
        "success",
        `${successCount} imagem(ns) adicionada(s) com sucesso!`,
      );
      await loadImages();
    }

    if (errorCount > 0) {
      showMessage("error", `Erro ao adicionar ${errorCount} imagem(ns)`);
    }
  };

  const handleDelete = async (id: string) => {
    // Verificar se é uma imagem estática
    if (id.startsWith("static-")) {
      showMessage(
        "error",
        "Não é possível excluir imagens estáticas. Para gerenciar imagens, configure o banco de dados.",
      );
      return;
    }

    if (!confirm("Tem certeza que deseja excluir esta imagem?")) {
      return;
    }

    try {
      setDeletingId(id);
      await MosaicoService.deleteImage(id);
      showMessage("success", "Imagem excluída com sucesso!");
      await loadImages();
      setSelectedImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
      showMessage("error", "Erro ao excluir imagem");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;

    const selectedArray = Array.from(selectedImages);
    const staticImages = selectedArray.filter((id) => id.startsWith("static-"));
    const dbImages = selectedArray.filter((id) => !id.startsWith("static-"));

    if (staticImages.length > 0) {
      showMessage(
        "error",
        `${staticImages.length} imagem(ns) estática(s) não pode(m) ser excluída(s). Configure o banco de dados para gerenciar imagens.`,
      );

      // Remove as imagens estáticas da seleção
      setSelectedImages(new Set(dbImages));

      if (dbImages.length === 0) return;
    }

    const confirmMessage = `Tem certeza que deseja excluir ${dbImages.length} imagem(ns) selecionada(s)?`;
    if (!confirm(confirmMessage)) return;

    let successCount = 0;
    let errorCount = 0;

    for (const id of dbImages) {
      try {
        await MosaicoService.deleteImage(id);
        successCount++;
      } catch (error) {
        console.error(`Erro ao deletar imagem ${id}:`, error);
        errorCount++;
      }
    }

    setSelectedImages(new Set());
    await loadImages();

    if (successCount > 0) {
      showMessage(
        "success",
        `${successCount} imagem(ns) excluída(s) com sucesso!`,
      );
    }
    if (errorCount > 0) {
      showMessage("error", `Erro ao excluir ${errorCount} imagem(ns)`);
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.id)));
    }
  };

  const handleSelectImage = (id: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const moveImage = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[currentIndex],
    ];

    // Atualizar ordem no banco
    try {
      const updates = newImages.map((img, index) => ({
        id: img.id,
        ordem: index + 1,
      }));

      await MosaicoService.reorderImages(updates);
      setImages(newImages);
      showMessage("success", "Ordem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao reordenar:", error);
      showMessage("error", "Erro ao atualizar ordem");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        {/* Message Banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gerenciar Mosaico
              </h1>
              <p className="text-gray-600">
                Adicione, remova e organize as imagens do mosaico de fundo
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {selectedImages.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedImages.size} selecionada(s)
                  </span>
                  <button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir Selecionadas
                  </button>
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Enviando..." : "Adicionar Imagens"}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-gray-400 bg-gray-100"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />

          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Arraste imagens aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-600">
            Suporta múltiplas imagens. Máximo 10MB por imagem.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Selecionar Arquivos
          </button>
        </div>

        {/* Selection Controls */}
        {images.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedImages.size === images.length && images.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Selecionar todas ({images.length} imagens)
                </span>
              </label>

              {selectedImages.size > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedImages.size} de {images.length} selecionadas
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Nenhuma imagem no mosaico</p>
            <p className="text-gray-500 text-sm mt-2">
              Adicione algumas imagens para começar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden transition-all duration-200 ${
                  selectedImages.has(image.id)
                    ? "border-gray-900 ring-2 ring-gray-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Checkbox */}
                <div className="p-3 pb-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => handleSelectImage(image.id)}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </label>
                </div>

                {/* Image */}
                <div className="h-32 bg-gray-100 relative">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setPreviewImage(image.url)}
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>

                {/* Info and Actions */}
                <div className="p-3">
                  <p
                    className="text-xs text-gray-600 truncate mb-2"
                    title={image.filename}
                  >
                    {image.filename}
                  </p>

                  <div className="flex items-center justify-between gap-1">
                    {/* Reorder buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveImage(image.id, "up")}
                        disabled={index === 0}
                        className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveImage(image.id, "down")}
                        disabled={index === images.length - 1}
                        className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreviewImage(image.url)}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingId === image.id}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                        title="Excluir"
                      >
                        {deletingId === image.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MosaicoAdmin;
