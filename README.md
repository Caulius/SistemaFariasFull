# Sistema de Gestão de Rotas de Transporte

## Visão Geral

Sistema completo para gestão logística de rotas de transporte com controle diário, importação de dados, exportação para WhatsApp e gestão documental.

## Funcionalidades Principais

### 📥 Importação de Dados
- Box de colagem para dados tabulados do Excel
- Reconhecimento automático de formato (TAB-separated)
- Preenchimento automático de: Transporte SAP, Rota, Peso, Caixas
- Sincronização automática com Status Diário

### 📋 Status Diário
- Tabela completa com todos os campos logísticos
- Edição inline com salvamento automático
- Autocomplete para campos pré-cadastrados
- Checkboxes para controle documental
- Cálculo automático de quantidade total de pallets
- Filtros por data e busca por texto
- Status: PENDENTE/FINALIZADO

### 🚛 Programação Diária
- Montagem de até 40 veículos por dia
- Cadastro de motoristas e destinos
- Organização por horários
- Exportação formatada para WhatsApp

### ⚙️ Cadastros Prévios
- Sistema de autocompletar para campos recorrentes
- Categorias: Operações, Números, Indústrias, Origens, Destinos
- Interface de edição inline
- Persistência local dos dados

### 📤 Exportações
- **WhatsApp**: Mensagem formatada com limite de 2.000 caracteres
- **Excel**: Relatório completo em CSV com todos os campos
- Cópia automática para área de transferência

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Persistência**: LocalStorage
- **Build**: Vite

## Estrutura do Projeto

```
src/
├── components/
│   ├── ImportBox.tsx          # Área de importação
│   ├── StatusDaily.tsx        # Tabela de status diário
│   ├── DailySchedule.tsx      # Programação de veículos
│   ├── PreRegistration.tsx    # Cadastros prévios
│   └── AutocompleteInput.tsx  # Input com autocompletar
├── types/
│   └── index.ts               # Definições de tipos
├── utils/
│   ├── exportUtils.ts         # Utilitários de exportação
│   └── storageUtils.ts        # Utilitários de armazenamento
└── App.tsx                    # Componente principal
```

## Campos da Tabela Status Diário

| Campo | Tipo | Descrição |
|-------|------|-----------|
| OPERAÇÃO | Autocomplete | Tipo de operação |
| Nº | Input | Número identificador |
| INDÚSTRIA | Autocomplete | Indústria responsável |
| HORÁRIO PREVISTO | Time | Horário programado |
| PLACA | Input | Placa do veículo |
| MOTORISTA | Input | Nome do motorista |
| ORIGEM | Autocomplete | Local de origem |
| DESTINO | Autocomplete | Local de destino |
| DATA TRANSPORTE | Date | Data do transporte |
| TRANSPORTE SAP | Input | Código SAP (importado) |
| ROTA | Input | Rota (importado) |
| PESO | Number | Peso em kg (importado) |
| CAIXAS | Number | Quantidade de caixas (importado) |
| RESPONSÁVEL | Input | Responsável pelo transporte |
| INÍCIO | Time | Horário de início |
| FIM | Time | Horário de fim |
| PALLETS REFRIGERADOS | Number | Qtd pallets refrigerados |
| PALLETS SECOS | Number | Qtd pallets secos |
| QTD PALLETS | Calculated | Total calculado automaticamente |
| SEPARAÇÃO | Input | Informações de separação |
| OBSERVAÇÃO | Textarea | Observações gerais |
| TERMO PALLET | Input | Número do termo |
| CTE | Input | Conhecimento de transporte |
| MDFE | Input | Manifesto eletrônico |
| AE | Input | Autorização especial |
| HORÁRIO SAÍDA ORIGEM | Time | Horário real de saída |
| HORÁRIO DESTINO CHEGADA | Time | Horário real de chegada |
| DOC RELATÓRIO FINANCEIRO | Checkbox | Documento presente |
| DOC TERMO PALLETS | Checkbox | Documento presente |
| DOC PROTOCOLOS | Checkbox | Documento presente |
| DOC CANHOTOS | Checkbox | Documento presente |
| STATUS | Select | PENDENTE/FINALIZADO |

## Instalação e Uso

### Instalação
```bash
npm install
npm run dev
```

### Uso do Sistema

1. **Importação de Dados**
   - Acesse a aba "Importação"
   - Cole os dados do Excel (formato TAB-separated)
   - Os dados serão automaticamente processados

2. **Cadastros Prévios**
   - Acesse a aba "Cadastros"
   - Adicione itens nas categorias desejadas
   - Use para autocompletar campos nas outras telas

3. **Status Diário**
   - Acesse a aba "Status Diário"
   - Selecione a data desejada
   - Clique em "Editar" para modificar registros
   - Use busca para filtrar transportes

4. **Programação Diária**
   - Acesse a aba "Programação"
   - Adicione veículos com motoristas e destinos
   - Exporte para WhatsApp

5. **Exportações**
   - Botão "WhatsApp" no cabeçalho
   - Botão "Excel" para relatório completo

## Limitações

- Suporte para até 40 veículos por dia
- Capacidade mínima de 100 transportes por dia
- Mensagens WhatsApp limitadas a 2.000 caracteres
- Dados persistidos localmente no navegador

## Recursos Avançados

- Interface responsiva para mobile/tablet/desktop
- Tema escuro com cores profissionais
- Validação de dados em tempo real
- Micro-interações e transições suaves
- Autocomplete inteligente
- Sincronização entre telas via Transporte SAP

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o suporte técnico.