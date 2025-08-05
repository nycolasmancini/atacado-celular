import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface RouteParams {
  params: {
    filename: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('GET /api/files/[filename] - Starting request');
    
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

    console.log(`Public file accessed: ${filename}`);

    // Retornar arquivo com headers otimizados para performance
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache por 1 ano
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*', // Allow CORS for images
      },
    });

  } catch (error) {
    console.error('Error serving public file:', error);
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