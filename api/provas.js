// Função para obter todas as provas
export async function GET() {
  try {
    console.log('Teste GET - API funcionando');
    
    // Retornar array vazio por enquanto para testar
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erro no GET:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Função para criar/atualizar uma prova
export async function POST(request) {
  try {
    console.log('Teste POST - API funcionando');
    
    const prova = await request.json();
    console.log('Dados recebidos:', prova.id);
    
    // Retornar sucesso simulado
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Prova salva com sucesso (teste)',
      id: prova.id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erro no POST:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Função para deletar uma prova
export async function DELETE(request) {
  try {
    console.log('Teste DELETE - API funcionando');
    
    const url = new URL(request.url);
    const provaId = url.searchParams.get('id');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Prova deletada com sucesso (teste)',
      id: provaId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erro no DELETE:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
