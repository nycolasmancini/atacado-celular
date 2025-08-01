import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - PMCELL São Paulo",
  description: "Termos de Uso da PMCELL São Paulo - Condições para utilização dos nossos serviços e produtos.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Termos de Uso
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Criada em:</strong> 03 de setembro de 2020<br/>
              <strong>Última atualização:</strong> 28 de março de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações da Empresa</h2>
              <p className="mb-4">
                Os presentes Termos de Uso regulam a utilização dos serviços oferecidos pela 
                <strong> PMCELL São Paulo (V.Zabin Tecnologia e Comércio)</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 29.734.462/0003-86, 
                localizada na Rua Comendador Abdo Schahin, 62, Loja 4, CEP 01023-050, Centro, São Paulo/SP.
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda integralmente com estes termos e condições.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definições</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Site:</strong> Plataforma digital da PMCELL São Paulo para exibição de catálogo</li>
                <li><strong>Cliente:</strong> Pessoa física ou jurídica que utiliza nossos serviços</li>
                <li><strong>Produtos:</strong> Acessórios para celular comercializados pela PMCELL São Paulo</li>
                <li><strong>Atacado:</strong> Venda com pedido mínimo de 30 peças</li>
                <li><strong>Distribuidor:</strong> Cliente que compra produtos em caixa fechada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Uso do Site</h2>
              <p className="mb-4">O site da PMCELL São Paulo destina-se exclusivamente a:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Consulta do catálogo de produtos</li>
                <li>Visualização de preços e especificações</li>
                <li>Contato comercial via WhatsApp</li>
                <li>Informações sobre a empresa</li>
              </ul>
              <p>
                É vedado o uso do site para finalidades ilícitas, que violem direitos de terceiros 
                ou que possam danificar a imagem da PMCELL São Paulo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Produtos e Preços</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1. Catálogo</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Os preços exibidos no catálogo online são <strong>finais para vendas no atacado</strong></li>
                  <li>Distribuidores que adquirem produtos em caixa fechada possuem catálogo específico com preços diferenciados</li>
                  <li>Todos os produtos possuem certificação ANATEL quando aplicável</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2. Disponibilidade</h3>
                <p>
                  A disponibilidade dos produtos está sujeita ao estoque. A PMCELL São Paulo reserva-se o direito 
                  de alterar ou descontinuar produtos sem aviso prévio.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Pedidos e Compras</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1. Processo de Compra</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Cliente consulta o catálogo no site</li>
                  <li>Contato via WhatsApp para realizar pedido</li>
                  <li>PMCELL São Paulo confirma disponibilidade e valor total</li>
                  <li>Envio dos dados de pagamento via WhatsApp</li>
                  <li>Após confirmação do pagamento, produtos são enviados</li>
                  <li>Código de rastreamento enviado via WhatsApp</li>
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2. Pedido Mínimo</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="font-semibold">
                    Pedido mínimo: <strong>30 peças no total</strong>
                  </p>
                  <p className="text-sm mt-2">
                    Não é necessário que sejam 30 unidades do mesmo produto. 
                    O mínimo refere-se à quantidade total de itens no pedido.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3. Formas de Pagamento</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>PIX:</strong> Pagamento instantâneo</li>
                  <li><strong>Cartão de Crédito/Débito:</strong> Mediante aprovação</li>
                  <li><strong>Dinheiro:</strong> Apenas para compras presenciais na loja física</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Entrega</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1. Cobertura</h3>
                <p>Realizamos entregas para <strong>todo o Brasil</strong> através de parceiros logísticos.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2. Transportadoras</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Lalamove</li>
                  <li>Melhor Envio</li>
                  <li>Ônibus (linhas rodoviárias)</li>
                  <li>Correios</li>
                  <li>Outras transportadoras conforme região</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3. Prazo e Responsabilidade</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Os prazos de entrega são estimados e podem variar conforme a região</li>
                  <li>A PMCELL São Paulo não se responsabiliza por atrasos causados pelas transportadoras</li>
                  <li>O código de rastreamento será fornecido via WhatsApp</li>
                  <li>Cliente deve conferir a mercadoria no momento do recebimento</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Garantia</h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="font-semibold">
                  Garantia: <strong>90 dias</strong> para todos os produtos
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1. Cobertura da Garantia</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Cobre:</strong> Defeitos de fabricação</li>
                  <li><strong>NÃO cobre:</strong> Mal uso, danos físicos, desgaste natural, oxidação por umidade</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2. Como Acionar a Garantia</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Entre em contato via WhatsApp</li>
                  <li>Informe o número do pedido e descrição do problema</li>
                  <li>Envie fotos/vídeos comprovando o defeito</li>
                  <li>Aguarde análise e orientações da equipe técnica</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cancelamentos</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="font-semibold">
                  IMPORTANTE: Pedidos <strong>não podem ser cancelados após o envio</strong>
                </p>
              </div>

              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Cancelamentos são aceitos apenas antes do envio da mercadoria</li>
                <li>Após o envio, aplicam-se as regras de garantia e troca</li>
                <li>Para cancelamento, entre em contato imediatamente via WhatsApp</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsabilidades</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1. Da PMCELL São Paulo</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Fornecer produtos conforme especificações</li>
                  <li>Cumprir prazos de envio (não de entrega)</li>
                  <li>Prestar suporte durante o período de garantia</li>
                  <li>Manter sigilo das informações do cliente</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2. Do Cliente</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Fornecer informações corretas para entrega</li>
                  <li>Efetuar pagamento conforme acordado</li>
                  <li>Conferir mercadoria no recebimento</li>
                  <li>Utilizar produtos conforme especificações</li>
                  <li>Comunicar problemas dentro do prazo de garantia</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todos os direitos sobre o site, catálogo, imagens, textos e demais conteúdos 
                pertencem à PMCELL São Paulo. É vedada a reprodução sem autorização prévia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p><strong>PMCELL São Paulo (V.Zabin Tecnologia e Comércio)</strong></p>
                <p>Email: nycolas@pmcellsaopaulo.com.br</p>
                <p>WhatsApp: (11) 98132-6609</p>
                <p>Endereço: Rua Comendador Abdo Schahin, 62, Loja 4, CEP 01023-050, Centro, São Paulo/SP</p>
                <p>Horário de atendimento: Segunda a Sexta, das 8h às 18h</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Alterações nos Termos</h2>
              <p>
                A PMCELL São Paulo reserva-se o direito de alterar estes termos a qualquer momento. 
                As alterações serão publicadas nesta página com a data de atualização.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Foro</h2>
              <p>
                Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias 
                oriundas da relação comercial entre as partes.
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