import { supabase } from "../lib/supabase";
import {
  Proposta,
  CreatePropostaData,
  UpdatePropostaData,
} from "../types/propostas";

export class PropostasService {
  // Buscar todas as propostas (para admin)
  static async getAllPropostas(): Promise<Proposta[]> {
    const { data, error } = await supabase
      .from("propostas")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar propostas: ${error.message}`);
    }

    return data || [];
  }

  // Buscar apenas propostas ativas (para página pública)
  static async getPropostasAtivas(): Promise<Proposta[]> {
    const { data, error } = await supabase
      .from("propostas")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar propostas ativas: ${error.message}`);
    }

    return data || [];
  }

  // Buscar proposta por ID
  static async getPropostaById(id: string): Promise<Proposta | null> {
    const { data, error } = await supabase
      .from("propostas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Não encontrado
      }
      throw new Error(`Erro ao buscar proposta: ${error.message}`);
    }

    return data;
  }

  // Fazer upload do arquivo PDF
  static async uploadArquivo(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("propostas")
      .upload(fileName, file);

    if (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("propostas").getPublicUrl(fileName);

    return publicUrl;
  }

  // Criar nova proposta
  static async createProposta(data: {
    titulo: string;
    descricao?: string;
    arquivo_url: string;
    ativo?: boolean;
    ordem?: number;
  }): Promise<Proposta> {
    const propostaData: CreatePropostaData = {
      titulo: data.titulo,
      descricao: data.descricao,
      arquivo_url: data.arquivo_url,
      ativo: data.ativo ?? true,
      ordem: data.ordem ?? 0,
    };

    const { data: proposta, error } = await supabase
      .from("propostas")
      .insert([propostaData])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar proposta: ${error.message}`);
    }

    return proposta;
  }

  // Atualizar proposta
  static async updateProposta(
    id: string,
    data: {
      titulo?: string;
      descricao?: string;
      arquivo_url?: string;
      ativo?: boolean;
      ordem?: number;
    },
  ): Promise<Proposta> {
    let updateData: UpdatePropostaData = {
      titulo: data.titulo,
      descricao: data.descricao,
      arquivo_url: data.arquivo_url,
      ativo: data.ativo,
      ordem: data.ordem,
    };

    const { data: proposta, error } = await supabase
      .from("propostas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar proposta: ${error.message}`);
    }

    return proposta;
  }

  // Deletar proposta
  static async deleteProposta(id: string): Promise<void> {
    // Primeiro buscar a proposta para obter o arquivo_url
    const proposta = await this.getPropostaById(id);

    if (proposta) {
      // Extrair o caminho do arquivo da URL
      try {
        const url = new URL(proposta.arquivo_url);
        const filePath = url.pathname.split("/").slice(-2).join("/"); // pega 'propostas/filename.pdf'

        // Deletar o arquivo do storage
        await this.deleteFile(filePath);
      } catch (fileError) {
        console.warn(
          "Erro ao deletar arquivo, prosseguindo com deleção da proposta:",
          fileError,
        );
      }
    }

    // Deletar a proposta do banco
    const { error } = await supabase.from("propostas").delete().eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar proposta: ${error.message}`);
    }
  }

  // Alternar status ativo/inativo
  static async toggleAtivo(id: string): Promise<Proposta> {
    // Primeiro buscar o status atual
    const proposta = await this.getPropostaById(id);
    if (!proposta) {
      throw new Error("Proposta não encontrada");
    }

    // Alternar o status
    return this.updateProposta(id, { ativo: !proposta.ativo });
  }

  // Upload de arquivo PDF
  static async uploadPDF(file: File, fileName?: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const finalFileName = fileName || `${Date.now()}.${fileExt}`;
    const filePath = `propostas/${finalFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("propostas")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(
        `Erro ao fazer upload do arquivo: ${uploadError.message}`,
      );
    }

    // Retornar URL pública
    const { data } = supabase.storage.from("propostas").getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Gerar thumbnail do PDF (placeholder - implementação futura)
  static async generateThumbnail(pdfUrl: string): Promise<string> {
    // Por enquanto, retorna uma URL placeholder
    // Futuramente pode ser implementado com PDF.js ou serviço externo
    return "/images/pdf-placeholder.png";
  }

  // Deletar arquivo do storage
  static async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from("propostas-pdfs")
      .remove([filePath]);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  // Reordenar propostas
  static async reorderPropostas(
    propostas: { id: string; ordem: number }[],
  ): Promise<void> {
    const updates = propostas.map(({ id, ordem }) =>
      this.updateProposta(id, { ordem }),
    );

    await Promise.all(updates);
  }
}
