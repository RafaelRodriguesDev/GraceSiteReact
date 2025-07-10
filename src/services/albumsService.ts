import { supabase } from '../lib/supabase';
import { Album, Foto, CreateAlbumData, UpdateAlbumData, CreateFotoData, UpdateFotoData, AlbumWithFotos } from '../types/albums';

export class AlbumsService {
  // ===== ÁLBUNS =====
  
  // Buscar todos os álbuns (para admin)
  static async getAllAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar álbuns: ${error.message}`);
    }

    return data || [];
  }

  // Buscar apenas álbuns ativos (para página pública)
  static async getAlbumsAtivos(): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar álbuns ativos: ${error.message}`);
    }

    return data || [];
  }

  // Buscar álbum por ID
  static async getAlbumById(id: string): Promise<Album | null> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      throw new Error(`Erro ao buscar álbum: ${error.message}`);
    }

    return data;
  }

  // Buscar álbum com fotos
  static async getAlbumWithFotos(id: string): Promise<AlbumWithFotos | null> {
    const { data, error } = await supabase
      .from('albums')
      .select(`
        *,
        fotos:fotos(
          id,
          titulo,
          descricao,
          url,
          thumbnail_url,
          ordem,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar álbum com fotos: ${error.message}`);
    }

    // Ordenar fotos por ordem
    if (data.fotos) {
      data.fotos.sort((a: Foto, b: Foto) => a.ordem - b.ordem);
    }

    return data as AlbumWithFotos;
  }

  // Criar álbum
  static async createAlbum(albumData: CreateAlbumData): Promise<Album> {
    // Se não foi especificada uma ordem, usar a próxima disponível
    if (!albumData.ordem) {
      const { data: maxOrdem } = await supabase
        .from('albums')
        .select('ordem')
        .order('ordem', { ascending: false })
        .limit(1)
        .single();
      
      albumData.ordem = (maxOrdem?.ordem || 0) + 1;
    }

    const { data, error } = await supabase
      .from('albums')
      .insert([{
        ...albumData,
        ativo: albumData.ativo ?? true
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar álbum: ${error.message}`);
    }

    return data;
  }

  // Atualizar álbum
  static async updateAlbum(id: string, albumData: UpdateAlbumData): Promise<Album> {
    const { data, error } = await supabase
      .from('albums')
      .update({
        ...albumData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar álbum: ${error.message}`);
    }

    return data;
  }

  // Deletar álbum
  static async deleteAlbum(id: string): Promise<void> {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar álbum: ${error.message}`);
    }
  }

  // Alterar ordem do álbum
  static async updateAlbumOrdem(id: string, novaOrdem: number): Promise<void> {
    const { error } = await supabase
      .from('albums')
      .update({ ordem: novaOrdem })
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao atualizar ordem do álbum: ${error.message}`);
    }
  }

  // ===== FOTOS =====

  // Buscar fotos de um álbum
  static async getFotosByAlbum(albumId: string): Promise<Foto[]> {
    const { data, error } = await supabase
      .from('fotos')
      .select('*')
      .eq('album_id', albumId)
      .order('ordem', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar fotos: ${error.message}`);
    }

    return data || [];
  }

  // Criar foto
  static async createFoto(fotoData: CreateFotoData): Promise<Foto> {
    // Se não foi especificada uma ordem, usar a próxima disponível no álbum
    if (!fotoData.ordem) {
      const { data: maxOrdem } = await supabase
        .from('fotos')
        .select('ordem')
        .eq('album_id', fotoData.album_id)
        .order('ordem', { ascending: false })
        .limit(1)
        .single();
      
      fotoData.ordem = (maxOrdem?.ordem || 0) + 1;
    }

    const { data, error } = await supabase
      .from('fotos')
      .insert([fotoData])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar foto: ${error.message}`);
    }

    return data;
  }

  // Atualizar foto
  static async updateFoto(id: string, fotoData: UpdateFotoData): Promise<Foto> {
    const { data, error } = await supabase
      .from('fotos')
      .update({
        ...fotoData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar foto: ${error.message}`);
    }

    return data;
  }

  // Deletar foto
  static async deleteFoto(id: string): Promise<void> {
    const { error } = await supabase
      .from('fotos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar foto: ${error.message}`);
    }
  }

  // Upload de arquivo para o Supabase Storage
  static async uploadFile(file: File, bucket: string = 'albums'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

// Exportar instância para uso direto
export const albumsService = AlbumsService;