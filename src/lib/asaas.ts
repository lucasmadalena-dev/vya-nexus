const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

export const asaas = {
  async createCustomer(data: { name: string; email: string; cpfCnpj: string }) {
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async createSubscription(data: {
    customer: string;
    billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX';
    value: number;
    nextDueDate: string;
    cycle: 'MONTHLY';
    description: string;
  }) {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY || '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getSubscription(id: string) {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${id}`, {
      headers: {
        'access_token': ASAAS_API_KEY || '',
      },
    });
    return response.json();
  }
};
