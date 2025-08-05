import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireAdminOrSeller } from '@/lib/auth-server';

interface RouteParams {
  params: {
    filename: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('GET /api/admin/files/[filename] - Starting request');
    
    // AUTENTICAÇÃO OBRIGATÓRIA - apenas admins e vendedores podem acessar arquivos
    console.log('Checking authentication...');
    const user = await requireAdminOrSeller(request);
    console.log('Authentication result:', user ? 'Success' : 'Failed');
    
    if (!user) {
      console.log('User not authenticated, returning 401');
      return NextResponse.json(
        { error: 'Acesso negado. Autenticação necessária.' },
        { status: 401 }
      );
    }

    const { filename } = params;

    // Validar nome do arquivo (prevenir path traversal)
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Nome de arquivo inválido' },
        { status: 400 }
      );
    }

    // Validar formato do nome do arquivo (deve ter UUID no início)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-/i;
    if (!uuidPattern.test(filename)) {
      return NextResponse.json(
        { error: 'Formato de arquivo inválido' },
        { status: 400 }
      );
    }

    // Construir caminho seguro para o arquivo
    const filePath = join(process.cwd(), 'uploads', 'admin', filename);

    // Verificar se o arquivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      );
    }

    // Ler arquivo
    const fileBuffer = await readFile(filePath);

    // Determinar Content-Type baseado na extensão
    const extension = filename.split('.').pop()?.toLowerCase();
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    };

    const contentType = contentTypes[extension || ''] || 'application/octet-stream';

    // Log do acesso ao arquivo
    console.log(`File accessed:`, {
      filename,
      accessedBy: user.email,
      timestamp: new Date().toISOString()
    });

    // Retornar arquivo com headers de segurança
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600', // Cache por 1 hora
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}