import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";
import { PropostasService } from "../../services/propostasService";
import { Proposta, PropostaFormData } from "../../types/propostas";
import PropostaForm from "../../components/propostas/PropostaForm";
import { useAuth } from "../../contexts/AuthContext";

const PropostasAdmin: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProposta, setEditingProposta] = useState<Proposta | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      const data = await PropostasService.getAllPropostas();
      setPropostas(data);
    } catch (err) {
      setError("Erro ao carregar propostas");
      console.error("Erro ao carregar propostas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProposta(null);
    setShowForm(true);
  };

  const handleEdit = (proposta: Proposta) => {
    setEditingProposta(proposta);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: PropostaFormData) => {
    try {
      if (editingProposta) {
        // Atualizar proposta existente
        let arquivo_url = editingProposta.arquivo_url;

        if (formData.arquivo) {
          arquivo_url = await PropostasService.uploadPDF(formData.arquivo);
        }

        await PropostasService.updateProposta(editingProposta.id, {
          titulo: formData.titulo,
          descricao: formData.descricao,
          arquivo_url,
          ativo: formData.ativo,
          ordem: formData.ordem,
        });
      } else {
        // Criar nova proposta
        if (!formData.arquivo) {
          throw new Error("Arquivo é obrigatório para nova proposta");
        }

        const arquivo_url = await PropostasService.uploadPDF(formData.arquivo);

        await PropostasService.createProposta({
          titulo: formData.titulo,
          descricao: formData.descricao,
          arquivo_url,
          ativo: formData.ativo,
          ordem: formData.ordem,
        });
      }

      setShowForm(false);
      setEditingProposta(null);
      await loadPropostas();
    } catch (err) {
      console.error("Erro ao salvar proposta:", err);
      alert("Erro ao salvar proposta");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta proposta?")) {
      return;
    }

    try {
      setDeletingId(id);
      await PropostasService.deleteProposta(id);
      await loadPropostas();
    } catch (err) {
      console.error("Erro ao deletar proposta:", err);
      alert("Erro ao deletar proposta");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAtivo = async (proposta: Proposta) => {
    try {
      await PropostasService.toggleAtivo(proposta.id);
      await loadPropostas();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar status da proposta");
    }
  };

  const handleDownload = (proposta: Proposta) => {
    const link = document.createElement("a");
    link.href = proposta.arquivo_url;
    link.download = `${proposta.titulo}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === propostas.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(propostas.map((p) => p.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;

    const confirmMessage = `Tem certeza que deseja excluir ${selectedItems.size} proposta(s) selecionada(s)?`;
    if (!confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);

      const selectedArray = Array.from(selectedItems);
      const result =
        await PropostasService.deleteMultiplePropostas(selectedArray);

      setSelectedItems(new Set());
      await loadPropostas();

      if (result.errors.length === 0) {
        alert(`${result.success} proposta(s) excluída(s) com sucesso!`);
      } else {
        alert(
          `${result.success} proposta(s) excluída(s) com sucesso. ${result.errors.length} proposta(s) falharam na exclusão.`,
        );
      }
    } catch (err) {
      console.error("Erro ao deletar propostas:", err);
      alert("Erro ao deletar algumas propostas. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gerenciar Propostas
              </h1>
              <p className="text-gray-600">
                Gerencie as propostas que aparecem na página p��blica
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedItems.size} selecionada(s)
                  </span>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Excluindo..." : "Excluir Selecionadas"}
                  </button>
                </div>
              )}

              <button
                onClick={handleCreate}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Proposta
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Controles de Seleção */}
          {propostas.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === propostas.length &&
                      propostas.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Selecionar todas ({propostas.length} propostas)
                  </span>
                </label>

                {selectedItems.size > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedItems.size} de {propostas.length} selecionadas
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Propostas Grid */}
          {propostas.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma proposta cadastrada</p>
              <button
                onClick={handleCreate}
                className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Criar primeira proposta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propostas.map((proposta) => (
                <div
                  key={proposta.id}
                  className={`bg-white rounded-lg shadow-md border-2 overflow-hidden transition-all duration-200 ${
                    selectedItems.has(proposta.id)
                      ? "border-gray-900 ring-2 ring-gray-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Checkbox e Status */}
                  <div className="p-4 pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(proposta.id)}
                          onChange={() => handleSelectItem(proposta.id)}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            proposta.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {proposta.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </label>
                      <span className="text-xs text-gray-500">
                        Ordem: {proposta.ordem}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-4 rounded-lg">
                    {proposta.thumbnail_url ? (
                      <img
                        src={proposta.thumbnail_url}
                        alt={proposta.titulo}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {proposta.titulo}
                    </h3>
                    {proposta.descricao && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {proposta.descricao}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                      Criado em:{" "}
                      {new Date(proposta.created_at).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(proposta)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>

                      <button
                        onClick={() => handleToggleAtivo(proposta)}
                        className={`p-2 rounded transition-colors duration-200 ${
                          proposta.ativo
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={proposta.ativo ? "Desativar" : "Ativar"}
                      >
                        {proposta.ativo ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(proposta)}
                        className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(proposta.id)}
                        disabled={deletingId === proposta.id}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <PropostaForm
              proposta={editingProposta}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProposta(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropostasAdmin;
