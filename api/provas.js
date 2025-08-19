import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Função para obter todas as provas
export async function GET() {
  try {
    const { blobs } = await list();
    
    // Filtrar apenas arquivos de provas
    const provasFiles = blobs.filter(blob => blob.pathname.startsWith('provas/'));
    
    // Buscar conteúdo de cada arquivo de prova
    const provas = [];
    for (const file of provasFiles) {
      try {
        const response = await fetch(file.url);
        const content = await response.json();
        provas.push(content);
      } catch (error) {
        console.error(`Erro ao ler arquivo ${file.pathname}:`, error);
      }
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    provas.sort((a, b) => b.id - a.id);
    
    return NextResponse.json(provas);
  } catch (error) {
    console.error('Erro ao buscar provas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Função para criar/atualizar uma prova
export async function POST(request) {
  try {
    const prova = await request.json();
    
    if (!prova.id) {
      return NextResponse.json({ error: 'ID da prova é obrigatório' }, { status: 400 });
    }
    
    // Criar nome do arquivo baseado no ID da prova
    const fileName = `provas/${prova.id}.json`;
    
    // Converter prova para JSON string
    const provaData = JSON.stringify(prova, null, 2);
    
    // Fazer upload para o Blob Storage
    const blob = await put(fileName, provaData, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prova salva com sucesso',
      url: blob.url 
    });
  } catch (error) {
    console.error('Erro ao salvar prova:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Função para deletar uma prova
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const provaId = searchParams.get('id');
    
    if (!provaId) {
      return NextResponse.json({ error: 'ID da prova é obrigatório' }, { status: 400 });
    }
    
    const fileName = `provas/${provaId}.json`;
    
    // Deletar arquivo do Blob Storage
    await del(fileName);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prova deletada com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar prova:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
