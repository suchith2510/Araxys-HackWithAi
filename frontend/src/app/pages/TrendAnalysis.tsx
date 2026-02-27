import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Navbar } from "../components/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ComparisonRow = {
  parameter: string;
  report1: string;
  report2: string;
  change: number;
  direction: "up" | "down" | "stable";
  improving: boolean;
};

const comparisonData: ComparisonRow[] = [
  { parameter: "Hemoglobin (g/dL)", report1: "13.8", report2: "14.2", change: 2.9, direction: "up", improving: true },
  { parameter: "WBC Count (×10³/μL)", report1: "8.5", report2: "11.5", change: 35.3, direction: "up", improving: false },
  { parameter: "Platelet Count (×10³/μL)", report1: "235", report2: "220", change: -6.4, direction: "down", improving: true },
  { parameter: "Glucose (mg/dL)", report1: "95", report2: "118", change: 24.2, direction: "up", improving: false },
  { parameter: "Total Cholesterol (mg/dL)", report1: "228", report2: "245", change: 7.5, direction: "up", improving: false },
  { parameter: "Vitamin D (ng/mL)", report1: "25", report2: "22", change: -12.0, direction: "down", improving: false },
];

const chartData = [
  { name: "Nov 2025", glucose: 95, cholesterol: 228, wbc: 8.5, vitaminD: 25 },
  { name: "Dec 2025", glucose: 102, cholesterol: 235, wbc: 9.2, vitaminD: 24 },
  { name: "Jan 2026", glucose: 108, cholesterol: 240, wbc: 10.1, vitaminD: 23 },
  { name: "Feb 2026", glucose: 118, cholesterol: 245, wbc: 11.5, vitaminD: 22 },
];

export function TrendAnalysis() {
  const [selectedReport1, setSelectedReport1] = useState("Nov 2025");
  const [selectedReport2, setSelectedReport2] = useState("Feb 2026");

  const reportDates = ["Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            Your Health Over Time
          </h1>
          <p className="text-[#64748b]">
            Compare your lab results across multiple reports and identify health patterns
          </p>
        </div>

        {/* Report Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-[#64748b]">Compare:</span>
            <div className="flex items-center gap-2">
              {reportDates.map((date) => (
                <button
                  key={`report1-${date}`}
                  onClick={() => setSelectedReport1(date)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedReport1 === date
                      ? "bg-[#0d9488] text-white"
                      : "bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-[#64748b]">vs</span>
            <div className="flex items-center gap-2">
              {reportDates.map((date) => (
                <button
                  key={`report2-${date}`}
                  onClick={() => setSelectedReport2(date)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedReport2 === date
                      ? "bg-[#7c3aed] text-white"
                      : "bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d9488] text-white">
                  <th className="text-left px-6 py-4 font-bold">Parameter</th>
                  <th className="text-left px-6 py-4 font-bold">{selectedReport1}</th>
                  <th className="text-left px-6 py-4 font-bold">{selectedReport2}</th>
                  <th className="text-left px-6 py-4 font-bold">Change</th>
                  <th className="text-left px-6 py-4 font-bold">Direction</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => {
                  const changeColor = item.improving ? "text-[#22c55e]" : "text-[#ef4444]";
                  const isPositive = item.change > 0;

                  return (
                    <tr
                      key={index}
                      className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f8fafc] transition-colors hover:shadow-[inset_3px_0_0_0_#0d9488]"
                    >
                      <td className="px-6 py-4 font-medium text-[#0f172a]">
                        {item.parameter}
                      </td>
                      <td className="px-6 py-4 text-[#0f172a] font-mono">
                        {item.report1}
                      </td>
                      <td className="px-6 py-4 text-[#0f172a] font-mono font-bold">
                        {item.report2}
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold ${changeColor}`}>
                        {isPositive ? "+" : ""}
                        {item.change.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4">
                        {item.direction === "up" ? (
                          <TrendingUp
                            className={`w-5 h-5 ${item.improving ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                          />
                        ) : item.direction === "down" ? (
                          <TrendingDown
                            className={`w-5 h-5 ${item.improving ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                          />
                        ) : (
                          <Minus className="w-5 h-5 text-[#64748b]" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 mb-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">
            Parameter Trends Across Reports
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "14px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "14px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="glucose"
                stroke="#0d9488"
                strokeWidth={3}
                name="Glucose (mg/dL)"
                dot={{ fill: "#0d9488", r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="cholesterol"
                stroke="#7c3aed"
                strokeWidth={3}
                name="Cholesterol (mg/dL)"
                dot={{ fill: "#7c3aed", r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="wbc"
                stroke="#ef4444"
                strokeWidth={3}
                name="WBC Count (×10³/μL)"
                dot={{ fill: "#ef4444", r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="vitaminD"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Vitamin D (ng/mL)"
                dot={{ fill: "#3b82f6", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Trend Summary */}
        <div className="bg-[#7c3aed]/5 rounded-xl border border-[#7c3aed]/20 overflow-hidden">
          <div className="bg-[#7c3aed] px-6 py-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white">AI Trend Summary</h3>
          </div>
          <div className="p-6">
            <p className="text-[#0f172a] leading-relaxed">
              Your health metrics show{" "}
              <strong className="text-[#ef4444]">concerning upward trends</strong> in
              several key areas. Glucose levels have increased{" "}
              <strong>24.2%</strong> from 95 to 118 mg/dL over the past 4 months,
              indicating developing insulin resistance. Total cholesterol has also risen{" "}
              <strong>7.5%</strong> to 245 mg/dL. Most concerning is your{" "}
              <strong>declining Vitamin D</strong>, now at 22 ng/mL. These trends
              suggest metabolic changes that warrant immediate lifestyle intervention and
              follow-up testing. Discuss these patterns with your doctor and consider
              implementing the preventive measures recommended in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
