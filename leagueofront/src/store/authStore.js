import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    token: null,
    name: null,
    email: null,

    login: (token, name, email) => {
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        set({ token: token, name: name, email: email });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        set({ token: null, name: null, email: null });
    },

    charger: () => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        if (token) {
            set({ token: token, name: name, email: email });
        }
    },
}))