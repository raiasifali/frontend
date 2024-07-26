import React from "react";
import { Line } from "react-chartjs-2";

export default function LineChart({ users }) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Prepare data array with 12 months initialized to 0
    const monthlyUserCounts = new Array(12).fill(0);
    users?.forEach(item => {
        monthlyUserCounts[item.month - 1] = item.count;
    });

    const data = {
        labels: monthNames,
        datasets: [{
            label: 'User Engagement',
            data: monthlyUserCounts,
            fill: true,
            borderColor: '#FF3333',
            tension: 0.3,
            backgroundColor: 'rgb(255 51 51 / 10%)'
        }]
    };

    return (
        <div className="w-full">
            <Line data={data} />
        </div>
    );
}
