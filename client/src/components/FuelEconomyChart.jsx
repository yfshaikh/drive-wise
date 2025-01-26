import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip
);

const FuelEconomyChart = () => {
  // Utility to generate random colors for each line
  const getRandomColor = () =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.7)`;

  // Hardcoded car data
  const carData = [
    { Carline: "COROLLA", FE_City: 30, FE_Hwy: 38, FE_Comb: 33 },
    { Carline: "CAMRY", FE_City: 22, FE_Hwy: 33, FE_Comb: 26 },
    { Carline: "PRIUS", FE_City: 54, FE_Hwy: 50, FE_Comb: 52 },
    { Carline: "TACOMA", FE_City: 20, FE_Hwy: 23, FE_Comb: 21 },
    { Carline: "TUNDRA", FE_City: 13, FE_Hwy: 17, FE_Comb: 15 },
    { Carline: "SIENNA", FE_City: 36, FE_Hwy: 36, FE_Comb: 36 },
    { Carline: "NX 300", FE_City: 22, FE_Hwy: 28, FE_Comb: 25 },
    { Carline: "HIGHLANDER", FE_City: 21, FE_Hwy: 29, FE_Comb: 24 },
  ];

  // Prepare chart data
  const labels = ["City", "Highway", "Combined"]; // x-axis labels
  const datasets = carData.map((car) => ({
    label: car.Carline,
    data: [car.FE_City, car.FE_Hwy, car.FE_Comb],
    borderColor: getRandomColor(),
    borderWidth: 2,
    tension: 0.4, // Curve smoothing
  }));

  // Chart.js data object
  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Fuel Economy Comparison</h1>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Fuel Economy by Model (City/Highway/Combined)",
            },
          },
        }}
      />
    </div>
  );
};

export default FuelEconomyChart;
