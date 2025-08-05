// Secure Rate Limiter com proteções avançadas
interface RateLimitInfo {
  count: number
  resetTime: number
  blocked: boolean
  firstRequest: number
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDurationMs?: number
  skipWhitelist?: string[]
}

class SecureRateLimiter {
  private requests: Map<string, RateLimitInfo> = new Map()
  private blockedIPs: Map<string, number> = new Map() // IP -> unblock time
  private suspiciousIPs: Map<string, number> = new Map() // IP -> suspicious count
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Limpeza automática a cada 2 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 2 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    
    // Cleanup rate limit info
    for (const [key, info] of this.requests.entries()) {
      if (now > info.resetTime) {
        this.requests.delete(key)
      }
    }

    // Cleanup blocked IPs
    for (const [ip, unblockTime] of this.blockedIPs.entries()) {
      if (now > unblockTime) {
        this.blockedIPs.delete(ip)
        console.log(`🔓 IP unblocked: ${ip}`)
      }
    }

    // Cleanup suspicious IPs (reset every hour)
    for (const [ip, time] of this.suspiciousIPs.entries()) {
      if (now - time > 60 * 60 * 1000) { // 1 hour
        this.suspiciousIPs.delete(ip)
      }
    }
  }

  private getKey(ip: string, identifier?: string): string {
    return identifier ? `${ip}:${identifier}` : ip
  }

  private isWhitelisted(ip: string, whitelist?: string[]): boolean {
    if (!whitelist) {
      // Default whitelist para desenvolvimento
      return ip === '127.0.0.1' || 
             ip === 'localhost' ||
             ip.startsWith('192.168.') ||
             ip.startsWith('10.') ||
             ip.startsWith('172.16.') ||
             ip.startsWith('172.17.') ||
             ip.startsWith('172.18.') ||
             ip.startsWith('172.19.') ||
             ip.startsWith('172.2') ||
             ip.startsWith('172.30.') ||
             ip.startsWith('172.31.')
    }
    return whitelist.includes(ip)
  }

  private markSuspicious(ip: string) {
    const count = this.suspiciousIPs.get(ip) || 0
    this.suspiciousIPs.set(ip, count + 1)
    
    if (count > 5) { // 5 tentativas suspeitas
      console.warn(`🕵️ Highly suspicious IP detected: ${ip} (${count} violations)`)
      // Block por mais tempo para IPs altamente suspeitos
      this.blockedIPs.set(ip, Date.now() + (2 * 60 * 60 * 1000)) // 2 horas
    }
  }

  check(ip: string, config: RateLimitConfig, identifier?: string): boolean {
    const {
      windowMs = 60000,
      maxRequests = 10,
      blockDurationMs = 15 * 60 * 1000, // 15 minutos
      skipWhitelist
    } = config;

    // Check whitelist
    if (this.isWhitelisted(ip, skipWhitelist)) {
      return true;
    }

    // Check if IP is currently blocked
    const blockedUntil = this.blockedIPs.get(ip);
    if (blockedUntil && Date.now() < blockedUntil) {
      this.markSuspicious(ip)
      console.warn(`🚫 Blocked IP attempted access: ${ip} (blocked until ${new Date(blockedUntil).toISOString()})`);
      return false;
    }

    const key = this.getKey(ip, identifier)
    const now = Date.now()
    const info = this.requests.get(key)

    if (!info || now > info.resetTime) {
      // Nova janela ou primeira requisição
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
        firstRequest: now
      })
      return true
    }

    // Incrementar contador
    info.count++

    // Verificar se excedeu o limite
    if (info.count > maxRequests) {
      info.blocked = true
      
      // Block IP for configured duration
      this.blockedIPs.set(ip, now + blockDurationMs);
      this.markSuspicious(ip)
      
      console.warn(`🚨 Rate limit exceeded - IP blocked: ${ip}, Requests: ${info.count}/${maxRequests}, Duration: ${blockDurationMs/1000}s, Identifier: ${identifier || 'none'}`);
      
      return false
    }

    // Warning when approaching limit
    if (info.count > maxRequests * 0.8) {
      console.warn(`⚠️ IP approaching rate limit: ${ip}, Requests: ${info.count}/${maxRequests}`)
    }

    return true
  }

  // Rate limit específico para login attempts
  checkLoginAttempt(ip: string, email?: string): boolean {
    const identifier = email ? `login:${email}` : 'login';
    
    return this.check(ip, {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 5, // 5 tentativas
      blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
    }, identifier);
  }

  // Rate limit para upload de arquivos
  checkFileUpload(ip: string): boolean {
    return this.check(ip, {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 3, // 3 uploads por minuto
      blockDurationMs: 10 * 60 * 1000, // 10 minutos
    }, 'upload');
  }

  // Rate limit para APIs públicas
  checkPublicAPI(ip: string): boolean {
    return this.check(ip, {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 30, // 30 requests por minuto
      blockDurationMs: 5 * 60 * 1000, // 5 minutos
    }, 'public');
  }

  // Rate limit para APIs admin (mais restritivo)
  checkAdminAPI(ip: string): boolean {
    return this.check(ip, {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 20, // 20 requests por minuto
      blockDurationMs: 15 * 60 * 1000, // 15 minutos
    }, 'admin');
  }

  // Rate limit para webhooks
  checkWebhook(ip: string): boolean {
    return this.check(ip, {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 10, // 10 webhooks por minuto
      blockDurationMs: 60 * 60 * 1000, // 1 hora
    }, 'webhook');
  }

  // Emergency block para IPs maliciosos
  emergencyBlock(ip: string, durationMs: number = 24 * 60 * 60 * 1000) {
    this.blockedIPs.set(ip, Date.now() + durationMs)
    console.error(`🚨 EMERGENCY BLOCK: IP ${ip} blocked for ${durationMs/1000}s`)
  }

  reset(ip: string, identifier?: string) {
    const key = this.getKey(ip, identifier)
    this.requests.delete(key)
    this.blockedIPs.delete(ip) // Also unblock IP
    this.suspiciousIPs.delete(ip) // Clear suspicious status
    console.log(`🔄 Rate limit reset for ${ip}:${identifier || 'all'}`)
  }

  getInfo(ip: string, identifier?: string): RateLimitInfo | null {
    const key = this.getKey(ip, identifier)
    return this.requests.get(key) || null
  }

  getStats() {
    return {
      activeKeys: this.requests.size,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      blockedList: Array.from(this.blockedIPs.entries()).map(([ip, unblockTime]) => ({
        ip,
        unblockTime: new Date(unblockTime).toISOString(),
        remainingMs: Math.max(0, unblockTime - Date.now())
      })),
      suspiciousList: Array.from(this.suspiciousIPs.entries()).map(([ip, count]) => ({
        ip,
        violations: count
      }))
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.requests.clear()
    this.blockedIPs.clear()
    this.suspiciousIPs.clear()
  }
}

export const secureRateLimiter = new SecureRateLimiter()

// Helper function para extrair IP real de forma segura
export function getRealIP(request: Request): string {
  // Ordem de prioridade para headers de IP
  const headers = [
    'cf-connecting-ip',      // Cloudflare
    'x-real-ip',             // Nginx
    'x-forwarded-for',       // Proxy padrão
    'x-client-ip',           // Outros proxies
    'x-cluster-client-ip',   // Clusters
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for pode ser uma lista separada por vírgulas
      const ip = value.split(',')[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }
  
  return 'unknown';
}

// Validar se é um IP válido
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    return false;
  }
  
  // Verificar se é IPv4 válido
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return true; // Assume IPv6 válido se passou no regex
}

// Middleware helper para aplicar rate limiting
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  rateLimitCheck: (ip: string) => boolean,
  errorMessage: string = 'Rate limit exceeded'
) {
  return async (request: Request): Promise<Response> => {
    const ip = getRealIP(request);
    
    if (!rateLimitCheck(ip)) {
      return new Response(
        JSON.stringify({
          error: errorMessage,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60, // seconds
          timestamp: new Date().toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': 'varies',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    return handler(request);
  };
}