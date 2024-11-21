import React, { useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { CircularProgress } from '@mui/material';

const BarChart = ({ data: propData }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);

    if (!propData || propData.length === 0) {
        return;
    }

    const processProfitData = (profitData) => {
        const today = new Date();
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth());
    
        const monthMap = {};
        
        profitData.forEach(entry => {
            const dateObj = new Date(entry.x);
            if (dateObj >= lastYear) {
                const monthIndex = dateObj.getMonth();
                const year = dateObj.getFullYear();
                const monthName = new Date(0, monthIndex).toLocaleString('en-US', { month: 'short' });
                const monthYearKey = `${monthName} ${year}`;
                if (!monthMap[monthYearKey]) {
                    monthMap[monthYearKey] = [];
                }
                monthMap[monthYearKey].push(entry.y);
            }
        });
    
        const averageData = Object.keys(monthMap).map(monthYear => {
            const total = monthMap[monthYear].reduce((acc, value) => acc + value, 0);
            const average = total / monthMap[monthYear].length;
            return { x: monthYear, y: average.toFixed(2) };
        });
    
        return averageData;
    };

    const averageData = processProfitData(propData[0].data);

    return (
        <ResponsiveBar
            data={averageData}
            theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: colors.grey[100],
                    },
                  },
                  legend: {
                    text: {
                      fill: colors.grey[100],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: colors.grey[100],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: colors.grey[100],
                    },
                  },
                },
                legends: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
            }}
            keys={['y']}
            indexBy="x"
            groupMode="grouped"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={"#3e9c35"} 
            borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 10,
                tickPadding: 10,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Average profit',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            enableGridY={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={colors.grey[100]}
            legends={[{
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                itemTextColor: colors.grey[100],
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ],
                data: [
                    { label: 'Average profit', color: "#3e9c35"}
                ]
            }]}
            isInteractive={false}
        />
    );
};

export default BarChart;
