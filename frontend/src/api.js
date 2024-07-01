import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:8501",
});

export default api;