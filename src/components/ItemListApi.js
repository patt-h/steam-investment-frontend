export const fetchItems = async (query) => {
    const token = localStorage.getItem('token');

    try {
        const url = `https://steam-investment-helper-backend.azurewebsites.net/items/search?prefix=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};
