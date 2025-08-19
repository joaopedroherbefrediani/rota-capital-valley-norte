import { NextResponse } from 'next/server';

// Função para obter todas as provas
export async function GET() {
  try {
    console.log('Teste GET - API funcionando');
    
    // Retornar array vazio por enquanto para testar
    return NextResponse.json([]);
  } catch (error) {
    console.error('Erro no GET:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// Função para criar/atualizar uma prova
export async function POST(request) {
  try {
    console.log('Teste POST - API funcionando');
    
    const prova = await request.json();
    console.log('Dados recebidos:', prova.id);
    
    // Retornar sucesso simulado
    return NextResponse.json({ 
      success: true, 
      message: 'Prova salva com sucesso (teste)',
      id: prova.id
    });
  } catch (error) {
    console.error('Erro no POST:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// Função para deletar uma prova
export async function DELETE(request) {
  try {
    console.log('Teste DELETE - API funcionando');
    
    const { searchParams } = new URL(request.url);
    const provaId = searchParams.get('id');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prova deletada com sucesso (teste)',
      id: provaId
    });
  } catch (error) {
    console.error('Erro no DELETE:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}
