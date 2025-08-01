import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas e Devoluções - PMCELL São Paulo",
  description: "Política de Trocas e Devoluções da PMCELL São Paulo - Saiba como proceder em caso de defeito nos produtos.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrocasDevolucoes() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Trocas e Devoluções
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Criada em:</strong> 22 de novembro de 2020<br/>
              <strong>Última atualização:</strong> 07 de maio de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações Gerais</h2>
              <p className="mb-4">
                A <strong>PMCELL São Paulo (V.Zabin Tecnologia e Comércio)</strong> está comprometida em oferecer produtos de qualidade e garantir 
                a satisfação dos nossos clientes. Esta política estabelece as condições para trocas 
                e devoluções de produtos defeituosos.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="font-semibold text-blue-800">
                  ⚠️ IMPORTANTE: Realizamos trocas APENAS para produtos com defeito de fabricação.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Não aceitamos trocas por arrependimento, mudança de ideia ou preferência.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Garantia e Prazo</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Garantia de 90 Dias</h3>
                <p className="text-green-700">
                  Todos os produtos possuem garantia de <strong>90 dias</strong> contra defeitos de fabricação.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1. Prazos Importantes</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Comunicação do defeito:</strong> Até 90 dias após o recebimento do produto</li>
                  <li><strong>Envio do produto:</strong> Pode ser realizado após os 90 dias, desde que o defeito tenha sido comunicado dentro do prazo</li>
                  <li><strong>Avaliação:</strong> Até 7 dias úteis após recebimento do produto</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2. O que a Garantia Cobre</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ COBRE</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Defeitos de fabricação</li>
                      <li>• Produtos que não funcionam</li>
                      <li>• Problemas de qualidade</li>
                      <li>• Incompatibilidade técnica comprovada</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">❌ NÃO COBRE</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Mal uso do produto</li>
                      <li>• Danos físicos causados pelo cliente</li>
                      <li>• Desgaste natural</li>
                      <li>• Oxidação por umidade</li>
                      <li>• Arrependimento de compra</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Condições para Troca</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1. Estado do Produto</h3>
                <p className="mb-4">Para ser aceito na troca, o produto deve estar:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Embalagem original:</strong> Produto deve estar em sua embalagem original</li>
                  <li><strong>Sem marcas de uso:</strong> Produto não pode apresentar sinais de uso inadequado</li>
                  <li><strong>Limpo:</strong> Produto não pode estar sujo ou com resíduos</li>
                  <li><strong>Completo:</strong> Todos os acessórios e componentes devem estar inclusos</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2. Documentação Necessária</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Número do pedido original</li>
                  <li>Descrição detalhada do problema</li>
                  <li>Fotos ou vídeos comprovando o defeito</li>
                  <li>Data de recebimento do produto</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Processo de Troca</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Passo a Passo</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Contato Inicial</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Entre em contato via WhatsApp informando o problema e enviando fotos/vídeos
                    </p>
                  </li>
                  <li>
                    <strong>Análise Prévia</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Nossa equipe fará uma análise inicial e orientará sobre o procedimento
                    </p>
                  </li>
                  <li>
                    <strong>Envio do Produto</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Cliente envia o produto para nossa sede (frete por conta do cliente)
                    </p>
                  </li>
                  <li>
                    <strong>Avaliação Técnica</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Avaliamos o produto em até 7 dias úteis após o recebimento
                    </p>
                  </li>
                  <li>
                    <strong>Resolução</strong>
                    <p className="text-sm text-gray-600 mt-1">
                      Geramos crédito para uso em próximo pedido (incluindo abatimento de frete)
                    </p>
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">💰 Custos de Logística</h4>
                <p className="text-yellow-700">
                  <strong>O frete para envio do produto defeituoso é por conta do cliente.</strong> 
                  Utilizamos o sistema de crédito para facilitar futuras compras.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sistema de Créditos</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1. Como Funciona</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Após confirmação do defeito, geramos um <strong>crédito</strong> no valor do produto</li>
                  <li>Crédito pode ser usado em qualquer pedido futuro</li>
                  <li>Crédito pode abater custos de logística também</li>
                  <li>Não há prazo de validade para utilização do crédito</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2. Vantagens do Sistema</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">✨ Para o Cliente</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Flexibilidade para escolher novos produtos</li>
                      <li>• Pode abater frete de próximas compras</li>
                      <li>• Sem prazo de validade</li>
                      <li>• Processo mais ágil</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🚀 Agilidade</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Não precisa esperar estorno bancário</li>
                      <li>• Crédito disponível imediatamente</li>
                      <li>• Continua comprando com a PMCELL São Paulo</li>
                      <li>• Histórico de créditos organizado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Devoluções com Estorno</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Casos Específicos</h3>
                <p className="text-red-700">
                  <strong>Estorno em dinheiro apenas</strong> quando mercadoria não foi enviada por erro nosso.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1. Quando Ocorre Estorno</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Produto não foi enviado por erro da PMCELL São Paulo</li>
                  <li>Cobrança indevida comprovada</li>
                  <li>Cancelamento de pedido antes do envio</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2. Formas de Estorno</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>PIX:</strong> Estorno imediato na conta informada</li>
                  <li><strong>Cartão de Crédito:</strong> Estorno na fatura em até 2 faturas</li>
                  <li><strong>Dinheiro:</strong> Apenas para compras presenciais</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Produtos Danificados no Transporte</h2>
              
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">🚚 Responsabilidade da Transportadora</h3>
                <p className="text-orange-700">
                  Para produtos danificados durante o transporte, <strong>acionamos a garantia da logística</strong>.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1. Procedimento</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Cliente deve recusar o produto ou registrar a avaria no ato do recebimento</li>
                  <li>Comunicar imediatamente via WhatsApp com fotos da embalagem e produto</li>
                  <li>PMCELL São Paulo aciona a garantia junto à transportadora</li>
                  <li>Resolução conforme resultado da análise da transportadora</li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2. Importante</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Sempre fotografe a embalagem antes de abrir</li>
                  <li>Se possível, filme a abertura da embalagem</li>
                  <li>Comunique problemas em até 24 horas após recebimento</li>
                  <li>Guarde todos os materiais (embalagem, produto, acessórios)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Endereço para Devolução</h2>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📦 Envie para:</h3>
                <div className="text-gray-700">
                  <p><strong>PMCELL São Paulo (V.Zabin Tecnologia e Comércio)</strong></p>
                  <p>Rua Comendador Abdo Schahin, 62, Loja 4</p>
                  <p>Centro - São Paulo/SP</p>
                  <p>CEP: 01023-050</p>
                  <p className="mt-3 text-sm">
                    <strong>Importante:</strong> Inclua uma carta explicando o problema e seus dados de contato.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contato para Suporte</h2>
              
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💬 Fale Conosco</h3>
                <div className="text-blue-800">
                  <p><strong>WhatsApp:</strong> (11) 98132-6609</p>
                  <p><strong>Email:</strong> nycolas@pmcellsaopaulo.com.br</p>
                  <p><strong>Horário:</strong> Segunda a Sexta, das 8h às 18h</p>
                  <p className="mt-3 text-sm">
                    Para agilizar o atendimento, tenha em mãos o número do seu pedido.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações na Política</h2>
              <p>
                A PMCELL São Paulo reserva-se o direito de alterar esta política a qualquer momento. 
                As alterações serão publicadas nesta página com a data de atualização.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © 2025 PMCELL São Paulo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}