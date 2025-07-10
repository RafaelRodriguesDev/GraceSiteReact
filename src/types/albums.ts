export interface Album {
  id: string;
  titulo: string;
  descricao?: string;
  capa_url: string; // URL da foto de capa do álbum
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface Foto {
  id: string;
  album_id: string;
  titulo?: string;
  descricao?: string;
  url: string;
  thumbnail_url?: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAlbumData {
  titulo: string;
  descricao?: string;
  capa_url: string;
  ativo?: boolean;
  ordem?: number;
}

export interface UpdateAlbumData {
  titulo?: string;
  descricao?: string;
  capa_url?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface CreateFotoData {
  album_id: string;
  titulo?: string;
  descricao?: string;
  url: string;
  thumbnail_url?: string;
  ordem?: number;
}

export interface UpdateFotoData {
  titulo?: string;
  descricao?: string;
  url?: string;
  thumbnail_url?: string;
  ordem?: number;
}

export interface AlbumWithFotos extends Album {
  fotos: Foto[];
}