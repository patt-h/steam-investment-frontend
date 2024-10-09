export const fetchHistoryData = async (itemId) => {
    const token = localStorage.getItem('token');

    try {
        const url = `http://localhost:8080/history/all/id/${itemId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch history data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching history data:', error);
        return [];
    }
};

export const fetchHistoryDataByName = async (name) => {
    const token = localStorage.getItem('token');

    try {
        const url = `http://localhost:8080/history/all/name/${encodeURIComponent(name)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch history data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching history data:', error);
        return [];
    }
};


export const fetchHistoryTodayData = async (itemIds) => {
    const token = localStorage.getItem('token');

    try {
        const url = `http://localhost:8080/history/today/${itemIds.join(',')}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch history data for today');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching history data for today:', error);
        return [];
    }
};

export const fetchCurrentPrice = async (name) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/history/current/${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch current price');
    }

    return response.json();
};
