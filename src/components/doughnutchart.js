import { Doughnut } from "react-chartjs-2";

export default function DoughnutChart({players,coaches}){
    const data = {
        labels: [
          'Players',
          'Coach'
        ],
        datasets: [{
          label: 'Total Users',
          data: [players, coaches],
          backgroundColor: [
            '#62B2FD',
            '#9BDFC4'
          ],
          hoverOffset: 4
        }]
      };
    return(
        <div className="w-full ">
            <Doughnut data={data} />
        </div>
    )
}