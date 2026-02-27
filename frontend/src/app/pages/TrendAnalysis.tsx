<<<<<<< HEAD
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles, Upload, ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router";

// Matches backend TrendEntry schema exactly
type TrendEntry = {
  name: string;
  unit: string;
  older_value: number;
  newer_value: number;
  absolute_change: number;
  percentage_change: number | null;
  direction: "Increased" | "Decreased" | "Unchanged";
  older_status: string;
  newer_status: string;
};

type TrendData = {
  patient_name: string;
  older_report_date: string;
  newer_report_date: string;
  trends: TrendEntry[];
  only_in_older: string[];
  graph_base64: string | null;
};

export function TrendAnalysis() {
  const [trendData, setTrendData] = useState<TrendData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("trendData");
    if (stored) {
      try {
        const data = JSON.parse(stored) as TrendData;
        setTrendData(data);
      } catch {
        // malformed data — show empty state
      }
    }
  }, []);

  if (!trendData) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 bg-[#0d9488]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-[#0d9488]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-4">
            No Trend Data Yet
          </h1>
          <p className="text-[#64748b] mb-8 max-w-md mx-auto">
            Upload at least two lab reports on the Upload page to generate a full trend comparison.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            Upload Reports
          </Link>
        </div>
      </div>
    );
  }

  const { patient_name, older_report_date, newer_report_date, trends, only_in_older, graph_base64 } = trendData;
=======
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
>>>>>>> origin/main

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
<<<<<<< HEAD
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#0d9488] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
=======
>>>>>>> origin/main
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            Your Health Over Time
          </h1>
          <p className="text-[#64748b]">
<<<<<<< HEAD
            Compare your lab results between two reports and identify health trends
          </p>
        </div>

        {/* Patient & Date Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#0d9488] p-6 mb-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <div className="text-xs text-[#64748b] mb-1">Patient</div>
              <div className="font-bold text-[#0f172a] text-lg">{patient_name}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-[#0d9488]/10 rounded-lg">
                <div className="text-xs text-[#64748b] mb-1">Older Report</div>
                <div className="font-semibold text-[#0d9488]">{older_report_date}</div>
              </div>
              <div className="text-[#64748b] font-bold">→</div>
              <div className="text-center px-4 py-2 bg-[#7c3aed]/10 rounded-lg">
                <div className="text-xs text-[#64748b] mb-1">Newer Report</div>
                <div className="font-semibold text-[#7c3aed]">{newer_report_date}</div>
              </div>
            </div>
            <div className="ml-auto text-sm text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">{trends.length}</span> parameters compared
=======
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
>>>>>>> origin/main
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Trend Comparison Table */}
=======
        {/* Comparison Table */}
>>>>>>> origin/main
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d9488] text-white">
                  <th className="text-left px-6 py-4 font-bold">Parameter</th>
<<<<<<< HEAD
                  <th className="text-left px-6 py-4 font-bold">
                    <span className="text-[#a7f3d0]">{older_report_date}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-bold">
                    <span className="text-white">{newer_report_date}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-bold">Change</th>
                  <th className="text-left px-6 py-4 font-bold">% Change</th>
=======
                  <th className="text-left px-6 py-4 font-bold">{selectedReport1}</th>
                  <th className="text-left px-6 py-4 font-bold">{selectedReport2}</th>
                  <th className="text-left px-6 py-4 font-bold">Change</th>
