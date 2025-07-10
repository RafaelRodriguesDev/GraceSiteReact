export interface Proposta {
  id: string;
  titulo: string;
  descricao?: string;
  arquivo_url: string;
  thumbnail_url?: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePropostaData {
  titulo: string;
  descricao?: string;
  arquivo_url: string;
  thumbnail_url?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface UpdatePropostaData {
  titulo?: string;
  descricao?: string;
  arquivo_url?: string;
  thumbnail_url?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface PropostaFormData {
  titulo: string;
  descricao: string;
  arquivo: File | null;
  ativo: boolean;
  ordem: number;
}