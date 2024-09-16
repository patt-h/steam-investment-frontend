import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItemsData } from '../../components/ItemApi';
import { fetchHistoryData, fetchHistoryTodayData } from '../../components/HistoryApi'; // Importuj funkcję fetchHistoryData
import { Box, Typography, useTheme, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

import { tokens } from "../../theme";

const ItemsPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [itemData, setItemData] = useState([]);
    const [historyData, setHistoryData] = useState({});
    const [historyTodayData, setHistoryTodayData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newEntry, setNewEntry] = useState({ description: '', amount: 0, transactionDate: '', category: '' });
    const [totalAmount, setTotalAmount] = useState(0);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDialog = () => setOpenDialog(false);

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
    

    const columns = [
        { field: "picture", headerName: "Item", editable: false, resizable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <img
                        src={`https://api.steamapis.com/image/item/730/${params.row.marketHashName}`}
                        alt={params.row.marketHashName}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            ), 
        },
        { field: "marketHashName", headerName: "Name", minWidth: 450, editable: false, cellClassName: "name-column--cell", resizable: false },
        { field: "quantity", headerName: "Quantity", type: "number", editable: true, resizable: false },
        { field: "price", headerName: "Bought price", type: "number", minWidth: 150, editable: true, resizable: false,
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
        { field: "priceChart", headerName: "Price chart", minWidth: 150, flex: 1, editable: false, resizable: false,
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
                    <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={chartData}>
                            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
                            <Tooltip content={<CustomTooltip />}/>
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
                    // Pobieranie danych historycznych dla każdego itema
                    const historyPromises = itemData.map(item => fetchHistoryData(item.itemId));
                    const results = await Promise.all(historyPromises);
    
                    // Mapowanie wyników do obiektu
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

    const formatTodayPrice = (data) => {
        if (data && data.length > 0) {
            const latestEntry = data[data.length - 1];
            return `${latestEntry.price.toFixed(2)} USD`;
        }
        return 'No data';
    };

    const currencyConversionRates = {
        USD: 1, // Bazowa waluta
        PLN: 3.86086, // Kurs PLN -> USD
        EUR: 0.901781 // Kurs EUR -> USD
    };
    
    const convertToUSD = (amount, currency) => {
        const rate = currencyConversionRates[currency] || 1; // Jeżeli nie ma przelicznika, zwróć 1 (domyślnie USD)
        return amount / rate;
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" component="div">
                    Total income: <b>{totalAmount}</b>
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
                    <Button variant="contained" color="primary" /* onClick={handleDelete} disabled={selectedRows.length === 0} */ sx={{
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
                    /* onRowSelectionModelChange={(itm) => setSelectedRows(itm)}
                    processRowUpdate={processRowUpdate} */
                    experimentalFeatures={{ newEditingApi: true }}
                    initialState={{
                        sorting: {
                          sortModel: [{ field: 'gainlose', sort: 'desc' }],
                        },
                    }}
                    autoHeight
                    
                />
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: colors.primary[400],
                    border: "2px solid rgba(255, 255, 255, .2)",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h2">
                        Add New Income
                    </Typography>
                    <TextField
                        fullWidth
                        label="Description"
                        value={newEntry.description}
                        onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={newEntry.amount}
                        onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        value={newEntry.transactionDate}
                        onChange={(e) => setNewEntry({ ...newEntry, transactionDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        value={newEntry.category}
                        onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                        margin="normal"
                    />
                    <Box sx={{
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
                    <Button variant="contained" color="primary" /* onClick={handleAddEntry} */ sx={{
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
                    <Button /* onClick={confirmDelete} */ color="primary" sx={{
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
