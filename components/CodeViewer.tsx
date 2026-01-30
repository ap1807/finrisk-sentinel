import React, { useState } from 'react';
import { javaFiles } from '../utils/javaSource';

interface Props {
  onClose: () => void;
}

const CodeViewer: React.FC<Props> = ({ onClose }) => {
  const [activeFile, setActiveFile] = useState(javaFiles[1]); // Default to RiskEngine

  return (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex overflow-hidden border border-slate-700 flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#252526] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#3e3e42] flex flex-col">
          <div className="p-4 border-b border-[#3e3e42] flex items-center justify-between">
            <h3 className="text-slate-300 font-semibold text-sm tracking-wide uppercase">Project Explorer</h3>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">JAVA</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {javaFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(file)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  activeFile.name === file.name 
                    ? 'bg-[#37373d] text-white border-l-2 border-blue-500' 
                    : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
                }`}
              >
                <span className="text-orange-400 text-lg">J</span>
                {file.name}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-[#3e3e42] text-xs text-slate-500">
             Spring Boot 3.2.0
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs/Header */}
          <div className="bg-[#1e1e1e] flex items-center justify-between border-b border-[#3e3e42]">
            <div className="flex">
              <div className="bg-[#1e1e1e] text-slate-200 px-4 py-3 text-sm border-t-2 border-blue-500 font-medium flex items-center gap-2">
                 <span className="text-orange-400">J</span> {activeFile.name}
              </div>
            </div>
            <div className="px-4">
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          {/* File Description Bar */}
          <div className="bg-[#2d2d2d] px-4 py-2 text-xs text-slate-400 border-b border-[#3e3e42]">
             {activeFile.path} — <span className="text-slate-500">{activeFile.description}</span>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-[#d4d4d4]">
            <pre className="whitespace-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;