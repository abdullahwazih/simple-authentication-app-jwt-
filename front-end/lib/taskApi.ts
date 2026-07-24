

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
