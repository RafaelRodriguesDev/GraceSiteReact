import { supabase } from "../lib/supabase";

export interface MosaicoImage {
  id: string;
  filename: string;
  url: string;
  created_at: string;
  ordem: number;
}

export class MosaicoService {
  // Buscar todas as imagens do mosaico
  static async getAllImages(): Promise<MosaicoImage[]> {
    try {
      const { data, error } = await supabase
        .from("mosaico_images")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) {
        // Se a tabela não existe ou há erro de conexão, retornar array vazio
        // para permitir que o componente use imagens estáticas como fallback
        console.warn(
          "Erro ao buscar imagens do mosaico (usando fallback):",
          error.message,
        );
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn(
        "Erro de conexão ao buscar imagens do mosaico (usando fallback):",
        error,
      );
      return [];
    }
  }

  // Upload de imagem para o mosaico
  static async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `mosaico/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("mosaico")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
    }

    // Retornar URL pública
    const { data } = supabase.storage.from("mosaico").getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Adicionar imagem ao banco de dados
  static async addImage(
    filename: string,
    url: string,
    ordem?: number,
  ): Promise<MosaicoImage> {
    // Se ordem não for fornecida, usar a próxima disponível
    let finalOrdem = ordem;
    if (!finalOrdem) {
      const existingImages = await this.getAllImages();
      finalOrdem = Math.max(...existingImages.map((img) => img.ordem), 0) + 1;
    }

    const { data, error } = await supabase
      .from("mosaico_images")
      .insert([
        {
          filename,
          url,
          ordem: finalOrdem,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao adicionar imagem ao banco: ${error.message}`);
    }

    return data;
  }

  // Upload completo (arquivo + banco)
  static async uploadAndAddImage(
    file: File,
    ordem?: number,
  ): Promise<MosaicoImage> {
    try {
      // Upload do arquivo
      const url = await this.uploadImage(file);

      // Adicionar ao banco
      const image = await this.addImage(file.name, url, ordem);

      return image;
    } catch (error) {
      throw new Error(
        `Erro no upload completo: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  }

  // Deletar imagem
  static async deleteImage(id: string): Promise<void> {
    // Primeiro buscar a imagem para obter a URL
    const { data: image, error: fetchError } = await supabase
      .from("mosaico_images")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !image) {
      throw new Error("Imagem não encontrada");
    }

    // Extrair o caminho do arquivo da URL
    try {
      const url = new URL(image.url);
      const filePath = url.pathname.split("/").slice(-2).join("/"); // pega 'mosaico/filename.jpg'

      // Deletar o arquivo do storage
      await this.deleteFile(filePath);
    } catch (fileError) {
      console.warn(
        "Erro ao deletar arquivo, prosseguindo com deleção do banco:",
        fileError,
      );
    }

    // Deletar do banco
    const { error } = await supabase
      .from("mosaico_images")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
  }

  // Deletar arquivo do storage
  static async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from("mosaico").remove([filePath]);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  // Reordenar imagens
  static async reorderImages(
    images: { id: string; ordem: number }[],
  ): Promise<void> {
    const updates = images.map(({ id, ordem }) =>
      supabase.from("mosaico_images").update({ ordem }).eq("id", id),
    );

    const results = await Promise.all(updates);

    for (const result of results) {
      if (result.error) {
        throw new Error(`Erro ao reordenar imagens: ${result.error.message}`);
      }
    }
  }

  // Obter imagens estáticas como objetos MosaicoImage (fallback)
  static getStaticImages(): MosaicoImage[] {
    const staticImagePaths = [
      "/images/image1.jpg",
      "/images/image2.jpg",
      "/images/image3.jpg",
      "/images/image4.jpg",
      "/images/image5.jpg",
      "/images/image6.jpg",
      "/images/image7.jpg",
      "/images/image8.jpg",
      "/images/image9.jpg",
      "/images/image10.jpg",
    ];

    return staticImagePaths.map((path, index) => ({
      id: `static-${index + 1}`,
      filename: `image${index + 1}.jpg`,
      url: path,
      created_at: new Date().toISOString(),
      ordem: index + 1,
    }));
  }

  // Obter todas as imagens (com fallback para estáticas)
  static async getAllImagesWithFallback(): Promise<MosaicoImage[]> {
    try {
      const dbImages = await this.getAllImages();

      // Se não há imagens no banco, usar imagens estáticas
      if (dbImages.length === 0) {
        return this.getStaticImages();
      }

      return dbImages;
    } catch (error) {
      console.warn("Erro ao buscar imagens, usando estáticas:", error);
      return this.getStaticImages();
    }
  }

  // Migrar imagens estáticas existentes para o banco (útil para migração)
  static async migrateStaticImages(): Promise<void> {
    const staticImages = this.getStaticImages();

    for (const image of staticImages) {
      try {
        await this.addImage(image.filename, image.url, image.ordem);
      } catch (error) {
        console.warn(`Erro ao migrar ${image.url}:`, error);
      }
    }
  }
}
