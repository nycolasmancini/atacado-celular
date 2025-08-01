// Temporariamente desabilitado - usando autenticação localStorage
// import { handlers } from "@/lib/auth"
// export const { GET, POST } = handlers

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth is disabled' }, { status: 404 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth is disabled' }, { status: 404 })
}