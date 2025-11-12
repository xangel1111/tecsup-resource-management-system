import axiosClient from './axiosClient';

const usersApi = {
  getUserById: async () => {
    const response = await axiosClient.get(`/auth/user/${id}`);
    return response.data;
  },

  getUsers: async () => {
    const response = await axiosClient.get(`/auth/users/`);
    return response.data;
  },
};

export default usersApi;
