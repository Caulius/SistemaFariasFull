import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { Transport } from '../types';

interface ImportBoxProps {
  onImportData: (transports: Transport[]) => void;
}

const ImportBox: React.FC<ImportBoxProps> = ({ onImportData }) => {
  const [pasteData, setPasteData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [previewData, setPreviewData] = useState<Transport[]>([]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData.getData('text');
    setPasteData(clipboardData);
    previewImportData(clipboardData);
  };

  const previewImportData = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      const transports: Transport[] = [];
      
      lines.forEach((line, index) => {
        const columns = line.split('\t');
        
        if (columns.length >= 4) {
          const transport: Transport = {
            id: `import-${Date.now()}-${index}`,
            transportSap: columns[0]?.trim() || '',
            route: columns[1]?.trim() || '',
            weight: parseFloat(columns[2]?.trim()) || 0,
            boxes: parseInt(columns[3]?.trim()) || 0
          };
          
          transports.push(transport);
        }
      });
      
      if (transports.length > 0) {
        setPreviewData(transports);
        setImportedCount(transports.length);
        setImportStatus('ready');
      } else {
        setImportStatus('error');
      }
    } catch (error) {
      setImportStatus('error');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPasteData(value);
    
    if (value.trim()) {
      previewImportData(value);
    } else {
      setImportStatus('idle');
      setPreviewData([]);
    }
  };

  const confirmImport = () => {
    setImportStatus('processing');
    
    setTimeout(() => {
      onImportData(previewData);
      setImportStatus('success');
      
      setTimeout(() => {
        setImportStatus('idle');
        setPasteData('');
        setPreviewData([]);
      }, 3000);
    }, 500);
  };

  const getStatusIcon = () => {
    switch (importStatus) {
      case 'processing':
        return <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'ready':
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Upload className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (importStatus) {
      case 'processing':
        return 'Processando dados...';
      case 'success':
        return `${importedCount} transportes importados com sucesso!`;
      case 'error':
        return 'Erro ao processar dados. Verifique o formato.';
      case 'ready':
        return `${importedCount} transportes prontos para importação`;
      default:
        return 'Cole os dados do Excel aqui (separados por tabulação)';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold">Importação de Dados</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusMessage()}</span>
              </div>
              
              {importStatus === 'ready' && (
                <button
                  onClick={confirmImport}
                  className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>Importar Dados</span>
                </button>
              )}
            </div>
            
            <textarea
              value={pasteData}
              onChange={handleTextareaChange}
              onPaste={handlePaste}
              placeholder="Cole os dados aqui... (Transporte SAP [TAB] Rota [TAB] Peso [TAB] Caixas)"
              className="w-full h-32 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
          
          {previewData.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-3">Preview dos dados:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-2">Transporte SAP</th>
                      <th className="text-left p-2">Rota</th>
                      <th className="text-left p-2">Peso</th>
                      <th className="text-left p-2">Caixas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((transport, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="p-2">{transport.transportSap}</td>
                        <td className="p-2">{transport.route}</td>
                        <td className="p-2">{transport.weight}</td>
                        <td className="p-2">{transport.boxes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 5 && (
                  <div className="text-center text-gray-400 text-sm mt-2">
                    +{previewData.length - 5} registros adicionais
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-blue-300 mb-2">Formato esperado:</h3>
            <div className="text-sm text-blue-200 font-mono">
              <div>Transporte SAP &nbsp;&nbsp;&nbsp; Rota &nbsp;&nbsp;&nbsp; Peso &nbsp;&nbsp;&nbsp; Caixas</div>
              <div className="mt-1 text-gray-400">Exemplo: 12345 [TAB] RJ-SP [TAB] 1500 [TAB] 50</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium">Até 40 veículos/dia</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Importação controlada</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Sync com Status Diário</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportBox;