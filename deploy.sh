#!/bin/bash

echo "🚀 Iniciando deploy do Sistema de Provas ROTA..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Fazendo login no Vercel..."
    vercel login
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer deploy
echo "🚀 Fazendo deploy para produção..."
vercel --prod

echo "✅ Deploy concluído!"
echo "📝 Lembre-se de configurar o Blob Storage no dashboard do Vercel"
echo "🔗 Acesse: https://vercel.com/dashboard/stores"
