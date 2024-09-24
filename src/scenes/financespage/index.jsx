import React, { useEffect, useState } from 'react';
import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from '../../components/BarChart';
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';

import { fetchItemsData } from "../../components/ItemApi";
import { fetchHistoryDataByName, fetchCurrentPrice } from '../../components/HistoryApi';
import { fetchUserSettings } from '../../components/SettingsApi';

import { tokens } from "../../theme";


const FinancesPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [profitData, setProfitData] = useState([]);
    const [itemProfitToday, setItemProfitToday] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalProfitToday, setTotalProfitToday] = useState(0);
    const [profitChangePercentage, setProfitChangePercentage] = useState(0);
    const [highestProfit, setHighestProfit] = useState(0);
    const [highestProfitDate, setHighestProfitDate] = useState(null);
    const [userGoal, setUserGoal] = useState();
    const [userGoalPrice, setUserGoalPrice] = useState();

    const currencyConversionRates = {
        USD: 1,
        PLN: 3.86086, // PLN -> USD
        EUR: 0.901781 // EUR -> USD
    };
    
    const convertToUSD = (amount, currency) => {
        const rate = currencyConversionRates[currency] || 1;
        return amount / rate;
    };

    useEffect(() => {
        const fetchItemPrice = async (goalName) => {
            try {
                const response = await fetchCurrentPrice(goalName);
                
                if (response && response.price) {
                    return response.price;
                } else {
                    console.error('Error fetching price from Steam:', response);
                    return null;
                }
            } catch (error) {
                console.error('Error fetching price from Steam:', error);
                return null;
            }
        };

        const updateUserGoalPrice = (userGoalPrice, userGoalName) => {
            const today = new Date().toLocaleDateString('fr-CA');
            const goalKey = `goal_${userGoalName}_${today}`;

            localStorage.setItem(goalKey, userGoalPrice);
            setUserGoalPrice(userGoalPrice);
        }

        const getUserSettings = async () => {
            try {
                const data = await fetchUserSettings();
                setUserGoal(data.goalName);

                const today = new Date().toLocaleDateString('fr-CA');
                const goalKey = `goal_${data.goalName}_${today}`;
                const storedPrice = localStorage.getItem(goalKey);

                for (const key in localStorage) {
                    if (key.startsWith('goal_') && key !== goalKey) {
                        localStorage.removeItem(key);
                    }
                }

                if (storedPrice) {
                    setUserGoalPrice(storedPrice);
                } else {
                    const userGoalPrice = await fetchItemPrice(data.goalName);
                    if (userGoalPrice) {
                        updateUserGoalPrice(userGoalPrice, data.goalName);
                    }
                }
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        getUserSettings();
    }, []);

    useEffect(() => {
        const calculateProfit = async () => {
            const items = await fetchItemsData();
            const itemProfits = [];
            let totalSpentAmount = 0;
            const profitMap = new Map();
            const dateCountMap = new Map();
    
            for (const item of items) {
                const { id, marketHashName, quantity, price: purchasePrice, currency } = item;
                const history = await fetchHistoryDataByName(marketHashName);
                const boughtPriceInUSD = convertToUSD(parseFloat(purchasePrice), currency || "USD");
                totalSpentAmount += (boughtPriceInUSD * quantity);
    
                history.forEach(historyEntry => {
                    const date = historyEntry.date;
                    dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
                });
    
                history.forEach(historyEntry => {
                    const salePrice = parseFloat(historyEntry.price);
                    const profit = (salePrice * quantity) - (boughtPriceInUSD * quantity);
                    const date = historyEntry.date;
    
                    if (profitMap.has(date)) {
                        profitMap.set(date, profitMap.get(date) + profit);
                    } else {
                        profitMap.set(date, profit);
                    }

                    if (date === new Date().toLocaleDateString('fr-CA')) {
                        itemProfits.push({ id, marketHashName, profit });
                    }
                });
            }
    
            const validProfitData = Array.from(profitMap.entries()).filter(([date]) => {
                return dateCountMap.get(date) === items.length;
            }).map(([date, profit]) => ({
                x: new Date(date),
                y: profit,
            }));


    
            setProfitData([{ id: "Total Profit", color: 'hsl(206, 70%, 50%)', data: validProfitData }]);

            setTotalSpent(totalSpentAmount);

            setItemProfitToday(itemProfits);

            const today = new Date().toLocaleDateString('fr-CA'); // YYYY-MM-DD
            const todayProfit = profitMap.get(today) || 0;
            setTotalProfitToday(todayProfit);

            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const lastMonthDate = lastMonth.toLocaleDateString('fr-CA');
            const lastMonthProfit = profitMap.get(lastMonthDate) || 0;
            const changePercentage = lastMonthProfit ? ((todayProfit - lastMonthProfit) / lastMonthProfit) : 0;
            setProfitChangePercentage(changePercentage);

            const { maxProfit, highestProfitDate } = Array.from(profitMap.entries()).reduce((acc, [date, profit]) => {
                if (profit > acc.maxProfit) {
                    return { maxProfit: profit, highestProfitDate: date };
                }
                return acc;
            }, { maxProfit: -Infinity, highestProfitDate: null });
            
            setHighestProfit(maxProfit);
            setHighestProfitDate(highestProfitDate);
        };
    
        calculateProfit();
    }, []);
    



    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="YOUR FINANCES" subtitle="Summary of your finances" />
            </Box>

            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="135px"
                gap="20px"
            >  
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box width="100%" m="0 30px">
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ color: colors.grey[100] }}
                                >
                                    Total amount spent on items
                                </Typography>
                            </Box>
                            <Box>
                                <AttachMoneyIcon fontSize="large" />
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt="2px">
                            <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                {totalSpent.toFixed(2)} USD
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box width="100%" m="0 30px">
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ color: colors.grey[100] }}
                                >
                                    Value of your items
                                </Typography>
                            </Box>
                            <Box>
                                <PaidRoundedIcon fontSize="large" />
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt="2px">
                            <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                {(totalProfitToday + totalSpent) .toFixed(2)} USD
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title="Profit change"
                        subtitle="Percentage change from previous month"
                        progress={profitChangePercentage}
                        increase={(profitChangePercentage*100).toFixed(2) + "%"}
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box width="100%" m="0 30px">
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{ color: colors.grey[100] }}
                                >
                                    Highest profit
                                </Typography>
                            </Box>
                            <Box>
                                <ArrowUpwardIcon fontSize="large" />
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" mt="2px">
                            <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                {highestProfit.toFixed(2)} USD on {highestProfitDate}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                                Profit Chart
                            </Typography>
                        </Box>
                    </Box>
                    <Box height="250px" mt="-10px">
                        <LineChart data={profitData} isDashboard='true' />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={theme.palette.mode === "dark" ? `4px solid ${colors.primary[500]}` : `4px solid #fcfcfc`}
                        colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                            Your items and today's profit
                        </Typography>
                    </Box>
                    {itemProfitToday.map((item) => (
                        <Box
                            key={item.id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={theme.palette.mode === "dark" ? `4px solid ${colors.primary[500]}` : `4px solid #fcfcfc`}
                            p="15px"
                        >
                            <Box>
                                <Typography variant="h5" fontWeight="500">
                                    {item.marketHashName}
                                </Typography>
                            </Box>
                            <Box p="5px 10px" borderRadius="4px" backgroundColor={item.profit.toFixed(2) > 0 ? colors.greenAccent[500] : colors.redAccent[500]}>
                                {item.profit.toFixed(2)} USD
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                                Goal 
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt="25px"
                    >
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center"
                            flex={1}
                            mr={1}
                        >
                            <img
                                src={`https://api.steamapis.com/image/item/730/${userGoal}`}
                                style={{ width: '70%', height: '70%', objectFit: 'cover' }}
                            />
                            <Typography variant="h6" fontWeight="600" color={colors.grey[100]} mt={1} maxWidth="70%" textAlign="center">
                                {userGoal}
                            </Typography>
                        </Box>
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center"
                            flex={1}
                            ml={1}
                        >
                            <ProgressCircle size="125" progress={totalProfitToday/(totalProfitToday + totalSpent)} showPercentage={true} />
                            <Typography variant="h5" mt={2}>
                                {(userGoalPrice - (totalProfitToday + totalSpent)).toFixed(2)} USD left
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                                Average Profit Chart
                            </Typography>
                        </Box>
                    </Box>
                    <Box height="250px" mt="-10px">
                        <BarChart data={profitData} />
                    </Box>
                </Box>

            </Box>
        </Box>

    );
}

export default FinancesPage;