import React, { useState, useEffect } from 'react';
import { PropostasService } from '../services/propostasService';
import { Proposta, PropostaFormData } from '../types/propostas';
import PropostaForm from '../components/propostas/PropostaForm';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  ArrowUp,
  ArrowDown,
  FileText,
  Loader
} from 'lucide-react';

const PropostasAdmin: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProposta, setEditingProposta] = useState<Proposta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      const data = await PropostasService.getAllPropostas();
      setPropostas(data);
    } catch (err) {
      setError('Erro ao carregar propostas');
      console.error('Erro ao carregar propostas:', err);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) {
      return;
    }

    try {
      await PropostasService.deleteProposta(id);
      await loadPropostas();
    } catch (err) {
      setError('Erro ao excluir proposta');
      console.error('Erro ao excluir proposta:', err);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await PropostasService.toggleAtivo(id);
      await loadPropostas();
    } catch (err) {
      setError('Erro ao alterar status da proposta');
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleMoveUp = async (proposta: Proposta) => {
    const currentIndex = propostas.findIndex(p => p.id === proposta.id);
    if (currentIndex > 0) {
      const newOrder = propostas[currentIndex - 1].ordem;
      try {
        await PropostasService.updateProposta(proposta.id, { ordem: newOrder });
        await loadPropostas();
      } catch (err) {
        setError('Erro ao reordenar proposta');
        console.error('Erro ao reordenar:', err);
      }
    }
  };

  const handleMoveDown = async (proposta: Proposta) => {
    const currentIndex = propostas.findIndex(p => p.id === proposta.id);
    if (currentIndex < propostas.length - 1) {
      const newOrder = propostas[currentIndex + 1].ordem;
      try {
        await PropostasService.updateProposta(proposta.id, { ordem: newOrder });
        await loadPropostas();
      } catch (err) {
        setError('Erro ao reordenar proposta');
        console.error('Erro ao reordenar:', err);
      }
    }
  };

  const handleFormSubmit = async (formData: PropostaFormData) => {
    setShowForm(false);
    setEditingProposta(null);
    await loadPropostas();
  };

  const handleDownload = async (proposta: Proposta) => {
    if (proposta.arquivo_url) {
      window.open(proposta.arquivo_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-pink-600" />
          <span className="text-gray-600">Carregando propostas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Container principal com padding lateral */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-white/90 shadow-lg border-b rounded-2xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gerenciar Propostas</h1>
            <p className="text-base text-gray-600 mt-1">Administre as propostas exibidas no site</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center px-5 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors font-semibold text-base gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Proposta
          </button>
        </div>

        {/* Container do conteúdo */}
        <div className="space-y-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de Propostas */}
        {propostas.length === 0 ? (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira proposta.</p>
              <div className="mt-6">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Proposta
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {propostas.map((proposta, index) => (
              <div key={proposta.id} className="bg-white/95 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between min-h-[170px]">
                <div className="p-5 flex flex-col gap-2">
                  {/* Header com título e status */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                      {proposta.titulo}
                    </h3>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm ${
                      proposta.ativo 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {proposta.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Info adicional */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="font-mono">#{proposta.ordem}</span>
                    {proposta.arquivo_url && (
                      <FileText className="h-4 w-4 text-pink-400" />
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                    {/* Reordenação */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(proposta)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                        title="↑"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(proposta)}
                        disabled={index === propostas.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                        title="↓"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Ações principais */}
                    <div className="flex items-center gap-1">
                      {/* Download */}
                      {proposta.arquivo_url && (
                        <button
                          onClick={() => handleDownload(proposta)}
                          className="p-1 text-pink-600 hover:text-pink-700 rounded"
                          title="PDF"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                      
                      {/* Toggle ativo/inativo */}
                      <button
                        onClick={() => handleToggleActive(proposta.id, proposta.ativo)}
                        className={`p-1 rounded ${
                          proposta.ativo 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={proposta.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {proposta.ativo ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                      </button>
                      
                      {/* Editar */}
                      <button
                        onClick={() => handleEdit(proposta)}
                        className="p-0.5 text-indigo-600 hover:text-indigo-700 rounded"
                        title="Editar"
                      >
                        <Edit className="h-2.5 w-2.5" />
                      </button>
                      
                      {/* Excluir */}
                      <button
                        onClick={() => handleDelete(proposta.id)}
                        className="p-0.5 text-red-600 hover:text-red-700 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <PropostaForm
              proposta={editingProposta}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProposta(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropostasAdmin;