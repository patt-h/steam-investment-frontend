export const login = async (credentials) => {
    const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};

export const verifyToken = async (token) => {
    const response = await fetch('http://localhost:8080/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });

    if (!response.ok) {
        throw new Error('Token verification failed');
    }

    return response.json();
};