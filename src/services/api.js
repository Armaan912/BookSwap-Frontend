import axios from "axios";

const API_BASE_URL =
	process.env.REACT_APP_API_URL ||
	"https://bookswap-backend-np9d.onrender.com/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json"
	}
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

// Auth API
export const authAPI = {
	login: (email, password) => api.post("/auth/login", { email, password }),
	register: (name, email, password) =>
		api.post("/auth/register", { name, email, password }),
	getProfile: () => api.get("/auth/profile")
};

// Books API
export const booksAPI = {
	getAllBooks: () => api.get("/books"),
	getBookById: (id) => api.get(`/books/${id}`),
	searchBooks: (params) => api.get("/books/search", { params }),
	createBook: (formData) =>
		api.post("/books", formData, {
			headers: { "Content-Type": "multipart/form-data" }
		}),
	updateBook: (id, formData) =>
		api.put(`/books/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" }
		}),
	deleteBook: (id) => api.delete(`/books/${id}`),
	getUserBooks: () => api.get("/books/my/books")
};

// Requests API
export const requestsAPI = {
	createRequest: (bookId, message) => {
		console.log("Creating request for book:", bookId, "with message:", message);
		return api.post("/requests", { book_id: bookId, message });
	},
	getReceivedRequests: () => {
		console.log("Fetching received requests...");
		return api.get("/requests/received");
	},
	getSentRequests: () => {
		console.log("Fetching sent requests...");
		return api.get("/requests/sent");
	},
	getRequestById: (id) => api.get(`/requests/${id}`),
	updateRequestStatus: (id, status) => {
		console.log("Updating request:", id, "to status:", status);
		return api.put(`/requests/${id}`, { status });
	},
	deleteRequest: (id) => api.delete(`/requests/${id}`)
};

export default api;
