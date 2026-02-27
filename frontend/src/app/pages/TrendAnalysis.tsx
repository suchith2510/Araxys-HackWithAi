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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#0d9488] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            Your Health Over Time
          </h1>
          <p className="text-[#64748b]">
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
            </div>
          </div>
        </div>

        {/* Trend Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d9488] text-white">
                  <th className="text-left px-6 py-4 font-bold">Parameter</th>
                  <th className="text-left px-6 py-4 font-bold">
                    <span className="text-[#a7f3d0]">{older_report_date}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-bold">
                    <span className="text-white">{newer_report_date}</span>
                  </th>
                  <th className="text-left px-6 py-4 font-bold">Change</th>
                  <th className="text-left px-6 py-4 font-bold">% Change</th>
                  <th className="text-left px-6 py-4 font-bold">Direction</th>
                </tr>
              </thead>
              <tbody>
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

                  return (
                    <tr
                      key={index}
                      className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f8fafc] transition-colors hover:shadow-[inset_3px_0_0_0_#0d9488]"
                    >
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
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

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
        {graph_base64 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 mb-6">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6">
              Parameter Trends — AI Generated Graph
            </h2>
            <div className="flex justify-center">
              <img
                src={graph_base64}
                alt="Lab parameter trend graph"
                className="rounded-lg max-w-full"
                style={{ maxHeight: "480px" }}
              />
            </div>
          </div>
        )}

        {/* AI Trend Summary */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
