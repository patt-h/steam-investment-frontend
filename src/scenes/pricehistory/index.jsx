import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import AutoCompleteInput from "../../components/AutoCompleteInput";
import { fetchItemsData } from "../../components/ItemApi";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const PriceHistory = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchItemsData();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch items data", error);
            }
        };

        fetchData();
    }, []);

    const handleItemClick = (item) => {
        navigate(`/history/${item.marketHashName}`);
    };

    const handleAutocompleteClick = (item) => {
        navigate(`/history/${item}`);
    };

    return (
        <Box m="20px">
            <Header title="PRICE HISTORY" subtitle="Check price line chart of item" />
            
            <Box mt="20px">
                <Typography variant="h4">
                    Search for item:
                </Typography>
                <Box sx={{ width: '400px' }}>
                    <AutoCompleteInput onChange={(newValue) => handleAutocompleteClick(newValue)}/>
                </Box>
            </Box>

            <Typography variant="h4" mt="10px" mb="10px">
                Or check price history of your items:
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '5px',
                    maxHeight: '570px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {items.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        backgroundColor={colors.primary[400]}
                        sx={{
                            border: '1px solid #ccc',
                            padding: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                            width: '150px',
                            height: '180px',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100px',
                                marginBottom: '8px',
                            }}
                        >
                            <img
                                src={`https://api.steamapis.com/image/item/730/${item.marketHashName}`}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Box>

                        <Typography variant="body2">
                            {item.marketHashName}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PriceHistory;
