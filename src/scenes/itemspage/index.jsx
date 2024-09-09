import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItemsData } from '../../components/ItemApi';
import { fetchHistoryData, fetchHistoryTodayData } from '../../components/HistoryApi'; // Importuj funkcję fetchHistoryData
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area } from 'recharts';
import "./index.css";

const ItemsPage = () => {
    const [itemData, setItemData] = useState([]);
    const [historyData, setHistoryData] = useState({});
    const [historyTodayData, setHistoryTodayData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchItemsData();
                setItemData(data);
            } catch (err) {
                setError('Failed to fetch items data');
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        const fetchAllHistoryData = async () => {
            if (itemData.length > 0) {
                const historyPromises = itemData.map(item => fetchHistoryData(item.itemId));
                const results = await Promise.all(historyPromises);
                
                const historyMap = itemData.reduce((acc, item, index) => {
                    acc[item.itemId] = results[index];
                    return acc;
                }, {});
                
                setHistoryData(historyMap);
            }
        };

        fetchAllHistoryData();
    }, [itemData]);

    useEffect(() => {
        const fetchAllHistoryTodayData = async () => {
            if (itemData.length > 0) {
                const itemIds = itemData.map(item => item.itemId);
                const results = await fetchHistoryTodayData(itemIds);

                // Map results to object by itemId
                const historyTodayMap = results.reduce((acc, entry) => {
                    if (!acc[entry.itemId]) acc[entry.itemId] = [];
                    acc[entry.itemId].push(entry);
                    return acc;
                }, {});

                setHistoryTodayData(historyTodayMap);
            }
        };

        fetchAllHistoryTodayData();
    }, [itemData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTodayPrice = (data) => {
        if (data && data.length > 0) {
            const latestEntry = data[data.length - 1];
            return `${latestEntry.price.toFixed(2)}zł`;
        }
        return 'No data';
    };

    // Filtruj dane do ostatnich 30 dni
    const filterDataByLastMonth = (data) => {
        const now = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(now.getDate() - 30); // Ustaw datę na 30 dni wstecz

        return data.filter(entry => new Date(entry.date) >= lastMonth);
    };

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, price } = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${date}`}</p>
                    <p className="intro">{`Price: ${price.toFixed(2)}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <table className="table-container" id="investments-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Bought price</th>
                        <th>Current price</th>
                        <th>Gain / lose</th>
                        <th>Price chart</th>
                    </tr>
                </thead>
                <tbody>
                    {itemData.map(item => (
                        <tr key={item.id}>
                            <td id={`itemContainer${item.id}`}>
                                <img src={`https://api.steamapis.com/image/item/730/${item.marketHashName}`} style={{ width: '100px', height: 'auto', padding: '0px' }} />
                            </td>
                            <td><b>{item.marketHashName}</b></td>
                            <td>{item.quantity}</td>
                            <td>{item.price}zł</td>
                            <td style={{ padding: '0', textAlign: 'center' }}>
                                {historyTodayData[item.itemId] ? (
                                    <span>{formatTodayPrice(historyTodayData[item.itemId])}</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </td>
                            <td style={{
                                backgroundColor: isNaN(parseFloat(formatTodayPrice(historyTodayData[item.itemId]))) ? "gray" :
                                    item.price > parseFloat(formatTodayPrice(historyTodayData[item.itemId])) ? "#e93030" : "#4abf26"
                            }}>
                                <b>
                                    <span className="profit">
                                        {parseFloat(formatTodayPrice(historyTodayData[item.itemId])) * parseInt(item.quantity) - (parseFloat(item.price) * parseInt(item.quantity))}zł
                                    </span>
                                </b>
                            </td>
                            <td style={{ padding: '0', textAlign: 'center' }}>
                                {/* Renderuj wykres liniowy, jeśli dane historyczne są dostępne */}
                                {historyData[item.itemId] ? (
                                    <div style={{ width: '100%', height: '100px' }}> {/* Ustaw szerokość i wysokość kontenera */}
                                        <ResponsiveContainer width="80%" height="100%">
                                            <LineChart data={filterDataByLastMonth(historyData[item.itemId]).map(entry => ({
                                                date: formatDate(entry.date),
                                                price: entry.price
                                            }))}>
                                                <XAxis dataKey="date" />
                                                <YAxis dataKey="price" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line type="monotone" dataKey="price" stroke="#4abf26" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ItemsPage;
