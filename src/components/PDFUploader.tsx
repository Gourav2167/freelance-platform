"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

export default function PDFUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [done, setDone] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setUploading(true);

        const formData = new FormData();
        formData.append("file", selected);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("Chunked data from LangChain:", data);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
            setDone(true);
            setTimeout(() => {
                setDone(false);
                setFile(null);
            }, 3000);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl pointer-events-auto w-80 relative overflow-hidden group border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
                {!file ? (
                    <>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 mb-2 group-hover:bg-white/10 transition-colors">
                            <UploadCloud className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium tracking-tight text-white drop-shadow-sm">Upload Project Scope</h3>
                            <p className="text-sm text-obsidian-200 mt-1">Drag & drop PDF to expand the Nebula.</p>
                        </div>
                        <label className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 transition-all rounded-xl cursor-pointer text-sm font-medium border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Browse Files
                            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
                        </label>
                    </>
                ) : uploading ? (
                    <div className="py-4">
                        <Loader2 className="w-10 h-10 text-fuchsia-400 animate-spin mx-auto mb-3 opacity-80" />
                        <h3 className="text-sm font-medium text-white tracking-wide">Semantic Chunking...</h3>
                        <p className="text-xs text-obsidian-200 mt-1">Extracting Budget, Tech Stack & Timeline</p>
                    </div>
                ) : done ? (
                    <div className="py-4">
                        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 shadow-emerald-400/50 drop-shadow-md" />
                        <h3 className="text-sm font-medium text-white tracking-wide">Nebula Initialized</h3>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
