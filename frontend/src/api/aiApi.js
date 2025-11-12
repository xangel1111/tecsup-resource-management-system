import axiosClient from './axiosClient';

const aiApi = {
  sendMessage: async (body) => {
    const response = await axiosClient.post(`/openai/chat`, body);
    return response.data;
  },
};

export default aiApi;
