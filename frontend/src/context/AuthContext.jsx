import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from './../api/axiosInstance';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Used to prevent flash
    const isAuthenticated = !!user;

    // Axios global config to send cookies
    axios.defaults.withCredentials = true;


    // Login
    const login = async ({ email, password }) => {
        try {
            const res = await axiosInstance.post(`/api/auth/login`, {
                email,
                password,
            });
            setUser(res.data.user);
            toast.success("Login successful");
        } catch (err) {
            throw new Error(err.response?.data?.message || "Login failed");
        }
    };

    // Signup
    const signup = async (formData) => {
        try {
            const res = await axiosInstance.post(`/api/auth/signup`, formData);
            setUser(res.data.user);
            toast.success("Account created");
        } catch (err) {
            throw new Error(err.response?.data?.message || "Signup failed");
        }
    };

    // Logout
    const logout = async () => {
        try {
            await axiosInstance.post(`/api/auth/logout`);
            setUser(null);
            toast.success("Logged out");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const getProjects = () => axiosInstance.get('/api/projects');
    const createProject = (name) => axiosInstance.post('/api/projects', { name });

    const getTasks = (projectId) => axiosInstance.get(`/api/tasks/${projectId}`);
    const createTask = (projectId, title, description) =>
        axiosInstance.post(`/api/tasks/${projectId}`, { title, description });

    const updateTask = (id, title, description) =>
        axiosInstance.put(`/api/tasks/${id}`, { title, description });

    const deleteTask = (id) => axiosInstance.delete(`/api/tasks/${id}`);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, loading, getProjects, createProject, getTasks, createTask, updateTask, deleteTask }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
