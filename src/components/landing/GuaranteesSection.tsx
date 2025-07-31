'use client'

export default function GuaranteesSection() {
  const guarantees = [
    {
      icon: "📄",
      title: "Nota Fiscal em todos os pedidos",
      description: "Transparência total em todas as transações"
    },
    {
      icon: "✅",
      title: "Produtos com certificação Anatel",
      description: "Conformidade com as normas brasileiras"
    },
    {
      icon: "🛡️",
      title: "90 dias de garantia",
      description: "Proteção completa para você e seus clientes"
    },
    {
      icon: "📹",
      title: "Videochamada disponível antes da compra",
      description: "Veja os produtos antes de decidir"
    },
    {
      icon: "🔐",
      title: "Pagamento seguro via Pix ou Cartão",
      description: "Suas transações sempre protegidas"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-5 md:px-10">
        <div className="text-center mb-16">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-black mb-6 leading-tight">
            Sua Segurança é Nossa{' '}
            <span className="text-primary-blue">Prioridade</span>
          </h2>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-200"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{guarantee.icon}</span>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <h3 className="text-lg font-montserrat font-semibold text-black">
                    {guarantee.title}
                  </h3>
                </div>
                <p className="text-gray-text font-inter text-sm">
                  {guarantee.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}