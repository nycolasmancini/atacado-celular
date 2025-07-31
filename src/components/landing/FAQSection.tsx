'use client'

import { useState } from 'react'
import Head from 'next/head'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Qual é a garantia dos produtos PMCELL?",
      answer: "Oferecemos **90 dias de garantia completa** em todos os nossos produtos. Isso significa que você tem 3 meses para testar, vender e ter a tranquilidade de que, caso haja qualquer problema, nós resolvemos rapidamente. Nossa garantia cobre defeitos de fabricação e problemas de funcionamento.",
      category: "garantia"
    },
    {
      question: "Como funciona o processo de troca e devolução?",
      answer: "O processo é muito simples:\n\n1. **Entre em contato** pelo WhatsApp (11) 99999-9999\n2. **Informe o problema** e envie fotos se necessário\n3. **Receba autorização** para devolução\n4. **Enviamos um novo produto** ou estornamos o valor\n\nTodo o processo é feito em até **48 horas úteis** e o frete de retorno é por nossa conta.",
      category: "troca"
    },
    {
      question: "Qual o prazo e valor do frete?",
      answer: "**Entrega em 24h para São Paulo e região metropolitana** com frete a partir de R$ 15,00.\n\nPara outras regiões:\n• **Sul e Sudeste**: 2-3 dias úteis\n• **Nordeste e Centro-Oeste**: 3-5 dias úteis\n• **Norte**: 5-7 dias úteis\n\n**Frete GRÁTIS** para pedidos acima de R$ 500,00 em todo o Brasil.",
      category: "frete"
    },
    {
      question: "Vocês emitem nota fiscal?",
      answer: "**Sim, sempre!** Emitimos nota fiscal para 100% das vendas. Isso garante:\n\n• **Segurança jurídica** para sua loja\n• **Cobertura da garantia** do fabricante\n• **Comprovação** para seu contador\n• **Credibilidade** com seus clientes\n\nA nota fiscal é enviada por email automaticamente após a confirmação do pagamento.",
      category: "fiscal"
    },
    {
      question: "Posso parcelar a compra? Como funciona?",
      answer: "**Sim! Parcelamos em até 12x sem juros** no cartão de crédito.\n\n**Formas de pagamento aceitas:**\n• Cartão de crédito (até 12x sem juros)\n• PIX (5% de desconto)\n• Boleto bancário (à vista)\n• Transferência bancária (à vista)\n\n**Vantagem especial:** Com o parcelamento, você pode começar a lucrar e vender os produtos antes mesmo de quitar o pagamento!",
      category: "parcelamento"
    },
    {
      question: "A PMCELL é uma empresa confiável?",
      answer: "**Absolutamente!** Somos uma empresa estabelecida há mais de 8 anos no mercado com:\n\n• **CNPJ ativo** e regularizado\n• **4.8 estrelas** no Google Reviews\n• **+340 lojistas parceiros** ativos\n• **Certificação ANATEL** em todos os produtos\n• **Suporte humanizado** com atendimento por videochamada\n\n[Ver nossos depoimentos no Google](https://google.com) | [Consultar CNPJ na Receita Federal](https://cnpj.com)",
      category: "confiabilidade"
    },
    {
      question: "Os produtos têm certificação ANATEL?",
      answer: "**Sim, 100% dos nossos produtos são certificados pela ANATEL!**\n\nIsso significa:\n• **Conformidade** com as normas brasileiras\n• **Segurança** para você e seus clientes\n• **Proteção legal** contra fiscalizações\n• **Qualidade garantida** nos produtos eletrônicos\n\nTodos os certificados ANATEL estão disponíveis em nosso site e são enviados junto com os produtos.",
      category: "certificacao"
    },
    {
      question: "Qual é o pedido mínimo?",
      answer: "O pedido mínimo é de **30 peças totais**, podendo misturar diferentes produtos.\n\n**Exemplo:**\n• 10 capinhas\n• 10 películas\n• 10 carregadores\n\n**Por que pedido mínimo?**\nPara garantir que você tenha um mix interessante de produtos e possa começar com um estoque que realmente faça diferença no seu faturamento.",
      category: "pedido"
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n/g, ' ')
      }
    }))
  }

  const formatAnswer = (answer: string) => {
    // Convert markdown-style formatting
    let formatted = answer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-orange hover:text-orange-600 underline">$1</a>')
      .split('\n')
      .map(line => {
        if (line.startsWith('• ')) {
          return `<li class="ml-4">${line.substring(2)}</li>`
        }
        if (line.match(/^\d+\. /)) {
          return `<li class="ml-4">${line.substring(3)}</li>`
        }
        return line
      })
      .join('\n')
      .replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 mt-2 mb-2">$&</ul>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
    
    return `<p class="mb-3">${formatted}</p>`
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </Head>
      
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 md:px-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-32px md:text-40px font-montserrat font-semibold text-black mb-4 leading-tight">
              Perguntas{' '}
              <span className="text-primary-orange">Frequentes</span>
            </h2>
            <p className="text-16px md:text-18px font-inter text-gray-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre como ser parceiro PMCELL e multiplicar seus lucros
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-primary-orange/20 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="text-18px md:text-20px font-montserrat font-semibold text-black pr-4 leading-tight">
                      {faq.question}
                    </h3>
                    
                    {/* Plus/Minus Icon */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-45' : 'rotate-0'}`}>
                        <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Answer */}
                  <div 
                    id={`faq-answer-${index}`}
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openIndex === index 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                      <div 
                        className="text-16px font-inter text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(faq.answer) }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 md:mt-16">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
              <h3 className="text-24px font-montserrat font-semibold text-black mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-16px font-inter text-gray-600 mb-6">
                Nossa equipe está pronta para esclarecer qualquer questão e ajudar você a começar
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-success hover:bg-green-600 text-white font-montserrat font-semibold text-16px px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309"/>
                  </svg>
                  Falar no WhatsApp
                </button>
                <button className="bg-primary-orange hover:bg-orange-600 text-white font-montserrat font-semibold text-16px px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Ver Produtos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}