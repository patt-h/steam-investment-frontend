import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { fetchHistoryDataByName } from './HistoryApi';
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const LineChart = ({ name }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchHistoryDataByName(name);
            if (result.length > 0) {
                const formattedData = formatData(result);
                setData(formattedData);
            }
        };

        fetchData();
    }, [name]);

    const formatData = (data) => {
        const groupedData = data.reduce((acc, curr) => {
            const date = new Date(curr.date);
            if (!acc[date]) {
                acc[date] = { x: date, y: curr.price };
            }
            return acc;
        }, {});

        return [{
            id: 'Price',
            color: 'hsl(206, 70%, 50%)',
            data: Object.values(groupedData)
        }];
    };

    return (
        <ResponsiveLine
            data={data}
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
                tooltip: {
                  container: {
                    color: colors.primary[500],
                  },
                },
              }}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
             }}
            yScale={{ 
                type: 'linear', 
                min: 'auto', 
                max: 'auto',
                stacked: false,
                reverse: false

            }}
            xFormat="time:%Y-%m-%d"
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendOffset: 36,
                legendPosition: 'middle',
                format: "%b %Y"
            }}
            axisLeft={{
                tickValues: 5,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Price',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            enablePoints={false}
            enableGridX={false}
            enableGridY={true}
            colors={{ datum: 'color' }}
            curve="monotoneX"
            lineWidth={2}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableSlices="x"
            sliceTooltip={({ slice }) => (
                <div>
                    <strong>Date:</strong> {slice.points[0].data.xFormatted}<br />
                    <strong>Price:</strong> {slice.points[0].data.yFormatted}
                </div>
            )}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    );
};

export default LineChart;
