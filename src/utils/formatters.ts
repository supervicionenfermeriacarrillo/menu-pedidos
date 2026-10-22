import { CartItem, CheckoutDetails, StoreInfo } from '../types';

export function formatPrice(amount: number, symbol: string = 'US$'): string {
  return `${symbol} ${amount.toFixed(2)}`;
}

export function calculateDiscount(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
  return pct > 0 ? pct : null;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  details: CheckoutDetails,
  store: StoreInfo,
  subtotal: number,
  shippingFee: number,
  total: number
): string {
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let orderTypeLabel = '🛵 Envío a domicilio';
  if (details.orderType === 'takeaway') orderTypeLabel = '🛍️ Retiro en local';
  if (details.orderType === 'dine_in') orderTypeLabel = `🍽️ Consumo en mesa ${details.tableNumber ? `(Mesa ${details.tableNumber})` : ''}`;

  let paymentLabel = '💵 Efectivo';
  if (details.paymentMethod === 'transfer') paymentLabel = '📲 Transferencia / Pago Digital';
  if (details.paymentMethod === 'card') paymentLabel = '💳 Tarjeta / POS';
  if (details.paymentMethod === 'other') paymentLabel = 'Otro';

  let msg = `👋 *¡Hola ${store.name}!* Quiero realizar el siguiente pedido:\n\n`;
  msg += `🧾 *ORDEN #${orderNumber}* (${timeString})\n`;
  msg += `─────────────────────────\n`;

  items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    msg += `• *${item.quantity}x* ${item.product.name} — ${formatPrice(itemTotal, store.currencySymbol)}\n`;
    if (item.notes && item.notes.trim() !== '') {
      msg += `   └ _Nota: ${item.notes.trim()}_\n`;
    }
  });

  msg += `─────────────────────────\n`;
  msg += `🏷️ *Subtotal:* ${formatPrice(subtotal, store.currencySymbol)}\n`;

  if (details.orderType === 'delivery') {
    if (shippingFee === 0) {
      msg += `🛵 *Costo de Envío:* ¡GRATIS! 🎉\n`;
    } else {
      msg += `🛵 *Costo de Envío:* ${formatPrice(shippingFee, store.currencySymbol)}\n`;
    }
  }

  msg += `💰 *TOTAL A PAGAR:* *${formatPrice(total, store.currencySymbol)}*\n\n`;

  msg += `👤 *DATOS DEL CLIENTE:*\n`;
  msg += `• *Nombre:* ${details.customerName || 'Cliente'}\n`;
  if (details.customerPhone) {
    msg += `• *Teléfono:* ${details.customerPhone}\n`;
  }
  msg += `• *Modalidad:* ${orderTypeLabel}\n`;

  if (details.orderType === 'delivery') {
    msg += `• *Dirección:* ${details.deliveryAddress || 'No especificada'}\n`;
  } else if (details.orderType === 'dine_in') {
    msg += `• *Mesa:* ${details.tableNumber || 'No especificada'}\n`;
  }

  msg += `• *Método de pago:* ${paymentLabel}\n`;
  if (details.paymentMethod === 'cash' && details.cashAmountToPay) {
    msg += `• *Paga con:* ${details.cashAmountToPay}\n`;
  }

  if (details.notes && details.notes.trim() !== '') {
    msg += `\n📝 *Instrucciones especiales:* ${details.notes.trim()}\n`;
  }

  msg += `\n🙏 ¡Quedo atento a la confirmación de mi pedido!`;

  return msg;
}

export function createWhatsAppLink(phone: string, text: string): string {
  // Clean phone number (only digits)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
