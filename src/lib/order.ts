interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  specialPrice?: number;
  specialPriceMinQty?: number;
}

export function formatOrderMessage(items: OrderItem[], total: number): string {
  const header = "🛍️ *NOVO PEDIDO ATACADO*\n\n";
  
  const productsSection = "📦 *Produtos:*\n";
  
  const productsList = items.map(item => {
    const isSpecialPrice = item.specialPrice && item.specialPriceMinQty && 
                          item.quantity >= item.specialPriceMinQty;
    const unitPrice = isSpecialPrice ? item.specialPrice! : item.price;
    const itemTotal = unitPrice * item.quantity;
    
    let priceDisplay = `R$ ${itemTotal.toFixed(2).replace('.', ',')}`;
    
    // Adicionar indicação de preço especial
    if (isSpecialPrice) {
      const normalTotal = item.price * item.quantity;
      const savings = normalTotal - itemTotal;
      priceDisplay += ` _(economia R$ ${savings.toFixed(2).replace('.', ',')})_`;
    }
    
    return `• ${item.name} - ${item.quantity} unid - ${priceDisplay}`;
  }).join('\n');
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const summarySection = `\n\n📊 *Resumo:*\n` +
                        `Total de peças: ${totalItems}\n` +
                        `Valor total: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
  
  const footer = "✅ Pedido recebido!\n" +
                "Em breve entraremos em contato para confirmar e processar seu pedido.";
  
  return header + productsSection + productsList + summarySection + footer;
}