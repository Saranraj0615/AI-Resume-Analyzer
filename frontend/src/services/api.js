import axios from "axios";
const API = axios.create({
  baseURL: "https://ai-resume-analyzer-31is-3wbaiovnk-saran-raj-s.vercel.app",
});

export const analyzeResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};