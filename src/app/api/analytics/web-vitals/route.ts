import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limiter';

// Validation schema for Web Vitals data
const webVitalsSchema = z.object({
  id: z.string(),
  name: z.enum(['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'long-task', 'dom-content-loaded', 'page-load', 'slow-resource', 'memory-usage']),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  delta: z.number(),
  navigationType: z.string(),
  url: z.string(),
  userAgent: z.string(),
  timestamp: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 100 metrics per minute per IP
    const rateLimitResult = await rateLimit(request, {
      limit: 100,
      windowMs: 60 * 1000, // 1 minute
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = webVitalsSchema.parse(body);

    // Here you would typically:
    // 1. Store in database (e.g., PostgreSQL, InfluxDB, or analytics service)
    // 2. Send to external analytics service (DataDog, New Relic, etc.)
    // 3. Aggregate metrics for dashboards
    
    // For now, we'll log it with structured format
    console.log('Web Vitals Metric:', JSON.stringify({
      metric: validatedData.name,
      value: validatedData.value,
      rating: validatedData.rating,
      url: validatedData.url,
      timestamp: new Date(validatedData.timestamp).toISOString(),
      sessionId: validatedData.id.split('-')[0], // Extract session ID from metric ID
      userAgent: validatedData.userAgent.slice(0, 100), // Truncate for privacy
    }));

    // Send to external analytics service (example)
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      try {
        await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`,
          },
          body: JSON.stringify({
            event: 'web_vitals',
            properties: validatedData,
          }),
        });
      } catch (webhookError) {
        console.error('Failed to send to analytics webhook:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid data format',
          details: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Web Vitals tracking error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      service: 'web-vitals-analytics',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}

// CORS for analytics requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}