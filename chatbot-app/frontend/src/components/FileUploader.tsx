import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface FileUploaderProps {
  label: string;
  onUploaded: (payload: { path: string; fileName: string }) => void;
}

const FileUploader = ({ label, onUploaded }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (uploadError) throw uploadError;
      setFileName(file.name);
      onUploaded({ path: filePath, fileName: file.name });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h3 className="text-lg font-semibold">{label}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">PDF, DOCX, or TXT.</p>
      </div>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleUpload}
        className="w-full cursor-pointer rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm dark:border-slate-700"
      />
      {uploading && <p className="text-xs text-slate-500">Uploading...</p>}
      {fileName && <p className="text-xs text-slate-500">Uploaded: {fileName}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploader;
