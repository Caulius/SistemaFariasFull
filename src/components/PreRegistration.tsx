import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { PreRegistrationData } from '../types';

interface PreRegistrationProps {
  data: PreRegistrationData;
  onUpdate: (data: PreRegistrationData) => void;
}

const PreRegistration: React.FC<PreRegistrationProps> = ({ data, onUpdate }) => {
  const [activeCategory, setActiveCategory] = useState<keyof PreRegistrationData>('operations');
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const categories = [
    { key: 'operations', label: 'Operações', icon: '🏭' },
    { key: 'numbers', label: 'Números', icon: '🔢' },
    { key: 'industries', label: 'Indústrias', icon: '🏢' },
    { key: 'origins', label: 'Origens', icon: '📍' },
    { key: 'destinations', label: 'Destinos', icon: '🎯' },
    { key: 'plates', label: 'Placas', icon: '🚚' },
    { key: 'drivers', label: 'Motoristas', icon: '👤' }
  ];

  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedData = {
        ...data,
        [activeCategory]: [...data[activeCategory], newItem.trim()]
      };
      onUpdate(updatedData);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedData = {
      ...data,
      [activeCategory]: data[activeCategory].filter((_, i) => i !== index)
    };
    onUpdate(updatedData);
  };

  const handleStartEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const updatedItems = [...data[activeCategory]];
      updatedItems[editingIndex] = editingValue.trim();
      const updatedData = {
        ...data,
        [activeCategory]: updatedItems
      };
      onUpdate(updatedData);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cadastro Prévio</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-3">Categorias</h3>
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as keyof PreRegistrationData)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeCategory === category.key
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                  <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded">
                    {data[category.key as keyof PreRegistrationData].length}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder={`Adicionar novo item em ${categories.find(c => c.key === activeCategory)?.label}`}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleAddItem}
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar</span>
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data[activeCategory].map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  {editingIndex === index ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-500 hover:text-green-400 p-1"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-500 hover:text-red-400 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{item}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartEdit(index, item)}
                          className="text-orange-500 hover:text-orange-400 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {data[activeCategory].length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhum item cadastrado nesta categoria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistration;