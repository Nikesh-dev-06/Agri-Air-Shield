import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getYearlyTimeline } from "@/data/burnData";

interface BurnChartProps {
  year: number;
  selectedMonth: number;
}

const BurnChart = ({ year, selectedMonth }: BurnChartProps) => {
  const data = getYearlyTimeline(year);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220 15% 18%)" }}
          />
          <YAxis
            tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }}
            axisLine={{ stroke: "hsl(220 15% 18%)" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 15% 18%)",
              borderRadius: "8px",
              color: "hsl(40 15% 90%)",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="events"
            radius={[4, 4, 0, 0]}
            fill="hsl(28 95% 55%)"
            opacity={0.8}
          >
            {data.map((entry) => (
              <rect
                key={entry.month}
                fill={entry.monthNum === selectedMonth ? "hsl(16 85% 50%)" : "hsl(28 95% 55% / 0.5)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BurnChart;
