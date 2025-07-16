# 🚛 Sistema de Gestão de Rotas de Transporte
## Guia Completo de Instalação e Configuração

### 📋 **ÍNDICE**
1. [Download e Configuração Inicial](#1-download-e-configuração-inicial)
2. [Configuração do Firebase](#2-configuração-do-firebase)
3. [Configuração do GitHub](#3-configuração-do-github)
4. [Deploy no Netlify](#4-deploy-no-netlify)
5. [Configuração Final](#5-configuração-final)
6. [Uso do Sistema](#6-uso-do-sistema)
7. [Solução de Problemas](#7-solução-de-problemas)

---

## **1. DOWNLOAD E CONFIGURAÇÃO INICIAL**

### 1.1 Download do Projeto
1. Acesse o projeto no Bolt.new
2. Clique no botão **"Download"** no canto superior direito
3. Extraia o arquivo ZIP em uma pasta de sua escolha
4. Abra o terminal/prompt de comando na pasta extraída

### 1.2 Instalação das Dependências
```bash
# Instalar Node.js (se não tiver)
# Baixe em: https://nodejs.org/

# Verificar instalação
node --version
npm --version

# Instalar dependências do projeto
npm install
```

### 1.3 Teste Local
```bash
# Executar em modo desenvolvimento
npm run dev

# O sistema abrirá em: http://localhost:5173
```

---

## **2. CONFIGURAÇÃO DO FIREBASE**

### 2.1 Criar Projeto Firebase
1. Acesse: https://console.firebase.google.com/
2. Clique em **"Criar um projeto"**
3. Nome do projeto: `transport-management-[SEU-NOME]`
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2.2 Configurar Firestore Database
1. No painel do Firebase, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"**
4. Escolha a localização: **"southamerica-east1 (São Paulo)"**
5. Clique em **"Concluído"**

### 2.3 Configurar Regras de Segurança
1. Na aba **"Regras"** do Firestore
2. Substitua o conteúdo por:
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

### 2.4 Obter Credenciais
1. Clique no ícone de **engrenagem** → **"Configurações do projeto"**
2. Na aba **"Geral"**, role até **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Nome do app: `transport-management-web`
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. **COPIE** as credenciais mostradas

### 2.5 Configurar Credenciais no Projeto
1. Abra o arquivo `src/config/firebase.ts`
2. Substitua as credenciais de exemplo pelas suas:
```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

---

## **3. CONFIGURAÇÃO DO GITHUB**

### 3.1 Criar Repositório no GitHub
1. Acesse: https://github.com/
2. Clique em **"New repository"**
3. Nome: `sistema-gestao-rotas`
4. Descrição: `Sistema de Gestão de Rotas de Transporte`
5. Marque **"Public"** ou **"Private"**
6. **NÃO** marque "Add a README file"
7. Clique em **"Create repository"**

### 3.2 Configurar Git Local
```bash
# Navegar até a pasta do projeto
cd caminho/para/seu/projeto

# Inicializar repositório Git
git init

# Configurar usuário (se não configurado)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Adicionar arquivos
git add .

# Fazer primeiro commit
git commit -m "Primeiro commit: Sistema de Gestão de Rotas"

# Conectar com repositório remoto
git remote add origin https://github.com/SEU_USUARIO/sistema-gestao-rotas.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

### 3.3 Comandos Git Úteis
```bash
# Verificar status
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push

# Baixar mudanças
git pull
```

---

## **4. DEPLOY NO NETLIFY**

### 4.1 Preparar para Deploy
```bash
# Construir projeto para produção
npm run build

# Verificar se a pasta 'dist' foi criada
ls -la
```

### 4.2 Deploy Manual no Netlify
1. Acesse: https://www.netlify.com/
2. Faça login ou crie uma conta
3. Clique em **"Add new site"** → **"Deploy manually"**
4. Arraste a pasta **"dist"** para a área de upload
5. Aguarde o deploy finalizar
6. Anote a URL gerada (ex: `https://amazing-site-123456.netlify.app`)

### 4.3 Deploy Automático (Recomendado)
1. No Netlify, clique em **"Add new site"** → **"Import an existing project"**
2. Conecte com GitHub
3. Selecione o repositório `sistema-gestao-rotas`
4. Configurações de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clique em **"Deploy site"**

### 4.4 Configurar Domínio Personalizado (Opcional)
1. No painel do Netlify, clique em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio
4. Configure os DNS conforme instruções

---

## **5. CONFIGURAÇÃO FINAL**

### 5.1 Testar Sistema Completo
1. Acesse a URL do Netlify
2. Teste todas as funcionalidades:
   - ✅ Importação de dados
   - ✅ Status Diário
   - ✅ Programação
   - ✅ Cadastros
   - ✅ Dashboard
   - ✅ Exportações

### 5.2 Configurar Variáveis de Ambiente (Se necessário)
1. No Netlify, vá em **"Site settings"** → **"Environment variables"**
2. Adicione as variáveis do Firebase se necessário

### 5.3 Backup das Configurações
Salve em local seguro:
- Credenciais do Firebase
- URL do Netlify
- Repositório GitHub
- Senhas e acessos

---

## **6. USO DO SISTEMA**

### 6.1 Fluxo de Trabalho Diário
1. **Importação**: Cole dados do Excel na aba "Importação"
2. **Status Diário**: Acompanhe e edite transportes
3. **Programação**: Crie programações de veículos
4. **Dashboard**: Monitore status em tempo real
5. **Relatórios**: Exporte dados para WhatsApp/Excel

### 6.2 Cadastros Prévios
- Configure operações, indústrias, origens, destinos
- Cadastre placas e motoristas
- Use autocomplete para agilizar preenchimento

### 6.3 Exportações
- **WhatsApp**: Mensagem formatada até 2.000 caracteres
- **Excel**: Relatórios completos em CSV
- **Relatórios**: Diários e mensais separados

---

## **7. SOLUÇÃO DE PROBLEMAS**

### 7.1 Problemas Comuns

**Erro: "Firebase not configured"**
```bash
# Verificar se as credenciais estão corretas
# Arquivo: src/config/firebase.ts
```

**Erro: "Module not found"**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

**Erro de Build no Netlify**
```bash
# Verificar se o build funciona localmente
npm run build

# Verificar logs no Netlify
```

### 7.2 Comandos de Diagnóstico
```bash
# Verificar versões
node --version
npm --version

# Limpar cache
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules
npm install

# Testar build
npm run build
```

### 7.3 Logs e Debug
- **Firebase**: Console do navegador (F12)
- **Netlify**: Painel de deploy logs
- **Local**: Terminal onde roda `npm run dev`

---

## **📞 SUPORTE**

### Recursos Úteis
- **Firebase Docs**: https://firebase.google.com/docs
- **Netlify Docs**: https://docs.netlify.com/
- **React Docs**: https://react.dev/
- **Git Tutorial**: https://git-scm.com/docs

### Checklist Final
- [ ] Firebase configurado e funcionando
- [ ] Projeto no GitHub
- [ ] Deploy no Netlify funcionando
- [ ] Todas as funcionalidades testadas
- [ ] Backup das configurações salvo
- [ ] Usuários treinados no sistema

---

**🎉 PARABÉNS! Seu Sistema de Gestão de Rotas está funcionando!**

**Data de hoje configurada**: 15/07/2025
**Versão**: 1.0.0
**Suporte para**: 40 veículos/dia, 100 transportes/dia