import { useState, useEffect } from "react";
import {
  Sparkles,
  Leaf,
  MessageCircle,
  Copy,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Utensils,
  Activity,
  Droplet,
  Moon,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

// Matches backend LabParameter schema exactly
type LabParameter = {
  name: string;
  value: number;
  unit: string;
  reference_low: number;
  reference_high: number;
  status: "High" | "Low" | "Normal";
};

// Fallback mock data matching backend LabParameter shape
const defaultLabData: LabParameter[] = [
  { name: "Hemoglobin", value: 14.2, unit: "g/dL", reference_low: 13.0, reference_high: 17.0, status: "Normal" },
  { name: "White Blood Cell Count", value: 11.5, unit: "×10³/μL", reference_low: 4.0, reference_high: 10.0, status: "High" },
  { name: "Platelet Count", value: 220, unit: "×10³/μL", reference_low: 150, reference_high: 400, status: "Normal" },
  { name: "Red Blood Cell Count", value: 4.8, unit: "million/μL", reference_low: 4.5, reference_high: 5.5, status: "Normal" },
  { name: "Blood Glucose (Fasting)", value: 118, unit: "mg/dL", reference_low: 70, reference_high: 100, status: "High" },
  { name: "Total Cholesterol", value: 245, unit: "mg/dL", reference_low: 0, reference_high: 200, status: "High" },
  { name: "Creatinine", value: 1.1, unit: "mg/dL", reference_low: 0.7, reference_high: 1.3, status: "Normal" },
  { name: "Thyroid (TSH)", value: 3.2, unit: "μIU/mL", reference_low: 0.4, reference_high: 4.0, status: "Normal" },
  { name: "Vitamin D", value: 22, unit: "ng/mL", reference_low: 30, reference_high: 100, status: "Low" },
  { name: "Vitamin B12", value: 380, unit: "pg/mL", reference_low: 200, reference_high: 900, status: "Normal" },
];

// Mock doctor questions — not yet backed by API
const mockQuestions = [
  "Should I be concerned about my elevated glucose level?",
  "What can I do to improve my Vitamin D deficiency?",
  "Do my WBC results indicate an infection or inflammation?",
];

export function Dashboard() {
  const [labData, setLabData] = useState<LabParameter[]>(defaultLabData);
  const [patientName, setPatientName] = useState("John Anderson");
  const [reportDate, setReportDate] = useState("Feb 20, 2026");
  const [filter, setFilter] = useState<"all" | "abnormal" | "normal">("all");
  const [isCopied, setIsCopied] = useState(false);

  // Load API response (LabReport) from localStorage set by Upload page
  // API fields: patient_name, report_date, parameters[]
  useEffect(() => {
    const stored = localStorage.getItem("labReportData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Map backend field names to display state
        if (data.patient_name) setPatientName(data.patient_name);
        if (data.report_date) setReportDate(data.report_date);
        if (Array.isArray(data.parameters) && data.parameters.length > 0) {
          setLabData(data.parameters);
        }
      } catch {
        // Fall back to mock data silently
      }
    }
  }, []);

  const abnormalCount = labData.filter((item) => item.status !== "Normal").length;

  // Sort: High/Low rows appear first, Normal at bottom
  const sortedData = [...labData].sort((a, b) => {
    const aAbnormal = a.status !== "Normal" ? 0 : 1;
    const bAbnormal = b.status !== "Normal" ? 0 : 1;
    return aAbnormal - bAbnormal;
  });

  const filteredData = sortedData.filter((item) => {
    if (filter === "abnormal") return item.status !== "Normal";
    if (filter === "normal") return item.status === "Normal";
    return true;
  });

  const handleCopyQuestions = () => {
    const text = mockQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Questions copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Toaster />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            Your Health Snapshot
          </h1>
          <p className="text-[#64748b]">
            Comprehensive analysis of your latest health report
          </p>
        </div>

        {/* Patient Information Card — sourced from API response */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#7c3aed] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0f172a]">Patient Information</h3>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                abnormalCount > 0
                  ? "bg-[#fb923c]/10 text-[#fb923c]"
                  : "bg-[#22c55e]/10 text-[#22c55e]"
              }`}
            >
              {abnormalCount > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  {abnormalCount}{" "}
                  {abnormalCount === 1 ? "value needs" : "values need"} attention
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  All values normal
                </>
              )}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* patient_name from API */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] mb-1">Patient Name</div>
                <div className="font-medium text-[#0f172a]">{patientName}</div>
              </div>
            </div>

            {/* report_date from API */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] mb-1">Test Date</div>
                <div className="font-medium text-[#0f172a]">{reportDate}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] mb-1">Report ID</div>
                <div className="font-medium text-[#0f172a]">RPT-2026-1847</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] mb-1">Age / Gender</div>
                <div className="font-medium text-[#0f172a]">42 / Male</div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Table — renders API parameters[] array */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] mb-6 overflow-hidden">
          {/* Filter Row */}
          <div className="border-b border-[#e2e8f0] px-6 py-4 bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#64748b]">Filter:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-[#0d9488] text-white"
                    : "bg-white text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                All ({labData.length})
              </button>
              <button
                onClick={() => setFilter("abnormal")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "abnormal"
                    ? "bg-[#ef4444] text-white"
                    : "bg-white text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                Abnormal Only ({abnormalCount})
              </button>
              <button
                onClick={() => setFilter("normal")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "normal"
                    ? "bg-[#22c55e] text-white"
                    : "bg-white text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                Normal Only ({labData.length - abnormalCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d9488] text-white">
                  <th className="text-left px-6 py-4 font-bold">Parameter</th>
                  <th className="text-left px-6 py-4 font-bold">Value</th>
                  <th className="text-left px-6 py-4 font-bold">Reference Range</th>
                  <th className="text-left px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  // Color logic: High → red, Low → red, Normal → white/green
                  const isAbnormal = item.status !== "Normal";
                  const bgColor = isAbnormal ? "bg-[#ef4444]/10" : "bg-white";
                  const borderColor = isAbnormal ? "border-l-4 border-l-[#ef4444]" : "";
                  const badgeColor = isAbnormal ? "text-[#ef4444]" : "text-[#22c55e]";
                  const badgeBg = isAbnormal ? "bg-[#ef4444]/10" : "bg-[#22c55e]/10";

                  return (
                    <tr
                      key={index}
                      className={`border-b border-[#e2e8f0] last:border-b-0 ${bgColor} ${borderColor} hover:shadow-[inset_3px_0_0_0_#0d9488] transition-shadow`}
                    >
                      {/* name from API */}
                      <td className="px-6 py-4 font-medium text-[#0f172a]">
                        {item.name}
                      </td>
                      {/* value + unit from API */}
                      <td className="px-6 py-4 text-[#0f172a] font-mono">
                        {item.value} {item.unit}
                      </td>
                      {/* reference_low – reference_high + unit from API */}
                      <td className="px-6 py-4 text-[#64748b]">
                        {item.reference_low} – {item.reference_high} {item.unit}
                      </td>
                      {/* status from API: "High" | "Low" | "Normal" */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeColor} ${badgeBg}`}
                        >
                          {isAbnormal && <AlertTriangle className="w-3 h-3" />}
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* AI Health Summary — mock data (no backend endpoint yet) */}
          <div className="bg-[#7c3aed]/5 rounded-xl border border-[#7c3aed]/20 overflow-hidden">
            <div className="bg-[#7c3aed] px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-white">What Your Results Mean</h3>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            </div>
            <div className="p-6">
              <p className="text-[#0f172a] leading-relaxed mb-4">
                Your lab results show <strong>3 values</strong> that need
                attention. Your{" "}
                <strong>fasting glucose is elevated</strong> at 118 mg/dL,
                placing you in the prediabetic range. Your{" "}
                <strong>white blood cell count is slightly high</strong>, which
                may indicate mild inflammation or your body fighting off an
                infection. Additionally, your{" "}
                <strong>Vitamin D is low</strong> at 22 ng/mL, which is common
                but should be addressed through supplementation or sun exposure.
              </p>
              <p className="text-xs text-[#64748b] italic border-t border-[#7c3aed]/20 pt-4">
                This is not medical advice. Always consult your doctor.
              </p>
            </div>
          </div>

          {/* Preventive Guidance — mock data (no backend endpoint yet) */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <div className="bg-[#0d9488] px-6 py-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-white" />
              <h3 className="font-bold text-white">What You Can Do</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#0f172a] mb-1">Improve Your Diet</div>
                    <div className="text-sm text-[#64748b]">
                      Reduce refined sugars and increase fiber intake to help manage
                      glucose levels. Focus on whole grains, vegetables, and lean proteins.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#0f172a] mb-1">Stay Active</div>
                    <div className="text-sm text-[#64748b]">
                      Aim for 30 minutes of moderate exercise 5 days a week. This can
                      improve insulin sensitivity and help lower glucose levels.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#0f172a] mb-1">Vitamin D Supplementation</div>
                    <div className="text-sm text-[#64748b]">
                      Consider taking a Vitamin D3 supplement (1000–2000 IU daily) and get
                      15–20 minutes of sun exposure when possible.
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Moon className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#0f172a] mb-1">Prioritize Rest</div>
                    <div className="text-sm text-[#64748b]">
                      Ensure 7–8 hours of quality sleep. Poor sleep can affect glucose
                      metabolism and immune function.
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Doctor Questions — mock data (no backend endpoint yet) */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#7c3aed] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-5 h-5 text-[#7c3aed]" />
                <h3 className="font-bold text-[#0f172a]">
                  Ask Your Doctor These Questions
                </h3>
              </div>
              <p className="text-xs text-[#64748b]">
                Generated based on your abnormal values
              </p>
            </div>
            <button
              onClick={handleCopyQuestions}
              className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0d9488]/90 transition-colors text-sm font-medium"
            >
              <Copy className="w-4 h-4" />
              {isCopied ? "Copied ✓" : "Copy All Questions"}
            </button>
          </div>

          <div className="space-y-3">
            {mockQuestions.map((question, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]"
              >
                <span className="flex items-center justify-center w-6 h-6 bg-[#7c3aed] text-white rounded-full text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-[#0f172a] leading-relaxed">{question}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Persistent Disclaimer Footer */}
        <div className="mt-10 pb-6 text-center">
          <p className="text-xs text-[#94a3b8]">
            This is not a medical diagnosis. Always consult your doctor.
          </p>
        </div>
      </div>
    </div>
  );
}
