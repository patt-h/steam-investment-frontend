export const fetchUserRecommendations = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/recommendations/get', {
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
