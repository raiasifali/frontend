import React from "react";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({ videos }) => {
  // Define month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Initialize an array of 12 zeros for each month
  const monthlyCounts = new Array(12).fill(0);

  // Populate the monthlyCounts array with the video data
  videos?.forEach(video => {
    const { month, count } = video;
    // Subtract 1 from month to get zero-based index
    monthlyCounts[month - 1] = count;
  });

  return (
    <div className="chart-container">
      <Bar
        data={{
          labels: monthNames,
          datasets: [
            {
              label: "Video Uploads",
              data: monthlyCounts,
              backgroundColor: "#131313",
              barThickness: 31,
              borderRadius: 8,
            }
          ]
        }}
      />
    </div>
  );
};

export default BarChart;
