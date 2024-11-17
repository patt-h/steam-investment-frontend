export const fetchUserSettings = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('https://steam-investment-helper-backend.azurewebsites.net/settings/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
    }

    return response.json();
};

export const updateUserSettings = async (entry) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`https://steam-investment-helper-backend.azurewebsites.net/settings/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
    });

    if (!response.ok) {
        throw new Error('Failed to update settings');
    }

    return response.json();
};
