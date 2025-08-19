@echo off
echo 🚀 Iniciando deploy do Sistema de Provas ROTA...

REM Verificar se o Vercel CLI está instalado
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI não encontrado. Instalando...
    npm install -g vercel
)

REM Verificar se está logado no Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Fazendo login no Vercel...
    vercel login
)

REM Instalar dependências
echo 📦 Instalando dependências...
npm install

REM Fazer deploy
echo 🚀 Fazendo deploy para produção...
vercel --prod

echo ✅ Deploy concluído!
echo 📝 Lembre-se de configurar o Blob Storage no dashboard do Vercel
echo 🔗 Acesse: https://vercel.com/dashboard/stores

pause
