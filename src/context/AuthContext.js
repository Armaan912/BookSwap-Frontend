import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

const API_BASE_URL =
	process.env.REACT_APP_API_URL ||
	"https://bookswap-backend-np9d.onrender.com/api";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			// Optionally fetch user profile
			fetchProfile();
		} else {
			setLoading(false);
		}
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await axios.get("/auth/profile");
			const userData = response.data;
			// Ensure user object has both _id and id for compatibility
			setUser({
				...userData,
				id: userData._id || userData.id
			});
		} catch (error) {
			console.error("Error fetching profile:", error);
			logout();
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post("/auth/login", { email, password });
			const { token, user: userData } = response.data;
			// Ensure user object has both _id and id for compatibility
			const normalizedUser = {
				...userData,
				id: userData._id || userData.id
			};

			localStorage.setItem("token", token);
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(normalizedUser);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || "Login failed"
			};
		}
	};

	const register = async (name, email, password) => {
		try {
			const response = await axios.post("/auth/register", {
				name,
				email,
				password
			});
			const { token, user: userData } = response.data;
			// Ensure user object has both _id and id for compatibility
			const normalizedUser = {
				...userData,
				id: userData._id || userData.id
			};

			localStorage.setItem("token", token);
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(normalizedUser);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || "Registration failed"
			};
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
		setUser(null);
	};

	const value = {
		user,
		login,
		register,
		logout,
		loading
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
