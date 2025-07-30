"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { event, customEvent, MetaEvents } from "@/lib/meta-pixel";
import { trackWhatsAppSubmission } from "@/lib/tracking";
import toast from "react-hot-toast";

// Schema de validação com regex brasileiro
const whatsappSchema = z.object({
  whatsapp: z
    .string()
    .min(1, "WhatsApp é obrigatório")
    .regex(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "Formato inválido. Use: (XX) XXXXX-XXXX"
    ),
});

type WhatsAppFormData = z.infer<typeof whatsappSchema>;

interface WhatsAppModalProps {
  isOpen: boolean;
  onSuccess: (whatsapp: string, expiresAt: number) => void;
  onClose?: () => void;
}

export function WhatsAppModal({ isOpen, onSuccess, onClose }: WhatsAppModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappSchema),
  });

  // Disparar evento ao abrir modal
  useEffect(() => {
    if (isOpen) {
      event(MetaEvents.INITIATE_CHECKOUT);
    }
  }, [isOpen]);

  const onSubmit = async (data: WhatsAppFormData) => {
    setIsLoading(true);

    try {
      // Call unlock-prices API
      const response = await fetch('/api/unlock-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ whatsapp: data.whatsapp })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao liberar preços');
      }

      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao liberar preços');
      }

      // Track WhatsApp submission
      trackWhatsAppSubmission(data.whatsapp);

      // Eventos Meta Pixel
      event(MetaEvents.LEAD, {
        content_name: 'WhatsApp Capture',
        content_category: 'Landing Page',
        value: 0.0,
        currency: 'BRL'
      });

      customEvent('WhatsAppSubmitted', {
        source: 'landing_modal',
        phone: data.whatsapp.replace(/\D/g, '') // Remove formatação para hash se necessário
      });

      // Callback de sucesso com expiresAt
      onSuccess(data.whatsapp, result.expiresAt);
      
      toast.success("Preços liberados com sucesso! 🎉");
      reset();
      
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao liberar preços. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose || (() => {})} // Permite fechar se onClose for fornecido
      size="md"
      className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 text-white"
    >
      <div className="text-center space-y-6">
        {/* Ícone */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
            </svg>
          </div>
        </div>

        {/* Título e Subtítulo */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            📦 Calcular Frete + Ver Preços
          </h2>
          <p className="text-white/90">
            Insira seu WhatsApp para calcular o frete e liberar os preços atacadistas por 7 dias
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("whatsapp")}
            type="tel"
            mask="(99) 99999-9999"
            placeholder="(11) 99999-9999"
            error={errors.whatsapp?.message}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:ring-white/50 focus:border-white"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
              </svg>
            }
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            className="bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg h-12"
          >
{isLoading ? "Calculando..." : "🚚 Calcular Frete + Liberar Preços"}
          </Button>
        </form>

        {/* Nota de segurança */}
        <p className="text-xs text-white/70">
          ✅ Seus dados estão seguros. Utilizamos apenas para calcular o frete e liberar preços.
        </p>
      </div>
    </Modal>
  );
}