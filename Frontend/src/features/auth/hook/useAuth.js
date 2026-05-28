import { useDispatch } from "react-redux";

import { login, register, getMe } from "../service/auth.api";

import {
    setUser,
    setLoading,
    setError,
} from "../auth.slice.js";

export function useAuth() {

    const dispatch = useDispatch();

    async function handleRegister({
        email,
        username,
        password,
    }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await register({
                email,
                username,
                password,
            });

            return data;

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.errors?.[0]?.message ||
                    "Registration failed"
                )
            );

            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({
        email,
        password,
    }) {
        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await login({
                email,
                password,
            });

            dispatch(setUser(data.user));

            return data;

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.errors?.[0]?.message ||
                    "Login failed"
                )
            );

            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getMe();

            dispatch(setUser(data.user));

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch user"
                )
            );

        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    };
}