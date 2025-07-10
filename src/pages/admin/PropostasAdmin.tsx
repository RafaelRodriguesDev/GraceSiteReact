import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, FileText, Download } from 'lucide-react';
import { PropostasService } from '../../services/propostasService';
import { Proposta, PropostaFormData } from '../../types/propostas';
import PropostaForm from '../../components/propostas/PropostaForm';

const PropostasAdmin: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProposta, setEditingProposta] = useState<Proposta | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
          ordem: formData.ordem
        });
      } else {
        // Criar nova proposta
        if (!formData.arquivo) {
          throw new Error('Arquivo é obrigatório para nova proposta');
        }

        const arquivo_url = await PropostasService.uploadPDF(formData.arquivo);
        
        await PropostasService.createProposta({
          titulo: formData.titulo,
          descricao: formData.descricao,
          arquivo_url,
          ativo: formData.ativo,
          ordem: formData.ordem
        });
      }

      setShowForm(false);
      setEditingProposta(null);
      await loadPropostas();
    } catch (err) {
      console.error('Erro ao salvar proposta:', err);
      alert('Erro ao salvar proposta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) {
      return;
    }

    try {
      setDeletingId(id);
      await PropostasService.deleteProposta(id);
      await loadPropostas();
    } catch (err) {
      console.error('Erro ao deletar proposta:', err);
      alert('Erro ao deletar proposta');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAtivo = async (proposta: Proposta) => {
    try {
      await PropostasService.toggleAtivo(proposta.id);
      await loadPropostas();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('Erro ao alterar status da proposta');
    }
  };

  const handleDownload = (proposta: Proposta) => {
    const link = document.createElement('a');
    link.href = proposta.arquivo_url;
    link.download = `${proposta.titulo}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Propostas</h1>
          <p className="text-gray-600">Gerencie as propostas que aparecem na página pública</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Proposta
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
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
            <div key={proposta.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Status Badge */}
              <div className="p-4 pb-0">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    proposta.ativo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {proposta.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-gray-500">Ordem: {proposta.ordem}</span>
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
                <h3 className="font-semibold text-gray-900 mb-2">{proposta.titulo}</h3>
                {proposta.descricao && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {proposta.descricao}
                  </p>
                )}
                
                <div className="text-xs text-gray-500 mb-4">
                  Criado em: {new Date(proposta.created_at).toLocaleDateString('pt-BR')}
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
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={proposta.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {proposta.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
  );
};

export default PropostasAdmin;