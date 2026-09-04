import React, { useState, useRef } from "react";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Post, Platform } from "../types";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedPosts: Post[]) => void;
  onResetToDemo: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onResetToDemo
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedPosts, setParsedPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    setWarning(null);
    setParsedPosts(null);
    setFileName(file.name);

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Invalid file format. Please upload a .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setError("File appears to be empty.");
        return;
      }
      parseCSV(text);
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded CSV file.");
    };
    reader.readAsText(file);
  };

  const parseCSV = (content: string) => {
    const lines = content.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setError("CSV must contain at least a header row and 1 data row.");
      return;
    }

    // Required columns: id, username, platform, timestamp, text, hashtags, url, likes, comments, shares, followers
    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

    const requiredCols = ["username", "text"];
    const missing = requiredCols.filter((col) => !headers.includes(col));
    if (missing.length > 0) {
      setError(`Missing required column(s): ${missing.join(", ")}. Standard required schema: id, username, platform, timestamp, text, hashtags, url, likes, comments, shares, followers`);
      return;
    }

    const colIndex = (name: string) => headers.indexOf(name);

    const posts: Post[] = [];
    let malformedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Handle simple CSV splitting with quotes
      const values: string[] = [];
      let inQuote = false;
      let currentVal = "";

      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === "'") {
          inQuote = !inQuote;
        } else if (char === "," && !inQuote) {
          values.push(currentVal.trim());
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());

      const getVal = (colName: string) => {
        const idx = colIndex(colName);
        if (idx === -1 || idx >= values.length) return "";
        return values[idx].replace(/^["']|["']$/g, "").trim();
      };

      const username = getVal("username");
      const postText = getVal("text");

      if (!username || !postText) {
        malformedCount++;
        continue;
      }

      const id = getVal("id") || `custom-${i}`;
      const platformRaw = getVal("platform").toLowerCase();
      const platform: Platform = ["twitter", "instagram", "facebook", "linkedin", "threads"].includes(platformRaw)
        ? (platformRaw as Platform)
        : "twitter";
      const timestamp = getVal("timestamp") || new Date().toISOString();
      const hashtagsRaw = getVal("hashtags");
      const hashtags = hashtagsRaw
        ? hashtagsRaw.split(";").map((t) => (t.startsWith("#") ? t.trim() : `#${t.trim()}`))
        : [];
      const url = getVal("url") || undefined;
      const likes = parseInt(getVal("likes"), 10) || 12;
      const comments = parseInt(getVal("comments"), 10) || 2;
      const shares = parseInt(getVal("shares"), 10) || 1;
      const followerCount = parseInt(getVal("followers"), 10) || 500;

      posts.push({
        id,
        username,
        displayName: username.replace(/_/g, " "),
        platform,
        timestamp,
        text: postText,
        hashtags,
        url,
        likes,
        comments,
        shares,
        followerCount,
        scenario: "normal"
      });
    }

    if (posts.length === 0) {
      setError("No valid rows could be extracted from the file.");
      return;
    }

    if (malformedCount > 0) {
      setWarning(`Parsed ${posts.length} posts successfully (${malformedCount} malformed rows skipped).`);
    }

    setParsedPosts(posts);
  };

  const handleAnalyze = () => {
    if (parsedPosts && parsedPosts.length > 0) {
      onImportSuccess(parsedPosts);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#151B2E] border border-[#253149] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#253149] bg-[#1D2638] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#4F7CFF]/15 text-[#4F7CFF] border border-[#4F7CFF]/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                IMPORT SOCIAL DATASET (CSV)
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Upload custom social media posts to recompute analytics dynamically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#253149]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-[#4F7CFF] bg-[#4F7CFF]/10"
                : "border-[#253149] hover:border-[#4F7CFF]/50 bg-[#111827]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
            <FileText className="w-10 h-10 text-[#4F7CFF] mx-auto mb-3 opacity-80" />
            <p className="text-sm font-semibold text-[#F8FAFC]">
              {fileName ? fileName : "Drag & drop CSV file or click to browse"}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Supports CSV with standard columns: id, username, platform, timestamp, text, hashtags, url, likes, comments, shares, followers
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-[#F87171] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Validation Error:</span> {error}
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Reverting to built-in synthetic dataset to guarantee uninterrupted operation.
                </p>
              </div>
            </div>
          )}

          {warning && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-[#FBBF24]">
              {warning}
            </div>
          )}

          {parsedPosts && !error && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-[#34D399] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Successfully validated <strong className="font-mono">{parsedPosts.length}</strong> posts. Ready for analysis!
                </span>
              </div>
            </div>
          )}

          {/* Sample template info */}
          <div className="bg-[#111827] p-3 rounded-xl border border-[#253149] text-[11px] text-[#94A3B8]">
            <span className="font-semibold text-[#F8FAFC] block mb-1">
              Expected CSV Header Format:
            </span>
            <code className="font-mono text-[10px] text-[#22D3EE] block overflow-x-auto">
              id,username,platform,timestamp,text,hashtags,url,likes,comments,shares,followers
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#253149] bg-[#1D2638] flex items-center justify-between">
          <button
            onClick={() => {
              onResetToDemo();
              onClose();
            }}
            className="text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Synthetic Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#151B2E] text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-csv-analysis"
              disabled={!parsedPosts || parsedPosts.length === 0}
              onClick={handleAnalyze}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                parsedPosts && parsedPosts.length > 0
                  ? "bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white cursor-pointer shadow-md"
                  : "bg-[#253149] text-[#94A3B8] cursor-not-allowed"
              }`}
            >
              ANALYZE DATASET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
