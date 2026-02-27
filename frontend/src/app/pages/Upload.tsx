import { useState, useEffect } from "react";
import {
  Upload as UploadIcon,
  FileText,
  ArrowRight,
  X,
  Calendar,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";

type UploadedFile = {
  file: File;
  id: string;
  date: string;
};

// Exact error messages mapped from backend HTTP status codes
const ERROR_MESSAGES: Record<number, string> = {
  400: "Please upload a PDF file only.",
  413: "File too large. Max allowed size is 10 MB.",
  415: "Please upload a PDF file only.",
  422: "This PDF appears to be scanned. Please upload a text-based PDF.",
  502: "Something went wrong. Please try again.",
  503: "Something went wrong. Please try again.",
};

const API_BASE = "http://localhost:8000";

export function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const navigate = useNavigate();

  // Health check on mount — GET /health
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "ok") {
          setServiceUnavailable(true);
        }
      })
      .catch(() => {
        setServiceUnavailable(true);
      });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
    setError(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFileDate = (id: string, date: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, date } : f))
    );
  };

  const handleAnalyze = async () => {
    const firstFile = files[0]?.file;
    if (!firstFile) return;

    // Client-side validation before hitting API
    if (firstFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    if (firstFile.size > 10 * 1024 * 1024) {
      setError("File too large. Max allowed size is 10 MB.");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    // Animate progress bar while waiting for API
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 4;
      if (fakeProgress < 88) {
        setProgress(fakeProgress);
      }
    }, 200);

    // Build multipart/form-data with field name "file" as required by backend
    const formData = new FormData();
    formData.append("file", firstFile);

    try {
      const response = await fetch(`${API_BASE}/api/v1/upload-report`, {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        const message =
          ERROR_MESSAGES[response.status] ??
          "Something went wrong. Please try again.";
        setError(message);
        setIsAnalyzing(false);
        setProgress(0);
        return;
      }

      // API returns LabReport: { patient_name, report_date, parameters[] }
      const data = await response.json();
      localStorage.setItem("labReportData", JSON.stringify(data));
      setProgress(100);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch {
      clearInterval(interval);
      setError("Something went wrong. Please try again.");
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Service Unavailable Banner */}
      {serviceUnavailable && (
        <div className="bg-[#ef4444] text-white px-6 py-3 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            Service unavailable. Please try again later.
          </span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0f172a] mb-4">
            Upload Your Lab Reports
          </h1>
          <p className="text-lg text-[#64748b] mb-2">
            Upload multiple lab reports to track your health trends over time
          </p>
          <p className="text-sm text-[#7c3aed] font-medium">
            💡 Upload previous reports for comprehensive trend analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <h2 className="text-lg font-bold text-[#0f172a] mb-4">
              Add Reports
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-[#0d9488] bg-[#0d9488]/5 border-solid"
                  : "border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#0d9488]/5"
              }`}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-[#0d9488]/10 rounded-2xl flex items-center justify-center">
                  <UploadIcon className="w-7 h-7 text-[#0d9488]" />
                </div>

                <div>
                  <p className="text-base font-medium text-[#0f172a] mb-1">
                    Drag &amp; drop reports here
                  </p>
                  <p className="text-sm text-[#64748b]">or click to browse</p>
                </div>
                <p className="text-xs text-[#64748b]">
                  PDF lab reports only • Max 10MB each
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#ef4444] font-medium">{error}</span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#64748b]">
              <Shield className="w-4 h-4 text-[#0d9488]" />
              <span>Your report is processed securely and never stored</span>
            </div>

            <div className="mt-6 p-4 bg-[#7c3aed]/5 rounded-lg border border-[#7c3aed]/20">
              <p className="text-sm text-[#0f172a] leading-relaxed">
                <strong className="text-[#7c3aed]">Pro Tip:</strong> Upload 3–4
                reports from different dates to unlock detailed trend analysis and
                see how your health metrics change over time.
              </p>
            </div>
          </div>

          {/* Uploaded Files List */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0f172a]">
                Uploaded Reports ({files.length})
              </h2>
              {files.length > 0 && (
                <span className="text-xs bg-[#0d9488]/10 text-[#0d9488] px-3 py-1 rounded-full font-medium">
                  {files.length} {files.length === 1 ? "report" : "reports"}
                </span>
              )}
            </div>

            {files.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-[#e2e8f0] mx-auto mb-3" />
                <p className="text-sm text-[#64748b]">No reports uploaded yet</p>
                <p className="text-xs text-[#64748b] mt-1">
                  Upload your first report to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {files.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    className="flex items-start gap-3 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] hover:border-[#0d9488] transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#0d9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#0d9488]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0f172a] truncate">
                            {uploadedFile.file.name}
                          </p>
                          <p className="text-xs text-[#64748b]">
                            {(uploadedFile.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(uploadedFile.id)}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#ef4444]/10 text-[#64748b] hover:text-[#ef4444] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
                        <input
                          type="date"
                          value={uploadedFile.date}
                          onChange={(e) =>
                            updateFileDate(uploadedFile.id, e.target.value)
                          }
                          className="text-xs text-[#0f172a] border border-[#e2e8f0] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                        />
                        <span className="text-xs text-[#64748b]">Report Date</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        {files.length > 0 && !isAnalyzing && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Analyze {files.length} {files.length === 1 ? "Report" : "Reports"}
              <ArrowRight className="w-5 h-5" />
            </button>
            {files.length >= 2 && (
              <p className="text-sm text-[#22c55e] mt-3 font-medium">
                ✓ Multiple reports detected - Trend analysis will be available
              </p>
            )}
          </div>
        )}

        {/* Progress Bar while analyzing */}
        {isAnalyzing && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#0f172a]">
                Analyzing {files.length}{" "}
                {files.length === 1 ? "report" : "reports"}...
              </span>
              <span className="text-sm font-medium text-[#0d9488]">
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0d9488] to-[#7c3aed] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#64748b] mt-2">
              Processing files and generating insights...
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-8 border border-[#e2e8f0] mb-4 text-center">
            <div className="text-4xl font-bold text-[#0d9488] mb-2">
              Instant Analysis
            </div>
            <div className="text-lg text-[#64748b]">
              Get comprehensive health insights in seconds
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#7c3aed] mb-1">
                AI-Powered
              </div>
              <div className="text-sm text-[#64748b]">Smart trend insights</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
              <div className="text-2xl font-bold text-[#22c55e] mb-1">Secure</div>
              <div className="text-sm text-[#64748b]">Your data is safe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
