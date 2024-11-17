export const fetchUserRecommendations = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('https://steam-investment-helper-backend.azurewebsites.net/recommendations/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
    }

    return response.json();
};
