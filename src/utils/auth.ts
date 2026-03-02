export const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
};

export const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
};

export const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
