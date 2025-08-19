import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Função para obter todas as provas
export async function GET() {
  try {
    console.log('Iniciando busca de provas...');
    
    const { blobs } = await list();
    console.log('Blobs encontrados:', blobs.length);
    
    // Filtrar apenas arquivos de provas
    const provasFiles = blobs.filter(blob => blob.pathname.startsWith('provas/'));
    console.log('Arquivos de provas encontrados:', provasFiles.length);
    
    // Buscar conteúdo de cada arquivo de prova
    const provas = [];
    for (const file of provasFiles) {
      try {
        console.log('Lendo arquivo:', file.pathname);
        const response = await fetch(file.url);
        if (response.ok) {
          const content = await response.json();
          provas.push(content);
        } else {
          console.error(`Erro HTTP ${response.status} ao ler ${file.pathname}`);
        }
      } catch (error) {
        console.error(`Erro ao ler arquivo ${file.pathname}:`, error);
      }
    }
    
    console.log('Provas carregadas:', provas.length);
    
    // Ordenar por data de criação (mais recentes primeiro)
    provas.sort((a, b) => b.id - a.id);
    
    return NextResponse.json(provas);
  } catch (error) {
    console.error('Erro ao buscar provas:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// Função para criar/atualizar uma prova
export async function POST(request) {
  try {
    console.log('Iniciando salvamento de prova...');
    
    const prova = await request.json();
    console.log('Dados da prova recebidos:', prova.id);
    
    if (!prova.id) {
      return NextResponse.json({ error: 'ID da prova é obrigatório' }, { status: 400 });
    }
    
    // Criar nome do arquivo baseado no ID da prova
    const fileName = `provas/${prova.id}.json`;
    console.log('Nome do arquivo:', fileName);
    
    // Converter prova para JSON string
    const provaData = JSON.stringify(prova, null, 2);
    
    // Fazer upload para o Blob Storage
    const blob = await put(fileName, provaData, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    console.log('Prova salva com sucesso:', blob.url);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prova salva com sucesso',
      url: blob.url 
    });
  } catch (error) {
    console.error('Erro ao salvar prova:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// Função para deletar uma prova
export async function DELETE(request) {
  try {
    console.log('Iniciando exclusão de prova...');
    
    const { searchParams } = new URL(request.url);
    const provaId = searchParams.get('id');
    console.log('ID da prova para deletar:', provaId);
    
    if (!provaId) {
      return NextResponse.json({ error: 'ID da prova é obrigatório' }, { status: 400 });
    }
    
    const fileName = `provas/${provaId}.json`;
    console.log('Nome do arquivo para deletar:', fileName);
    
    // Deletar arquivo do Blob Storage
    await del(fileName);
    
    console.log('Prova deletada com sucesso');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prova deletada com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar prova:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}
