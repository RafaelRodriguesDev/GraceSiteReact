import { useState, useCallback } from 'react';
import { albumsService } from '../services/albumsService';
import { CreateFotoData } from '../types/albums';

interface UseBulkUploadProps {
  albumId: string;
  onPhotoCreated: (photoData: CreateFotoData) => Promise<void>;
  onUploadComplete: () => void;
  currentPhotosCount: number;
}

export function useBulkUpload({
  albumId,
  onPhotoCreated,
  onUploadComplete,
  currentPhotosCount
}: UseBulkUploadProps) {
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});

  const handleMultipleFileUpload = useCallback(async (files: FileList) => {
    if (!albumId) {
      console.error('Nenhum álbum selecionado');
      return;
    }
    
    setBulkUploading(true);
    setUploadProgress({current: 0, total: files.length});
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({current: i + 1, total: files.length});
        
        const url = await albumsService.uploadFile(file, 'albums');
        
        const fotoData: CreateFotoData = {
          album_id: albumId,
          titulo: file.name.split('.')[0],
          descricao: '',
          url,
          thumbnail_url: url,
          ordem: currentPhotosCount + i + 1
        };
        
        await onPhotoCreated(fotoData);
      }
      
      onUploadComplete();
    } catch (err) {
      console.error('Erro ao fazer upload múltiplo:', err);
    } finally {
      setBulkUploading(false);
      setUploadProgress({current: 0, total: 0});
    }
  }, [albumId, currentPhotosCount, onPhotoCreated, onUploadComplete]);

  const handleZipUpload = useCallback(async (file: File) => {
    if (!albumId) return;
    
    setBulkUploading(true);
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const zipContent = await zip.loadAsync(file);
      const imageFiles: {name: string, blob: Blob}[] = [];
      
      for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
        if (!zipEntry.dir && /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
          const blob = await zipEntry.async('blob');
          imageFiles.push({name: filename, blob});
        }
      }
      
      setUploadProgress({current: 0, total: imageFiles.length});
      
      for (let i = 0; i < imageFiles.length; i++) {
        const {name, blob} = imageFiles[i];
        setUploadProgress({current: i + 1, total: imageFiles.length});
        
        const imageFile = new File([blob], name, {type: blob.type});
        const url = await albumsService.uploadFile(imageFile, 'albums');
        
        const fotoData: CreateFotoData = {
          album_id: albumId,
          titulo: name.split('.')[0],
          descricao: '',
          url,
          thumbnail_url: url,
          ordem: currentPhotosCount + i + 1
        };
        
        await onPhotoCreated(fotoData);
      }
      
      onUploadComplete();
    } catch (err) {
      console.error('Erro ao processar arquivo ZIP:', err);
    } finally {
      setBulkUploading(false);
      setUploadProgress({current: 0, total: 0});
    }
  }, [albumId, currentPhotosCount, onPhotoCreated, onUploadComplete]);

  return {
    bulkUploading,
    uploadProgress,
    handleMultipleFileUpload,
    handleZipUpload
  };
}