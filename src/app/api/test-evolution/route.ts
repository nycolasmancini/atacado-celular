import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { evolutionClient } from '@/lib/evolution';

export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Acesso negado. Apenas administradores."
        }
      }, { status: 401 });
    }

    console.log('🧪 Testando conexão Evolution API...');
    
    // Testar conexão
    const connectionTest = await evolutionClient.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        status: 'disconnected',
        error: connectionTest.error,
        message: 'Falha na conexão com Evolution API'
      }, { status: 503 });
    }

    // Se conectado, tentar enviar mensagem de teste
    const testMessage = await evolutionClient.sendText({
      number: '5511999999999', // Número de teste
      message: '🤖 Teste de conexão Evolution API - ' + new Date().toLocaleString('pt-BR'),
      delayMessage: 1
    });

    if (testMessage.success) {
      return NextResponse.json({
        success: true,
        status: 'connected',
        message: 'Evolution API funcionando corretamente',
        messageId: testMessage.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 'connected_but_send_failed',
        error: testMessage.error,
        message: 'Conectado mas falha ao enviar mensagem',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Erro no teste Evolution API:', error);
    
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: 'Erro interno ao testar Evolution API'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Acesso negado. Apenas administradores."
        }
      }, { status: 401 });
    }

    const body = await request.json();
    const { number, message } = body;

    if (!number || !message) {
      return NextResponse.json({
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "Número e mensagem são obrigatórios"
        }
      }, { status: 400 });
    }

    console.log('🧪 Enviando mensagem de teste:', { number, message });

    const result = await evolutionClient.sendText({
      number,
      message,
      delayMessage: 1
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Mensagem enviada com sucesso',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: 'Falha ao enviar mensagem'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: 'Erro interno ao enviar mensagem'
    }, { status: 500 });
  }
}