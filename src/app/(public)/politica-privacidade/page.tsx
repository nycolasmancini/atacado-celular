import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - PMCELL São Paulo",
  description: "Política de Privacidade da PMCELL São Paulo - Saiba como protegemos seus dados pessoais.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Criada em:</strong> 15 de julho de 2020<br/>
              <strong>Última atualização:</strong> 12 de abril de 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações Gerais</h2>
              <p className="mb-4">
                A PMCELL São Paulo (V.Zabin Tecnologia e Comércio), pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 29.734.462/0003-86, 
                localizada na Rua Comendador Abdo Schahin, 62, Loja 4, CEP 01023-050, Centro, São Paulo/SP, 
                está comprometida com a proteção dos dados pessoais de seus usuários e clientes.
              </p>
              <p>
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
                suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Dados Coletados</h2>
              <p className="mb-4">Coletamos os seguintes tipos de dados pessoais:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Dados de Contato:</strong> Número de WhatsApp fornecido voluntariamente para atendimento comercial</li>
                <li><strong>Dados de Navegação:</strong> Informações coletadas automaticamente através de cookies e tecnologias similares</li>
                <li><strong>Dados de Analytics:</strong> Informações sobre o uso do site, páginas visitadas, tempo de permanência e interações</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Finalidade do Tratamento</h2>
              <p className="mb-4">Utilizamos seus dados pessoais para as seguintes finalidades:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Atendimento comercial via WhatsApp</li>
                <li>Envio de catálogos e informações sobre produtos</li>
                <li>Processamento de pedidos e orçamentos</li>
                <li>Melhoria da experiência do usuário no site</li>
                <li>Análise de desempenho e otimização do site</li>
                <li>Cumprimento de obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Base Legal</h2>
              <p className="mb-4">O tratamento dos seus dados pessoais é baseado nas seguintes hipóteses legais:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Consentimento:</strong> Para dados fornecidos voluntariamente, como número de WhatsApp</li>
                <li><strong>Legítimo Interesse:</strong> Para análise de dados de navegação e melhoria dos serviços</li>
                <li><strong>Execução de Contrato:</strong> Para processamento de pedidos e prestação de serviços</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies e Tecnologias Similares</h2>
              <p className="mb-4">
                Nosso site utiliza cookies e tecnologias similares para melhorar sua experiência de navegação:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site</li>
                <li><strong>Cookies de Analytics:</strong> Google Analytics para análise de tráfego e comportamento</li>
                <li><strong>Cookies de Marketing:</strong> Meta Pixel para otimização de campanhas publicitárias</li>
              </ul>
              <p>
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Compartilhamento de Dados</h2>
              <p className="mb-4">
                A PMCELL São Paulo <strong>não compartilha</strong> seus dados pessoais com terceiros, exceto nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para prestadores de serviços técnicos essenciais (hospedagem, analytics)</li>
                <li>Com seu consentimento expresso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Armazenamento e Segurança</h2>
              <p className="mb-4">
                Seus dados pessoais são armazenados de forma segura e protegidos por medidas técnicas e administrativas apropriadas:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controle de acesso restrito às informações</li>
                <li>Monitoramento constante de segurança</li>
                <li>Backups regulares e seguros</li>
              </ul>
              <p>
                <strong>Retenção de Dados:</strong> Seus dados serão mantidos pelo tempo necessário para 
                cumprir as finalidades descritas nesta política ou conforme exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Seus Direitos</h2>
              <p className="mb-4">Conforme a LGPD, você possui os seguintes direitos:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Acesso:</strong> Solicitar informações sobre o tratamento dos seus dados</li>
                <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou inexatos</li>
                <li><strong>Eliminação:</strong> Solicitar a exclusão dos seus dados pessoais</li>
                <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento dos seus dados</li>
                <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
              </ul>
              <p>
                Para exercer seus direitos, entre em contato conosco através dos canais disponíveis na seção "Contato".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contato</h2>
              <p className="mb-4">
                Para questões relacionadas à proteção de dados pessoais, entre em contato:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p><strong>PMCELL São Paulo (V.Zabin Tecnologia e Comércio)</strong></p>
                <p>Email: nycolas@pmcellsaopaulo.com.br</p>
                <p>WhatsApp: (11) 98132-6609 ou (11) 911304693</p>
                <p>Endereço: Rua Comendador Abdo Schahin, 62, Loja 4, CEP 01023-050, Centro, São Paulo/SP</p>
                <p>Horário de atendimento: Segunda a Sexta, das 8h às 18h</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações na Política</h2>
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você 
                a revise regularmente. A data da última atualização está indicada no início deste documento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
              <p>
                Caso não consiga resolver questões relacionadas aos seus dados pessoais diretamente conosco, 
                você pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) através do site: 
                <a href="https://www.gov.br/anpd" className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noopener noreferrer">
                  www.gov.br/anpd
                </a>
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