import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipitem, data) {
                return numeral(tooltipitem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                parse: "MM/DD/YY",
                tooltipFormat: "ll"
            }
        }],
        yAxes: [{
            gridLines: {
                display: false
            },
            ticks: {
                callback: function (value, index, values) {
                    return numeral(value).format("0a");
                }
            }
        }]
    }
};
const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    };
    return chartData;
}

function LineGraph({ casesType, className }) {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {
                    const chartData = buildChartData(data, casesType);
                    console.log(chartData);
                    setData(chartData);
                });
        }
        fetchData();

    }, [casesType]);
    return (
        <div className={className}>
            {data.length > 0 && <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data
                        }
                    ],
                }}>
            </Line>}

        </div >
    )
}

export default LineGraph;
