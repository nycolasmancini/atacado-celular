import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hashPassword, validatePasswordStrength } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema de validação
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validar dados de entrada
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validationResult.error.errors.map(err => err.message)
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Buscar usuário com senha atual
    const userWithPassword = await prisma.admin.findUnique({
      where: { id: user.id },
      select: { password: true }
    });

    if (!userWithPassword) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      );
    }

    // Validar força da nova senha
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Nova senha não atende aos critérios de segurança',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(newPassword, userWithPassword.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'A nova senha deve ser diferente da senha atual' },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedNewPassword = await hashPassword(newPassword);

    // Atualizar senha no banco
    await prisma.admin.update({
      where: { id: user.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    // Log da alteração
    console.log(`Password changed successfully for user: ${user.name} (${user.email})`);

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Change password endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}