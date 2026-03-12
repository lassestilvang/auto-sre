import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function Docs() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadDocs = async () => {
      try {
        const response = await fetch(`${API_BASE}/docs/api.md`);
        if (!response.ok) {
          throw new Error('Unable to load API docs.');
        }
        const text = await response.text();
        if (mounted) setContent(text);
      } catch (err) {
        if (mounted) setError('API docs are unavailable. Make sure the demo service is running.');
      }
    };
    loadDocs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <BookOpen className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">API Docs</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="text-red-400 text-sm font-semibold mb-4">{error}</div>
          )}
          {!error && !content && (
            <div className="text-slate-500 text-sm">Loading documentation...</div>
          )}
          {content && (
            <div className="markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Docs;
