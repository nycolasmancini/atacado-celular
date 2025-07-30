import { prisma } from '@/lib/prisma'

async function getRecentLeads() {
  const leads = await prisma.trackingEvent.findMany({
    where: {
      eventType: 'whatsapp_submitted',
      phoneNumber: {
        not: null
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    select: {
      phoneNumber: true,
      createdAt: true,
      metadata: true
    }
  })

  return leads
}

export async function RecentLeads() {
  const leads = await getRecentLeads()

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Últimos WhatsApps</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fonte
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Nenhum WhatsApp capturado ainda
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lead.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(lead.metadata as any)?.source || 'Landing Page'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {leads.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <a
            href="/admin/leads"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Ver todos →
          </a>
        </div>
      )}
    </div>
  )
}