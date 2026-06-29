import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-resume-analyzer-31is-orvrb7k61-saran-raj-s.vercel.app",
});

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await API.post("/analyze", formData);

  return response.data;
};