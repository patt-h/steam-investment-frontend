import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItemsData, addItemEntry, updateItemEntry, deleteItemEntries } from '../../components/ItemApi';
import { fetchHistoryData, fetchHistoryTodayData } from '../../components/HistoryApi';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import { Box, Typography, useTheme, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, FormControl, InputLabel, MenuItem, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import Header from "../../components/Header";
import { Delete } from '@mui/icons-material';

import { tokens } from "../../theme";

const ItemsPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [itemData, setItemData] = useState([]);
    const [historyData, setHistoryData] = useState({});
    const [historyTodayData, setHistoryTodayData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("USD");

    const [openModal, setOpenModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDialog = () => setOpenDialog(false);

    const [rows, setRows] = useState([
        { marketHashName: "", price: 0, currency: "USD", quantity: 1 },
    ]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { date, price } = payload[0].payload;
            return (
                <div style={{
                    color: 'rgba(0, 0, 0, 0.8)',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '5px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '85px',
                    fontSize: '0.75rem',
                    lineHeight: '1.2'
                }}>
                    <p style={{ fontWeight: 'bold', margin: '0', marginBottom: '2px'}}>
                        {`${date}`}
                    </p>
                    <p style={{ margin: '0' }}>
                        {`Price: ${price.toFixed(2)} USD`}
                    </p>
                </div>
            );
        }
    
        return null;
    };

    const handleAddItems = async () => {
        try {
            await addItemEntry(rows);
            handleCloseModal();
            window.location.reload();
        } catch (error) {
            console.error("Error adding items:", error);
        }
    };

    const handleDelete = async () => {
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteItemEntries(selectedRows);
            setItemData(prevData => prevData.filter(row => !selectedRows.includes(row.id)));
            setSelectedRows([]);
            setOpenDialog(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const processRowUpdate = async (newRow, oldRow) => {
        try {
            await updateItemEntry(newRow);
            setItemData((prevData) => prevData.map((row) => (row.id === newRow.id ? newRow : row)));
            return newRow;
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update entry');
            return oldRow;
        }
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        setRows([
            ...rows,
            { marketHashName: "", price: 0, currency: selectedCurrency, quantity: 1 }
        ]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };
    

    const columns = [
        { field: "picture", headerName: "Item", editable: false, resizable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <img
                        src={`https://api.steamapis.com/image/item/730/${params.row.marketHashName}`}
                        alt={params.row.marketHashName}
                        style={{ width: '90%', height: '100%' }}
                    />
                </div>
            ), 
        },
        { field: "marketHashName", headerName: "Name", minWidth: 350, editable: false, cellClassName: "name-column--cell", resizable: false },
        { field: "quantity", headerName: "Quantity", type: "number", editable: true, resizable: false },
        { field: "price", headerName: "Purchase price", type: "number", minWidth: 150, editable: true, resizable: false,
            renderCell: (params) => {
                const amount = params.value;
                const currency = params.row.currency || "USD";
                const convertedAmount = convertToUSD(amount, currency);
                return `${convertedAmount.toFixed(2)} USD`;
            }    
        },
        { field: "currentPrice", headerName: "Current price", type: "number", minWidth: 150, editable: false, resizable: false,
            renderCell: (params) => {
                const todayPriceData = historyTodayData[params.row.itemId];
                return todayPriceData ? formatTodayPrice(todayPriceData) : 'No data';
            },    
        },
        { field: "gainlose", headerName: "Gain / lose", type: "number", minWidth: 150, editable: false, resizable: false,     
            renderCell: (params) => {
                const todayPrice = parseFloat(formatTodayPrice(historyTodayData[params.row.itemId]));
                const quantity = parseInt(params.row.quantity);
                const boughtPrice = convertToUSD(parseFloat(params.row.price), params.row.currency || "USD");
        
                const gainLose = (todayPrice * quantity) - (boughtPrice * quantity);
        
                const color = gainLose >= 0 ? colors.greenAccent[500] : colors.redAccent[500];
        
                return (
                    <span style={{ color }}>
                        {gainLose.toFixed(2)} USD
                    </span>
                );
            }
        },

        { field: "7change", headerName: "7d change", type: "number",
            renderCell: (params) => {
                const history = historyData[params.row.itemId];
                if (!history) return 'No data';
                
                const percentageChange = calculatePercentageChange(history, 7);
                return percentageChange !== null ? `${percentageChange}%` : 'No data';
            }
        },
        { field: "30change", headerName: "30d change", type: "number",
            renderCell: (params) => {
                const history = historyData[params.row.itemId];
                if (!history) return 'No data';
                
                const percentageChange = calculatePercentageChange(history, 30);
                return percentageChange !== null ? `${percentageChange}%` : 'No data';
            } 
        },
        { field: "priceChart", headerName: "Price chart (last 30 days)", minWidth: 150, flex: 1, editable: false, resizable: false,
            renderCell: (params) => {
                const history = historyData[params.row.itemId];
                
                if (!history || history.length === 0) {
                    return <span>No data</span>;
                }

                const now = new Date();
                const last30Days = new Date();
                last30Days.setDate(now.getDate() - 30);
            
                const filteredHistory = history.filter(entry => {
                    const entryDate = new Date(entry.date);
                    return entryDate >= last30Days;
                });
            
                if (filteredHistory.length === 0) {
                    return <span>No data</span>;
                }
            
                const chartData = filteredHistory.map(entry => ({
                    date: new Date(entry.date).toLocaleDateString(),
                    price: entry.price
                }));
            
                return (
                    <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={chartData}>
                            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
                            <Tooltip content={<CustomTooltip />}/>
                            <YAxis 
                                domain={['dataMin', 'dataMax']}
                                axisLine={false}
                                tick={false}
                                width={0}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );
            }
        }
    ];


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
                try {
                    const historyPromises = itemData.map(item => fetchHistoryData(item.itemId));
                    const results = await Promise.all(historyPromises);
    
                    const historyMap = results.reduce((acc, history) => {
                        history.forEach(entry => {
                            if (!acc[entry.itemId]) acc[entry.itemId] = [];
                            acc[entry.itemId].push(entry);
                        });
                        return acc;
                    }, {});

                    setHistoryData(historyMap);
                } catch (err) {
                    setError('Failed to fetch history data');
                }
            }
        };
        
        fetchAllHistoryData();
    }, [itemData]);
    

    useEffect(() => {
        const fetchAllHistoryTodayData = async () => {
            if (itemData.length > 0) {
                const itemIds = itemData.map(item => item.itemId);
                const results = await fetchHistoryTodayData(itemIds);

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

    useEffect(() => {
        if (itemData.length > 0 && Object.keys(historyTodayData).length > 0) {
            calculateTotalIncome();
        }
    }, [itemData, historyTodayData]);

    const formatTodayPrice = (data) => {
        if (data && data.length > 0) {
            const latestEntry = data[data.length - 1];
            return `${latestEntry.price.toFixed(2)} USD`;
        }
        return 'No data';
    };

    const currencyConversionRates = {
        USD: 1,
        PLN: 3.86086, // PLN -> USD
        EUR: 0.901781 // EUR -> USD
    };
    
    const convertToUSD = (amount, currency) => {
        const rate = currencyConversionRates[currency] || 1;
        return amount / rate;
    };

    const calculateTotalIncome = () => {
        let total = 0;
        itemData.forEach((item) => {
            const todayPrice = parseFloat(formatTodayPrice(historyTodayData[item.itemId]));
            const quantity = parseInt(item.quantity);
            const boughtPrice = convertToUSD(parseFloat(item.price), item.currency || "USD");
    
            const gainLose = (todayPrice * quantity) - (boughtPrice * quantity);
            total += gainLose;
        });
        setTotalAmount(total.toFixed(2));
    };

    const calculatePercentageChange = (history, days) => {
        const now = new Date();
        const targetDate = new Date();
        targetDate.setDate(now.getDate() - days);
    
        const currentPrice = history[history.length - 1]?.price;
    
        const targetPriceData = history
            .slice()
            .reverse()
            .find(entry => new Date(entry.date) <= targetDate);
    
        if (!targetPriceData || !currentPrice) {
            return null;
        }
    
        const targetPrice = targetPriceData.price;
    
        if (targetPrice === 0) {
            return null;
        }
    
        const percentageChange = ((currentPrice - targetPrice) / targetPrice) * 100;
    
        return percentageChange.toFixed(2);
    };

    return (
        <Box m="20px">
            <Header title="INVESTMENTS" subtitle="List of all your investments" />
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" component="div">
                Total profit:{" "}
                <span style={{ color: totalAmount >= 0 ? colors.greenAccent[500] : colors.redAccent[500] }}>
                    <b>{totalAmount} USD</b>
                </span>
            </Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{
                        backgroundColor: colors.greenAccent[600],
                        '&:hover': {
                            backgroundColor: colors.greenAccent[500],
                        }
                    }}>
                        Add New
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleDelete} disabled={selectedRows.length === 0} sx={{
                        backgroundColor: colors.redAccent[600],
                        '&:hover': {
                            backgroundColor: colors.redAccent[500],
                        },
                        marginLeft: "20px"
                    }}>
                        Delete Selected
                    </Button>
                </Box>
            </Box>
            <Box m="20px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                    fontSize: "16px"
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeader": {
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400]
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[100]} !important`
                }
            }}>
                <DataGrid
                    rows={itemData}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={(itm) => setSelectedRows(itm)}
                    processRowUpdate={processRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                    initialState={{
                        sorting: {
                          sortModel: [{ field: 'marketHashName', sort: 'asc' }],
                        },
                    }}
                    
                />
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900,
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    backgroundColor: colors.primary[400],
                    border: "2px solid rgba(255, 255, 255, .2)",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h2" gutterBottom>
                        Add new items
                    </Typography>
                    
                    {rows.map((row, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <AutoCompleteInput
                                value={row.marketHashName}
                                onChange={(newValue) => handleRowChange(index, "marketHashName", newValue)}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={row.price}
                                onChange={(e) => handleRowChange(index, "price", parseFloat(e.target.value))}
                                margin="normal"
                                fullWidth
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Currency</InputLabel>
                                <Select
                                    value={row.currency}
                                    onChange={(e) => {
                                        handleRowChange(index, "currency", e.target.value);
                                        setSelectedCurrency(e.target.value); // Set selected currency
                                    }}
                                    label="Currency"
                                >
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="EUR">EUR</MenuItem>
                                    <MenuItem value="PLN">PLN</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={row.quantity}
                                onChange={(e) => handleRowChange(index, "quantity", parseInt(e.target.value))}
                                margin="normal"
                                fullWidth
                            />
                            <IconButton onClick={() => handleRemoveRow(index)} sx={{ marginTop: "8px" }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    ))}

                    <Button variant="contained" color="primary" onClick={handleAddRow} sx={{
                        backgroundColor: colors.blueAccent[700],
                        marginBottom: "16px",
                        '&:hover': {
                            backgroundColor: colors.blueAccent[500],
                        }
                    }}>
                        Add More Items
                    </Button>


                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: "15px" 
                    }}>
                        <Button variant="contained" color="primary" onClick={handleCloseModal} sx={{
                            backgroundColor: colors.redAccent[700],
                            '&:hover': {
                                backgroundColor: colors.redAccent[600],
                            }
                        }}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleAddItems} sx={{
                            backgroundColor: colors.greenAccent[700],
                            marginLeft: "10px",
                            '&:hover': {
                                backgroundColor: colors.greenAccent[500],
                            }
                        }}>
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle variant="h4">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText variant="h5">
                        Are you sure you want to delete the selected rows? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" sx={{
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                            backgroundColor: colors.primary[300],
                        }
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary" sx={{
                        backgroundColor: colors.redAccent[500],
                        '&:hover': {
                            backgroundColor: colors.redAccent[400],
                        }
                    }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ItemsPage;
