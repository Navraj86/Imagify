'use client';

import { createContext, useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { dataUrlToObjectUrl, getErrorMessage, isAuthError } from "@/lib/api";

export const AppContext = createContext();

const noopSubscribe = () => () => {};
const MAX_HISTORY = 12;

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [authMode, setAuthMode] = useState('Login');
    const [redirectTo, setRedirectTo] = useState(null);
    const [token, setToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const [credit, setCredit] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [history, setHistory] = useState([]);

    // false during SSR and hydration, true afterwards, so the first client render matches the server
    const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
    const authLoading = !hydrated || (!!token && !user && !authChecked);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const router = useRouter();

    const clearSession = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setCredit(false);
        history.forEach(item => URL.revokeObjectURL(item.image));
        setHistory([]);
    };

    // Open the auth dialog; optionally continue to a page once the user is signed in
    const openAuth = (mode = 'Login', redirect = null) => {
        setAuthMode(mode);
        setRedirectTo(redirect);
        setShowLogin(true);
    };

    // For calls that need a session: a 401 means it expired, so sign out cleanly instead of showing a raw error
    const handleRequestError = (error, { promptSignIn = true } = {}) => {
        if (isAuthError(error)) {
            clearSession();
            toast.info(getErrorMessage(error));
            if (promptSignIn) openAuth('Login');
        } else {
            console.error(error);
            toast.error(getErrorMessage(error));
        }
    };

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', {
                headers: {
                    token: token
                }
            })

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            handleRequestError(error, { promptSignIn: false });
        } finally {
            setAuthChecked(true);
        }
    };

    const addToHistory = (entry) => {
        const next = [entry, ...history];
        next.slice(MAX_HISTORY).forEach(item => URL.revokeObjectURL(item.image));
        setHistory(next.slice(0, MAX_HISTORY));
    };

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {
                headers: {
                    token: token
                }
            })

            if (data.success) {
                setCredit(data.creditBalance);
                const image = await dataUrlToObjectUrl(data.resultImage).catch(() => data.resultImage);
                addToHistory({ id: Date.now(), prompt, image });
                return image
            } else {
                loadCreditsData();

                if (data.creditBalance === 0) {
                    toast.error("You're out of credits", { description: 'Buy more to keep generating.' });
                    router.push('/buy');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            handleRequestError(error);
        }
    };

    const completeAuth = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setShowLogin(false);

        if (redirectTo) {
            router.push(redirectTo);
            setRedirectTo(null);
        }
    };

    const logout = () => {
        clearSession();
        toast.success('Signed out');
    };

    useEffect(() => {
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadCreditsData();
        }
    }, [token]);

    return (
        <AppContext.Provider value={{
            user,
            showLogin,
            authMode,
            authLoading,
            token,
            credit,
            history,
            backendUrl,
            loadCreditsData,
            handleRequestError,
            logout,
            generateImage,
            openAuth,
            completeAuth,
            setUser,
            setShowLogin,
            setAuthMode,
            setToken,
            setCredit
        }}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;
