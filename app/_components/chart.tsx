import LineChart from "@/components/charts/line-chart";

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "Days",
      },
    },
    y: {
      title: {
        display: true,
        text: "Sales Rank Drops",
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: "",
    },
  },
};

const labels = ["365", "180", "90", "30"];

export default function VisitChart({ salesRank }: { salesRank: any }) {
  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: salesRank.toReversed().map((rank: number) => rank),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="p-4">
      <h1 className="font-semibold text-2xl text-center mb-2">
        Historical Rank Sales
      </h1>
      <div className="flex items-center justify-center rounded-lg bg-white md:p-6 w-full">
        <LineChart options={options} data={data} />
      </div>
    </div>
  );
}
