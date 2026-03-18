import api from '../config/api';

export const getMyTransactions = async () => {
  const res = await api.get('/api/transactions');
  return res.data.data;
};

export const createTransaction = async (data: {
  eventId: number;
  ticketTypeId?: number;
  quantity: number;
  voucherCode?: string;
  pointsUsed?: number;
}) => {
  const res = await api.post('/api/transactions', data);
  return res.data.data;
};

export const confirmPayment = async (id: number, paymentProof?: string) => {
  const res = await api.patch(`/api/transactions/${id}/pay`, { paymentProof });
  return res.data.data;
};

export const cancelTransaction = async (id: number) => {
  const res = await api.patch(`/api/transactions/${id}/cancel`);
  return res.data.data;
};
