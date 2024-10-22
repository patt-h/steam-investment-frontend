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

export const register = async (userData) => {
    const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: userData.email,
            username: userData.username,
            password: userData.password
        }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response;
};

export const confirmAccount = async (token) => {
    const response = await fetch(`http://localhost:8080/confirm-account?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Account confirmation failed');
    }

    return response.json();
};

export const resendToken = async (token) => {
    const response = await fetch(`http://localhost:8080/resend-token?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Token resend failed');
    }

    return response.json();
}