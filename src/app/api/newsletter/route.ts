import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limiter';

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100).optional(),
  interests: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 3 newsletter subscriptions per hour per IP
    const rateLimitResult = await rateLimit(request, {
      limit: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de inscrição. Tente novamente mais tarde.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = newsletterSchema.parse(body);

    // Here you would typically:
    // 1. Check if email already exists
    // 2. Save to database
    // 3. Send welcome email
    // 4. Integrate with email marketing service (Mailchimp, SendGrid, etc.)
    
    // For now, we'll just log it
    console.log('Newsletter subscription:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(
      { 
        success: true,
        message: 'Inscrição realizada com sucesso! Você receberá nossas novidades em breve.'
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Validate email
    const emailSchema = z.string().email();
    const validatedEmail = emailSchema.parse(email);

    // Here you would remove from database/email service
    console.log('Newsletter unsubscribe:', {
      email: validatedEmail,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Inscrição cancelada com sucesso.'
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    console.error('Newsletter unsubscribe error:', error);
    
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'newsletter',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}