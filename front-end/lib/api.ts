const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_URL = `${API_URL}/auth`;


export const register = async (email: string, password: string) => {

    try {
        const res = await fetch(`${AUTH_API_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            }
        )

        const data = await res.json();
        if (!res.ok) {
            return {error : data.error  || "An error occurred during signup."};
        }

        return {success : true, ...data}
    } catch (error) {
        console.error("Error during signup:", error);
        return { error: "An error occurred during signup." };
    }
};


export const login = async (email: string, password: string) => {
    const res = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // 
        body: JSON.stringify({ email, password }),
    });

    return res.json();
};

export const getProfile = async () => {
    const res = await fetch(`${AUTH_API_URL}/profile`, {
        method: "GET",
        credentials: "include",
    });

    return res.json();
};

export const logout = async () => {
    const res = await fetch(`${AUTH_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    return res.json();
};
