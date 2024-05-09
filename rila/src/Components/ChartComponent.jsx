import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChartComponent = () => {
  const [dataPoints, setDataPoints] = useState([]);

  // Fetch data from the server when the component mounts
  useEffect(() => {
    fetchDataFromServer();
  }, []);

  // Function to fetch data from the server
  const fetchDataFromServer = async () => {
    try {
      const response = await axios.get('/your-api-endpoint');
      if (response.data) {
        // Set the dataPoints state with the data received from the server
        setDataPoints(response.data);
        renderChart(response.data);
      }
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  };

  // Function to render the chart using CanvasJS
  const renderChart = (dataPoints) => {
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light1',
      title: {
        text: 'Simple Column Chart with Index Labels',
      },
      axisY: {
        includeZero: true,
      },
      data: [
        {
          type: 'column',
          indexLabelFontColor: '#5A5757',
          indexLabelPlacement: 'outside',
          dataPoints,
        },
      ],
    });

    chart.render();
  };

  return (
    <div id="chartContainer" style={{ height: '370px', width: '100%' }}></div>
  );
};

export default ChartComponent;
