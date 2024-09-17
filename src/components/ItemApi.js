export const fetchItemsData = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/item/all', {
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

export const addItemEntry = async (entry) => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8080/item/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
    });

    if (!response.ok) {
        throw new Error('Failed to add entry');
    }

    return response.json();
};

export const updateItemEntry = async (entry) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/item/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
    });

    if (!response.ok) {
        throw new Error('Failed to update entry');
    }

    return response.json();
};

export const deleteItemEntries = async (ids) => {
    const token = localStorage.getItem('token');

    const url = `http://localhost:8080/item/delete/${ids.join(',')}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete rows');
    }
};