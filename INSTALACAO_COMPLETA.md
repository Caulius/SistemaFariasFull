# 🚛 Sistema de Gestão de Rotas de Transporte
## 📖 Guia Completo de Instalação - Do Download ao Deploy

### 📋 **ÍNDICE**
1. [Pré-requisitos](#1-pré-requisitos)
2. [Download e Configuração Inicial](#2-download-e-configuração-inicial)
3. [Configuração do Firebase](#3-configuração-do-firebase)
4. [Configuração do GitHub](#4-configuração-do-github)
5. [Deploy no Netlify](#5-deploy-no-netlify)
6. [Teste Final](#6-teste-final)
7. [Uso do Sistema](#7-uso-do-sistema)
8. [Solução de Problemas](#8-solução-de-problemas)

---

## **1. PRÉ-REQUISITOS**

### 1.1 Softwares Necessários
- **Node.js** (versão 18 ou superior): https://nodejs.org/
- **Git**: https://git-scm.com/downloads
- **Editor de código** (recomendado: VS Code): https://code.visualstudio.com/

### 1.2 Contas Necessárias
- **GitHub**: https://github.com/
- **Firebase**: https://console.firebase.google.com/
- **Netlify**: https://www.netlify.com/

### 1.3 Verificar Instalações
```bash
# Verificar Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar: 9.x.x ou superior

# Verificar Git
git --version
# Deve retornar: git version 2.x.x
```

---

## **2. DOWNLOAD E CONFIGURAÇÃO INICIAL**

### 2.1 Download do Projeto
1. No **Bolt.new**, clique no botão **"Download"** (canto superior direito)
2. Salve o arquivo ZIP em uma pasta de fácil acesso (ex: `C:\Projetos\`)
3. Extraia o arquivo ZIP
4. Renomeie a pasta para `sistema-gestao-rotas`

### 2.2 Abrir Terminal/Git Bash
```bash
# Windows: Abrir Git Bash na pasta do projeto
# Clique com botão direito na pasta → "Git Bash Here"

# Ou navegue pelo terminal
cd C:\Projetos\sistema-gestao-rotas

# Verificar se está na pasta correta
ls -la
# Deve mostrar: package.json, src/, public/, etc.
```

### 2.3 Instalar Dependências
```bash
# Instalar todas as dependências
npm install

# Aguardar conclusão (pode demorar alguns minutos)
# Deve aparecer: "added XXX packages"
```

### 2.4 Teste Local Inicial
```bash
# Executar em modo desenvolvimento
npm run dev

# Deve aparecer:
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose

# Abrir no navegador: http://localhost:5173
# O sistema deve carregar (mesmo sem Firebase ainda)
```

---

## **3. CONFIGURAÇÃO DO FIREBASE**

### 3.1 Acessar Console Firebase
1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em **"Criar um projeto"** ou **"Add project"**

### 3.2 Criar Projeto
1. **Nome do projeto**: `rotasnew` (ou outro nome de sua escolha)
2. **Continuar**
3. **Desabilitar Google Analytics** (não é necessário)
4. **Criar projeto**
5. Aguardar criação (1-2 minutos)

### 3.3 Configurar Firestore Database
1. No painel lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. **Modo de segurança**: Selecione **"Iniciar no modo de teste"**
4. **Localização**: Selecione **"southamerica-east1 (São Paulo)"**
5. Clique em **"Concluído"**

### 3.4 Configurar Regras de Segurança
1. Na aba **"Regras"** do Firestore
2. **Substitua** todo o conteúdo por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Clique em **"Publicar"**

### 3.5 Obter Credenciais do Projeto
1. Clique no ícone de **engrenagem** → **"Configurações do projeto"**
2. Role até **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. **Nome do app**: `sistema-gestao-rotas`
5. **NÃO** marque "Configurar Firebase Hosting"
6. Clique em **"Registrar app"**
7. **COPIE** as credenciais mostradas

### 3.6 Configurar Credenciais no Projeto
**As credenciais já estão configuradas no arquivo `src/config/firebase.ts`:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBKvPIPc04vuO1o7QVwMY6sLKKq5-P275w",
  authDomain: "rotasnew.firebaseapp.com",
  projectId: "rotasnew",
  storageBucket: "rotasnew.firebasestorage.app",
  messagingSenderId: "824712861576",
  appId: "1:824712861576:web:6407a0ebedbcc0e53a0c3d",
  measurementId: "G-SNW2GWRNEX"
};
```

### 3.7 Testar Conexão Firebase
```bash
# Parar o servidor (Ctrl+C)
# Reiniciar o servidor
npm run dev

# Abrir http://localhost:5173
# Testar funcionalidades (importação, cadastros, etc.)
# Verificar no Console Firebase se os dados aparecem
```

---

## **4. CONFIGURAÇÃO DO GITHUB**

### 4.1 Criar Repositório no GitHub
1. Acesse: https://github.com/
2. Clique em **"New repository"** (botão verde)
3. **Repository name**: `sistema-gestao-rotas`
4. **Description**: `Sistema de Gestão de Rotas de Transporte`
5. Selecione **"Public"** (ou Private se preferir)
6. **NÃO** marque nenhuma opção adicional
7. Clique em **"Create repository"**

### 4.2 Configurar Git Local
```bash
# Navegar até a pasta do projeto (se não estiver)
cd C:\Projetos\sistema-gestao-rotas

# Inicializar repositório Git
git init

# Configurar usuário Git (se primeira vez)
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@exemplo.com"

# Verificar configuração
git config --global user.name
git config --global user.email
```

### 4.3 Conectar com GitHub
```bash
# Adicionar todos os arquivos
git add .

# Verificar arquivos adicionados
git status

# Fazer primeiro commit
git commit -m "Primeiro commit: Sistema de Gestão de Rotas completo"

# Conectar com repositório remoto (SUBSTITUA SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/sistema-gestao-rotas.git

# Verificar conexão
git remote -v

# Enviar para GitHub
git branch -M main
git push -u origin main
```

### 4.4 Verificar no GitHub
1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos foram enviados
3. Deve aparecer: `src/`, `public/`, `package.json`, etc.

---

## **5. DEPLOY NO NETLIFY**

### 5.1 Preparar Build de Produção
```bash
# Construir projeto para produção
npm run build

# Verificar se a pasta 'dist' foi criada
ls -la
# Deve aparecer: dist/

# Verificar conteúdo da pasta dist
ls -la dist/
# Deve conter: index.html, assets/, etc.
```

### 5.2 Deploy Manual (Método Rápido)
1. Acesse: https://www.netlify.com/
2. Faça login ou crie uma conta
3. Clique em **"Add new site"** → **"Deploy manually"**
4. **Arraste a pasta `dist`** para a área de upload
5. Aguarde o deploy (1-2 minutos)
6. **Anote a URL gerada** (ex: `https://amazing-site-123456.netlify.app`)

### 5.3 Deploy Automático (Recomendado)
1. No Netlify, clique em **"Add new site"** → **"Import an existing project"**
2. Clique em **"Deploy with GitHub"**
3. **Autorize** o Netlify no GitHub
4. Selecione o repositório **`sistema-gestao-rotas`**
5. **Configurações de build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
6. Clique em **"Deploy site"**
7. Aguarde o deploy automático

### 5.4 Configurar Domínio (Opcional)
1. No painel do Netlify, clique em **"Domain settings"**
2. Clique em **"Options"** → **"Edit site name"**
3. Digite: `sistema-gestao-rotas-[SEU-NOME]`
4. Salvar

---

## **6. TESTE FINAL**

### 6.1 Testar Sistema Completo
1. **Acesse a URL do Netlify**
2. **Teste todas as funcionalidades**:

#### Dashboard
- [ ] Métricas aparecem corretamente
- [ ] Botões funcionam

#### Importação
- [ ] Colar dados do Excel
- [ ] Preview funciona
- [ ] Importação confirma

#### Status Diário
- [ ] Tabela carrega
- [ ] Edição funciona
- [ ] Autocomplete funciona
- [ ] Filtros funcionam

#### Programação
- [ ] Criar programação
- [ ] Adicionar veículos
- [ ] Adicionar destinos
- [ ] Exportar WhatsApp

#### Cadastros
- [ ] Adicionar itens
- [ ] Editar itens
- [ ] Remover itens

#### Relatórios
- [ ] Exportar Excel
- [ ] Exportar WhatsApp
- [ ] Relatórios diários/mensais

### 6.2 Verificar Firebase
1. Acesse o **Console Firebase**
2. Vá em **"Firestore Database"**
3. Verifique se as coleções aparecem:
   - `statusEntries`
   - `schedules`
   - `preRegistration`
   - `transports`

---

## **7. USO DO SISTEMA**

### 7.1 Fluxo de Trabalho Diário
1. **Importação**: Cole dados do Excel na aba "Importação"
2. **Cadastros**: Configure operações, indústrias, origens, destinos, placas, motoristas
3. **Status Diário**: Acompanhe e edite transportes
4. **Programação**: Crie programações de veículos
5. **Dashboard**: Monitore status em tempo real
6. **Relatórios**: Exporte dados para WhatsApp/Excel

### 7.2 Dados de Exemplo para Teste

#### Importação (Cole no box):
```
12345	RJ-SP	1500	50
12346	SP-MG	2000	75
12347	MG-RJ	1200	30
```

#### Cadastros Sugeridos:
- **Operações**: Entrega, Coleta, Transferência
- **Indústrias**: Alimentícia, Farmacêutica, Automotiva
- **Origens**: São Paulo, Rio de Janeiro, Belo Horizonte
- **Destinos**: Santos, Campinas, Guarulhos
- **Placas**: ABC-1234, DEF-5678, GHI-9012
- **Motoristas**: João Silva, Maria Santos, Pedro Costa

---

## **8. SOLUÇÃO DE PROBLEMAS**

### 8.1 Problemas Comuns

#### "Firebase not configured"
```bash
# Verificar se as credenciais estão corretas
# Arquivo: src/config/firebase.ts
# Verificar se o projeto Firebase existe
```

#### "Module not found"
```bash
# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### "Build failed"
```bash
# Verificar se o build funciona localmente
npm run build

# Verificar erros no console
# Corrigir erros e tentar novamente
```

#### "Netlify deploy failed"
```bash
# Verificar logs no Netlify
# Verificar se a pasta dist existe
# Verificar se o build command está correto
```

### 8.2 Comandos de Diagnóstico
```bash
# Verificar versões
node --version
npm --version
git --version

# Limpar cache npm
npm cache clean --force

# Verificar status Git
git status

# Verificar conexões remotas
git remote -v

# Testar build local
npm run build
```

### 8.3 Logs e Debug
- **Firebase**: Console do navegador (F12) → Console
- **Netlify**: Painel de deploy → Deploy log
- **Local**: Terminal onde roda `npm run dev`

### 8.4 Comandos Git Úteis
```bash
# Ver histórico de commits
git log --oneline

# Verificar diferenças
git diff

# Adicionar mudanças específicas
git add src/components/StatusDaily.tsx

# Fazer commit com mensagem
git commit -m "Correção na tabela de status"

# Enviar para GitHub
git push

# Baixar mudanças do GitHub
git pull
```

---

## **📞 SUPORTE E RECURSOS**

### Links Úteis
- **Firebase Console**: https://console.firebase.google.com/
- **GitHub**: https://github.com/
- **Netlify**: https://app.netlify.com/
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

### Documentação
- **Firebase**: https://firebase.google.com/docs
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/

### Checklist Final
- [ ] Node.js instalado
- [ ] Projeto baixado e extraído
- [ ] Dependências instaladas (`npm install`)
- [ ] Firebase configurado e testado
- [ ] Repositório GitHub criado
- [ ] Código enviado para GitHub
- [ ] Deploy no Netlify funcionando
- [ ] Todas as funcionalidades testadas
- [ ] URLs anotadas e salvas

---

## **🎉 PARABÉNS!**

**Seu Sistema de Gestão de Rotas está 100% funcional!**

### Informações Importantes:
- **Data configurada**: 15/07/2025
- **Capacidade**: 40 veículos/dia, 100 transportes/dia
- **Firebase**: Configurado com projeto "rotasnew"
- **Backup**: Código salvo no GitHub
- **Acesso**: URL do Netlify

### Próximos Passos:
1. **Treinar usuários** no sistema
2. **Fazer backup** das configurações
3. **Monitorar** uso e performance
4. **Atualizar** conforme necessário

**Sistema pronto para uso em produção!** 🚀