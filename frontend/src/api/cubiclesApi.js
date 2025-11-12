import axiosClient from './axiosClient';

const cubiclesApi = {
  getAllCubicles: async () => {
    const response = await axiosClient.get('/cubicles/cubicles');
    return response.data;
  },

  getCubicleById: async (id) => {
    const response = await axiosClient.get(`/cubicles/cubicles/${id}`);
    return response.data;
  },

  createReservation: async (data) => {
    const response = await axiosClient.post('/cubicles/reservations/create', data);
    return response.data;
  },

  getAllReservations: async () => {
    const response = await axiosClient.get('/cubicles/reservations');
    return response.data;
  },

  getAllPending: async () => {
    const response = await axiosClient.get('/cubicles/reservations/pending');
    return response.data;
  },

  getAllNotPending: async () => {
    const response = await axiosClient.get('/cubicles/reservations/notpending');
    return response.data;
  },

  acceptReservation: async (id) => {
    const response = await axiosClient.put(`/cubicles/reservations/pending/${id}`);
    return response.data;
  },

  cancelReservation: async (data) => {
    const response = await axiosClient.delete('/cubicles/reservations/delete', { data });
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/cubicles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/cubicles/${id}`);
    return response.data;
  },
};

export default cubiclesApi;
