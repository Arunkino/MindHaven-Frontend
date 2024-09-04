import axiosInstance from './axiosConfig';

const authService = {
  verifyToken: async (token) => {
    try {
      const response = await axiosInstance.post('/api/token/verify/', { token });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    }
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/login/', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await axiosInstance.post('/register/user/', userData);
    return response.data;
  },

  // No need for logout or getCurrentUser methods as these will be handled by Redux
};

export default authService;