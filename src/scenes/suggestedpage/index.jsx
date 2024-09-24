import { Box, useTheme, Typography, Button } from "@mui/material";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { fetchUserRecommendations } from "../../components/RecommendationApi";
import HistoryIcon from '@mui/icons-material/History';

import { tokens } from "../../theme";

const SuggestedPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const data = await fetchUserRecommendations();
                setRecommendations(data); // Zakładam, że data to tablica rekomendacji
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            }
        };

        getRecommendations();
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="SUGGESTED ITEMS" subtitle="Based on what you already own" />
            </Box>

            <Box display="flex" justifyContent="center" mb={2}>
                <Typography variant="h4">Always think carefully about your financial decisions, the following items are not a guarantee of profit</Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '5px',
                    maxHeight: '70vh',
                    overflow: 'auto',
                }}
            >
                {recommendations.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            border: '1px solid #ccc',
                            padding: '8px',
                            textAlign: 'center',
                            width: '16vw',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100px',
                                marginTop: '8px',
                                marginBottom: '8px',
                            }}
                        >
                            <img
                                src={`https://api.steamapis.com/image/item/730/${item.marketHashName}`}
                                style={{
                                    maxWidth: '100%', // Maksymalna szerokość na 100% kontenera
                                    maxHeight: '100%', // Maksymalna wysokość na 100% kontenera
                                    objectFit: 'contain' // Zachowuje proporcje obrazka
                                }}
                            />
                        </Box>
                        <Box sx={{
                                height: '60px'
                            }}>
                            <Typography variant="h5">{item.marketHashName}</Typography>
                        </Box>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                mt: 1,
                                mb: 1
                            }}
                        >
                            <Button variant="outlined" color="secondary" sx={{ width: '70%', mt: 1 }} onClick={() => window.open(`http://localhost:3000/history/${item.marketHashName}`, '_blank')}>
                                <HistoryIcon sx={{
                                    width: '20px', marginRight: '5px', color: colors.grey[100]
                                }}/>
                                Check price history
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ width: '70%', mt: 1 }} onClick={() => window.open(`https://steamcommunity.com/market/listings/730/${item.marketHashName}`, '_blank')}>
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png" 
                                    alt="Steam" 
                                    style={{ width: '20px', marginRight: '5px' }} 
                                />
                                Check on Steam
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SuggestedPage;
