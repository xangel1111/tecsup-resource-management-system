import axiosClient from './axiosClient';

const loansApi = {
  getAllTools: async () => {
    const response = await axiosClient.get('/loans/equipments');
    return response.data;
  },

  getAllLoans: async () => {
    const response = await axiosClient.get('/loans/loans');
    return response.data;
  },

  getPendingLoans: async () => {
    const response = await axiosClient.get('/loans/loans/pending');
    return response.data;
  },

  getNotPendingLoans: async () => {
    const response = await axiosClient.get('/loans/loans/notpending');
    return response.data;
  },

  getHistoryLoans: async () => {
    const response = await axiosClient.get('/loans/loans/notpending');
    return response.data;
  },

  createReservation: async (data) => {
    const response = await axiosClient.post('/loans/loans', data);
    return response.data;
  },

  cancelLoan: async (id) => {
    const response = await axiosClient.delete(`/loans/loans/${id}`);
    return response.data;
  },

  acceptLoan: async (id) => {
    const response = await axiosClient.put(`/loans/loans/accept/${id}`);
    return response.data;
  },
};

export default loansApi;
