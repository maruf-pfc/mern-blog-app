import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}` || "http://localhost:5000/api";

const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData);
  return response.data;
};

export default {
  getPosts,
  createPost,
};
