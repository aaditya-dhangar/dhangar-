
import React, { useState } from 'react';
import { FileUp, Upload, Loader2, FileText } from 'lucide-react';

interface UploaderProps {
  onProcess: (text: string, title: string) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onProcess, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore - Using PDF.js from window
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // Limit to first 10 pages for speed
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText;
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsExtracting(true);
    try {
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        alert("We couldn't extract enough text from this PDF. Please try a different document.");
        return;
      }
      onProcess(text, file.name.replace('.pdf', ''));
    } catch (error) {
      console.error(error);
      alert("Error reading PDF. Make sure it's not password protected.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Upload Notes</h1>
        <p className="text-gray-500">Transform your PDF lecture notes into a custom mock test in seconds.</p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
          file ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'
        }`}
      >
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading || isExtracting}
        />
        
        {file ? (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-blue-600 rounded-full mb-4 shadow-lg shadow-blue-200">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-gray-900 truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">Click or drag to upload PDF</p>
            <p className="text-xs text-gray-400 mt-1">Maximum file size 10MB</p>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isLoading || isExtracting}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
      >
        {(isLoading || isExtracting) ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isExtracting ? 'Extracting Text...' : 'Generating Quiz...'}
          </>
        ) : (
          <>
            <FileUp className="w-5 h-5" />
            Create Mock Test
          </>
        )}
      </button>
      
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
        <h4 className="text-amber-800 font-medium text-sm mb-1">How it works</h4>
        <p className="text-amber-700 text-xs leading-relaxed">
          Our AI reads your notes, identifies key concepts, and crafts challenging questions to help you prepare.
        </p>
      </div>
    </div>
  );
};
