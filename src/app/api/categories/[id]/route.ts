import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: 'ID da categoria inválido' },
        { status: 400 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { message: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId, isActive: true }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Check if another category with same name exists (case insensitive)
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive'
        },
        isActive: true,
        NOT: {
          id: categoryId
        }
      }
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { message: 'Já existe uma categoria com este nome' },
        { status: 409 }
      );
    }

    // Generate new slug if name changed
    let finalSlug = existingCategory.slug;
    if (existingCategory.name.toLowerCase() !== trimmedName.toLowerCase()) {
      const baseSlug = trimmedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens

      // Ensure slug is unique
      finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const slugExists = await prisma.category.findFirst({
          where: {
            slug: finalSlug,
            NOT: { id: categoryId }
          }
        });
        if (!slugExists) break;
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: trimmedName,
        slug: finalSlug
      }
    });

    return NextResponse.json(updatedCategory);

  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: 'ID da categoria inválido' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId, isActive: true },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { message: 'Não é possível deletar uma categoria que possui produtos' },
        { status: 409 }
      );
    }

    // Soft delete - mark as inactive
    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Categoria deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}