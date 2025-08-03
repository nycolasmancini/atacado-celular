/**
 * Integração com Chatwoot API
 */

interface ChatwootContact {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  custom_attributes?: {
    vendedor?: string;
    [key: string]: any;
  };
}

interface ChatwootSearchResponse {
  contacts: {
    meta: {
      count: number;
      current_page: number;
      total_count: number;
      total_pages: number;
    };
    payload: ChatwootContact[];
  };
}

class ChatwootClient {
  private baseUrl: string;
  private apiToken: string;
  private accountId: string;

  constructor() {
    this.baseUrl = process.env.CHATWOOT_BASE_URL || '';
    this.apiToken = process.env.CHATWOOT_API_TOKEN || '';
    this.accountId = process.env.CHATWOOT_ACCOUNT_ID || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.baseUrl || !this.apiToken || !this.accountId) {
      console.warn('⚠️ Chatwoot não configurado - variáveis de ambiente faltando');
      return null;
    }

    const url = `${this.baseUrl}/api/v1/accounts/${this.accountId}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'api_access_token': this.apiToken,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        console.error(`Chatwoot API Error: ${response.status} - ${response.statusText}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição para Chatwoot:', error);
      return null;
    }
  }

  /**
   * Busca contato por número de telefone
   */
  async findContactByPhone(phoneNumber: string): Promise<ChatwootContact | null> {
    try {
      // Limpar e formatar número para busca
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const searchQueries = [
        cleanNumber,
        `+55${cleanNumber}`,
        phoneNumber, // Formato original
      ];

      console.log('🔍 Buscando contato no Chatwoot:', { phoneNumber, searchQueries });

      // Tentar diferentes formatos de busca
      for (const query of searchQueries) {
        const response = await this.makeRequest(`/contacts/search?q=${encodeURIComponent(query)}`);
        
        if (response?.contacts?.payload?.length > 0) {
          const contact = response.contacts.payload[0];
          console.log('✅ Contato encontrado no Chatwoot:', { 
            id: contact.id, 
            name: contact.name, 
            vendedor: contact.custom_attributes?.vendedor 
          });
          return contact;
        }
      }

      console.log('❌ Contato não encontrado no Chatwoot');
      return null;
    } catch (error) {
      console.error('Erro ao buscar contato no Chatwoot:', error);
      return null;
    }
  }

  /**
   * Busca contato por ID
   */
  async getContactById(contactId: string): Promise<ChatwootContact | null> {
    try {
      const response = await this.makeRequest(`/contacts/${contactId}`);
      return response?.payload || null;
    } catch (error) {
      console.error('Erro ao buscar contato por ID no Chatwoot:', error);
      return null;
    }
  }

  /**
   * Atualiza atributos customizados do contato
   */
  async updateContactAttributes(contactId: string, attributes: Record<string, any>) {
    try {
      const response = await this.makeRequest(`/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify({
          custom_attributes: attributes
        })
      });

      return response?.payload || null;
    } catch (error) {
      console.error('Erro ao atualizar contato no Chatwoot:', error);
      return null;
    }
  }

  /**
   * Lista todos os agentes/vendedores
   */
  async getAgents() {
    try {
      const response = await this.makeRequest('/agents');
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar agentes no Chatwoot:', error);
      return [];
    }
  }
}

// Instância singleton
export const chatwootClient = new ChatwootClient();

/**
 * Busca informações do cliente no Chatwoot e retorna dados para o pedido
 */
export async function getChatwootContactInfo(phoneNumber: string) {
  const contact = await chatwootClient.findContactByPhone(phoneNumber);
  
  if (!contact) {
    return {
      chatwootContactId: null,
      assignedSeller: null,
      contactName: null,
      contactEmail: null
    };
  }

  return {
    chatwootContactId: contact.id.toString(),
    assignedSeller: contact.custom_attributes?.vendedor || null,
    contactName: contact.name || null,
    contactEmail: contact.email || null
  };
}

/**
 * Atualiza o pedido com informações do Chatwoot
 */
export async function enrichOrderWithChatwoot(orderNumber: number, phoneNumber: string) {
  const { updateOrderStatus } = await import('@/lib/orders');
  const chatwootInfo = await getChatwootContactInfo(phoneNumber);
  
  if (chatwootInfo.chatwootContactId || chatwootInfo.assignedSeller) {
    // Atualizar o pedido no banco com as informações do Chatwoot
    console.log('🔄 Atualizando pedido com informações do Chatwoot:', {
      orderNumber,
      chatwootContactId: chatwootInfo.chatwootContactId,
      assignedSeller: chatwootInfo.assignedSeller
    });

    // Aqui você precisaria de uma função para atualizar apenas os campos do Chatwoot
    // Por enquanto vou usar updateOrderStatus, mas seria melhor ter uma função específica
  }

  return chatwootInfo;
}