>>>>>>> origin/main
                  <th className="text-left px-6 py-4 font-bold">Direction</th>
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
                {trends.map((item, index) => {
                  const isImproving =
                    (item.direction === "Increased" && item.newer_status === "Normal") ||
                    (item.direction === "Decreased" && item.newer_status === "Normal") ||
                    item.direction === "Unchanged";

                  const changeColor =
                    item.direction === "Unchanged"
                      ? "text-[#64748b]"
                      : isImproving
                        ? "text-[#22c55e]"
                        : "text-[#ef4444]";

                  const newerBg =
                    item.newer_status === "High" || item.newer_status === "Low"
                      ? "text-[#ef4444] font-bold"
                      : "text-[#0f172a]";
=======
                {comparisonData.map((item, index) => {
                  const changeColor = item.improving ? "text-[#22c55e]" : "text-[#ef4444]";
                  const isPositive = item.change > 0;
>>>>>>> origin/main

                  return (
                    <tr
                      key={index}
                      className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f8fafc] transition-colors hover:shadow-[inset_3px_0_0_0_#0d9488]"
                    >
<<<<<<< HEAD
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0f172a]">{item.name}</div>
                        <div className="text-xs text-[#64748b]">{item.unit}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#64748b]">
                        {item.older_value}
                        <span className={`ml-2 text-xs inline-block px-1.5 py-0.5 rounded ${item.older_status === "Normal"
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-[#ef4444]/10 text-[#ef4444]"
                          }`}>
                          {item.older_status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-mono ${newerBg}`}>
                        {item.newer_value}
                        <span className={`ml-2 text-xs inline-block px-1.5 py-0.5 rounded ${item.newer_status === "Normal"
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-[#ef4444]/10 text-[#ef4444]"
                          }`}>
                          {item.newer_status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold ${changeColor}`}>
                        {item.absolute_change > 0 ? "+" : ""}
                        {item.absolute_change.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold ${changeColor}`}>
                        {item.percentage_change !== null
                          ? `${item.percentage_change > 0 ? "+" : ""}${item.percentage_change.toFixed(1)}%`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {item.direction === "Increased" ? (
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`w-5 h-5 ${changeColor}`} />
                            <span className={`text-xs font-medium ${changeColor}`}>Increased</span>
                          </div>
                        ) : item.direction === "Decreased" ? (
                          <div className="flex items-center gap-1">
                            <TrendingDown className={`w-5 h-5 ${changeColor}`} />
                            <span className={`text-xs font-medium ${changeColor}`}>Decreased</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Minus className="w-5 h-5 text-[#64748b]" />
                            <span className="text-xs font-medium text-[#64748b]">Unchanged</span>
                          </div>
=======
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
>>>>>>> origin/main
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

<<<<<<< HEAD
        {/* Parameters only in older report */}
        {only_in_older.length > 0 && (
          <div className="bg-[#fb923c]/5 border border-[#fb923c]/20 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-[#fb923c] mb-2">
              ⚠ Parameters only in older report
            </h3>
            <p className="text-sm text-[#64748b] mb-3">
              These parameters were not found in the newer report:
            </p>
            <div className="flex flex-wrap gap-2">
              {only_in_older.map((name) => (
                <span
                  key={name}
                  className="text-xs bg-white border border-[#fb923c]/30 text-[#fb923c] px-3 py-1 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Backend-generated Trend Graph */}
        {graph_base64 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 mb-6">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6">
              Parameter Trends — AI Generated Graph
            </h2>
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${graph_base64}`}
                alt="Lab parameter trend graph"
                className="rounded-lg max-w-full"
                style={{ maxHeight: "480px" }}
              />
            </div>
          </div>
        ) : null}

        {/* AI Trend Summary placeholder */}
        <div className="bg-[#7c3aed]/5 rounded-xl border border-[#7c3aed]/20 overflow-hidden">
          <div className="bg-[#7c3aed] px-6 py-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white">Reading Your Trends</h3>
          </div>
          <div className="p-6">
            {trends.length > 0 ? (
              (() => {
                const worsened = trends.filter(
                  (t) => t.direction !== "Unchanged" && (t.newer_status === "High" || t.newer_status === "Low")
                );
                const improved = trends.filter(
                  (t) => t.direction !== "Unchanged" && t.newer_status === "Normal" && t.older_status !== "Normal"
                );
                return (
                  <div className="space-y-3 text-[#0f172a] leading-relaxed">
                    <p>
                      Compared <strong>{older_report_date}</strong> to{" "}
                      <strong>{newer_report_date}</strong> for{" "}
                      <strong>{patient_name}</strong>:
                    </p>
                    {improved.length > 0 && (
                      <p className="text-[#22c55e]">
                        ✓ <strong>{improved.length} parameter(s) improved</strong> and are now in the normal range:{" "}
                        {improved.map((t) => t.name).join(", ")}.
                      </p>
                    )}
                    {worsened.length > 0 && (
                      <p className="text-[#ef4444]">
                        ⚠ <strong>{worsened.length} parameter(s) moved out of normal range</strong>:{" "}
                        {worsened.map((t) => `${t.name} (${t.newer_status})`).join(", ")}.
                      </p>
                    )}
                    {improved.length === 0 && worsened.length === 0 && (
                      <p className="text-[#64748b]">
                        No significant changes in health status between the two reports.
                      </p>
                    )}
                    <p className="text-xs text-[#64748b] italic border-t border-[#7c3aed]/20 pt-4">
                      This is not medical advice. Always consult your doctor about your results.
                    </p>
                  </div>
                );
              })()
            ) : (
              <p className="text-[#64748b] italic">No trend data available.</p>
            )}
=======
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
>>>>>>> origin/main
          </div>
        </div>
      </div>
    </div>
  );
}
