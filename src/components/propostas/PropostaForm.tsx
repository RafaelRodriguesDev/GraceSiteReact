import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Proposta, PropostaFormData } from '../../types/propostas';
import { PropostasService } from '../../services/propostasService';

interface PropostaFormProps {
  proposta?: Proposta | null;
  onSubmit: (formData: PropostaFormData) => void;
  onCancel: () => void;
}

const PropostaForm: React.FC<PropostaFormProps> = ({ proposta, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PropostaFormData>({
    titulo: '',
    descricao: '',
    arquivo: null,
    ativo: true,
    ordem: 0
  });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (proposta) {
      setFormData({
        titulo: proposta.titulo,
        descricao: proposta.descricao || '',
        arquivo: null,
        ativo: proposta.ativo,
        ordem: proposta.ordem
      });
    }
  }, [proposta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      alert('Título é obrigatório');
      return;
    }

    if (!proposta && !formData.arquivo) {
      alert('Arquivo PDF é obrigatório para nova proposta');
      return;
    }

    try {
      setLoading(true);
      
      if (proposta) {
        // Editando proposta existente
        let arquivo_url = proposta.arquivo_url;
        
        if (formData.arquivo) {
          arquivo_url = await PropostasService.uploadPDF(formData.arquivo);
        }
        
        await PropostasService.updateProposta(proposta.id, {
          titulo: formData.titulo,
          descricao: formData.descricao,
          arquivo_url,
          ativo: formData.ativo,
          ordem: formData.ordem
        });
      } else {
        // Criando nova proposta
        const arquivo_url = await PropostasService.uploadPDF(formData.arquivo!);
        
        await PropostasService.createProposta({
          titulo: formData.titulo,
          descricao: formData.descricao,
          arquivo_url,
          ativo: formData.ativo,
          ordem: formData.ordem
        });
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      alert('Erro ao salvar proposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        alert('Arquivo muito grande. Máximo 100MB');
        return;
      }
      setFormData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        alert('Arquivo muito grande. Máximo 100MB');
        return;
      }
      setFormData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, arquivo: null }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {proposta ? 'Editar Proposta' : 'Nova Proposta'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ex: Festa de 15 Anos"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Descrição da proposta..."
            />
          </div>

          {/* Upload de Arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo PDF {!proposta && '*'}
            </label>
            
            {formData.arquivo ? (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{formData.arquivo.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragOver 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Arraste um arquivo PDF aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Máximo 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer inline-block"
                >
                  Selecionar Arquivo
                </label>
              </div>
            )}
            
            {proposta && (
              <p className="text-sm text-gray-500 mt-2">
                Deixe em branco para manter o arquivo atual
              </p>
            )}
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ordem */}
            <div>
              <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                id="ordem"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={() => setFormData(prev => ({ ...prev, ativo: true }))}
                    className="mr-2"
                  />
                  Ativo
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ativo"
                    checked={!formData.ativo}
                    onChange={() => setFormData(prev => ({ ...prev, ativo: false }))}
                    className="mr-2"
                  />
                  Inativo
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (proposta ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropostaForm;