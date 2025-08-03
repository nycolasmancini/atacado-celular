import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const webhookModeSchema = z.object({
  mode: z.enum(['production', 'test'])
});

export async function GET() {
  try {
    const currentMode = process.env.WEBHOOK_MODE || 'production';
    
    return NextResponse.json({
      success: true,
      mode: currentMode,
      urls: {
        production: {
          whatsapp_captured: process.env.N8N_WEBHOOK_URL_WHATSAPP_CAPTURED,
          order_completed: process.env.N8N_WEBHOOK_URL_ORDER_COMPLETED,
          cart_abandoned: process.env.N8N_WEBHOOK_URL_CART_ABANDONED,
          high_value_interest: process.env.N8N_WEBHOOK_URL_HIGH_VALUE_INTEREST,
          session_ended: process.env.N8N_WEBHOOK_URL_SESSION_ENDED,
        },
        test: {
          whatsapp_captured: process.env.N8N_WEBHOOK_URL_TEST_WHATSAPP_CAPTURED,
          order_completed: process.env.N8N_WEBHOOK_URL_TEST_ORDER_COMPLETED,
          cart_abandoned: process.env.N8N_WEBHOOK_URL_TEST_CART_ABANDONED,
          high_value_interest: process.env.N8N_WEBHOOK_URL_TEST_HIGH_VALUE_INTEREST,
          session_ended: process.env.N8N_WEBHOOK_URL_TEST_SESSION_ENDED,
        }
      }
    });
  } catch (error) {
    console.error('Error getting webhook mode:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao obter modo do webhook'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode } = webhookModeSchema.parse(body);
    
    // Update .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add WEBHOOK_MODE
    const lines = envContent.split('\n');
    let modeLineIndex = lines.findIndex(line => line.startsWith('WEBHOOK_MODE='));
    
    if (modeLineIndex >= 0) {
      lines[modeLineIndex] = `WEBHOOK_MODE=${mode}`;
    } else {
      lines.push(`WEBHOOK_MODE=${mode}`);
    }
    
    // Write back to file
    fs.writeFileSync(envPath, lines.join('\n'));
    
    // Update process.env for immediate effect
    process.env.WEBHOOK_MODE = mode;
    
    return NextResponse.json({
      success: true,
      mode,
      message: `Modo do webhook alterado para: ${mode}`
    });
    
  } catch (error) {
    console.error('Error updating webhook mode:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Modo inválido. Use "production" ou "test".'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao atualizar modo do webhook'
    }, { status: 500 });
  }
}