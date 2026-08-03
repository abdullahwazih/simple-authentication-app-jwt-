

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TASKS_API_URL = `${API_URL}/tasks`;

export const addTask = async (
    title: string,
    description: string,
    deadline: string,
) => {
    const res = await fetch(`${TASKS_API_URL}/add-task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description, deadline }),
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

    if (!res.ok) {
        return {
            error: data.error || `Request failed with status ${res.status}`,
        };
    }

    return data;
};

export const getTasks = async () => {
    const res = await fetch(`${TASKS_API_URL}/get-tasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

    if (!res.ok) {
        return {
            error: data.error || `Request failed with status ${res.status}`,
        };
    }

    return data;
}

export const updateTask = async (
    id: number,
    updates: { title?: string; description?: string; deadline?: string }
) => {
    const res = await fetch(`${TASKS_API_URL}/update-task/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

    if (!res.ok) {
        return {
            error: data.error || `Request failed with status ${res.status}`,
        };
    }

    return data;
};

// New function to toggle task completion

export const toggleTask = async (id: string) => {
    const res = await fetch(`${TASKS_API_URL}/toggle-task/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

    if (!res.ok) {
        return {
            error: data.error || `Request failed with status ${res.status}`,
        };
    }

    return data;
};



export const getWeeklyTasks = async () => {
    return fetch(`${TASKS_API_URL}/weekly`, { credentials: "include" })
        .then(res => res.json());
};

export const getMonthlyTasks = async () => {
    return fetch(`${TASKS_API_URL}/monthly`, { credentials: "include" })
        .then(res => res.json());
};

export const getYearlyTasks = async () => {
    return fetch(`${TASKS_API_URL}/yearly`, { credentials: "include" })
        .then(res => res.json());
};

export const getAllTasks = async () => {
    return fetch(`${TASKS_API_URL}/all`, { credentials: "include" })
        .then(res => res.json());
};

export const deleteTask = async (id: string) => {
    const res = await fetch(`${TASKS_API_URL}/delete-task/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        return { error: data.error };
    }

    return data;
};