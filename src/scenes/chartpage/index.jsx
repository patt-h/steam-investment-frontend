import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { fetchHistoryDataByName } from "../../components/HistoryApi";
import { tokens } from "../../theme";

const ItemHistoryPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { marketHashName } = useParams();

  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState('');


  if (error) return <div>{error}</div>;

  return (
    <Box m="20px">
      <Header title="PRICE HISTORY" subtitle={`Price history of ${marketHashName}`} />
      
      <Box height="75vh">
        <Typography variant="h4" align="center">
          {marketHashName}
        </Typography>
        <LineChart name={marketHashName}/>
      </Box>
    </Box>
  );
};

export default ItemHistoryPage;
