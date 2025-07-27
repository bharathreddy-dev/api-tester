'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Send, Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface CtaProps {
  navItemPath?: string;
}

const Cta: FC<CtaProps> = ({ navItemPath = 'api-demo' }) => {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const methodColors: { [key: string]: string } = {
    GET: 'text-sky-400 border-sky-400/50',
    POST: 'text-emerald-400 border-emerald-400/50',
    PUT: 'text-amber-400 border-amber-400/50',
    DELETE: 'text-red-400 border-red-400/50',
  };

  const statusColors: { [key: string]: string } = {
    '2xx': 'text-emerald-400',
    '4xx': 'text-amber-400',
    '5xx': 'text-red-400',
    default: 'text-slate-400',
  };

  const getStatusColor = (s: number | null): string => {
    if (!s) return statusColors.default;
    if (s >= 200 && s < 300) return statusColors['2xx'];
    if (s >= 400 && s < 500) return statusColors['4xx'];
    if (s >= 500 && s < 600) return statusColors['5xx'];
    return statusColors.default;
  };
  
  const showDefaultResponse = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setResponse({
        message: "This is a default response. Try your own API endpoint!",
        documentation: "https://github.com/your-repo",
        data: [
          { id: 1, product: "Quantum Laptop", stock: 15, price: 2499.99 },
          { id: 2, product: "Fusion Smartphone", stock: 48, price: 899.99 },
          { id: 3, product: "Neutrino Earbuds", stock: 120, price: 199.99 }
        ]
      });
      setStatus(200);
      setStatusText("OK");
      setResponseTime(42);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    showDefaultResponse();
  }, [showDefaultResponse]);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);
    setResponseTime(null);

    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST' || method === 'PUT') {
        try {
          options.body = JSON.stringify(JSON.parse(body));
        } catch (e) {
          throw new Error('Invalid JSON in request body.');
        }
      }

      const res = await fetch(url, options);
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatus(res.status);
      setStatusText(res.statusText);

      if (!res.ok) {
        let errorBody;
        try {
            errorBody = await res.json();
        } catch {
            errorBody = "Couldn't parse error response.";
        }
        setResponse(errorBody);
        throw new Error(`Request failed with status ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
       if(!response) {
         setResponse({ error: err.message || 'An unexpected error occurred.' });
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id={navItemPath} className="bg-slate-900 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Test Drive Our API Instantly
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-400">
            No sign-up required. Make live API calls directly from your browser and see the results in real-time.
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto bg-slate-950/70 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl shadow-blue-500/10 overflow-hidden">
          {/* Request Bar */}
          <div className="flex flex-col sm:flex-row items-center p-3 sm:p-4 gap-2 border-b border-slate-800">
            <div className="w-full sm:w-auto">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full sm:w-auto font-semibold bg-slate-800 border border-slate-700 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${methodColors[method]}`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/users"
              className="flex-grow w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
              <span>Send</span>
            </button>
          </div>

          {/* Request Body for POST/PUT */}
          {(method === 'POST' || method === 'PUT') && (
            <div className="p-4 border-b border-slate-800">
                <label htmlFor="body-textarea" className="text-sm font-medium text-slate-400 block mb-2">Request Body (JSON)</label>
              <textarea
                id="body-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "key": "value" }'
                className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-md text-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
            </div>
          )}

          {/* Response Area */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Response</h3>
            <div className="flex items-center gap-6 text-sm text-slate-400 mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                {loading ? (
                   <span className="text-slate-500">Loading...</span>
                ) : (
                  <span className={`font-bold ${getStatusColor(status)}`}>
                    {status} {statusText}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <Clock className="h-4 w-4" />
                <span className="font-medium">Time:</span>
                <span className="font-bold text-white">
                  {loading ? '...' : responseTime} ms
                </span>
              </div>
            </div>

            <div className="w-full h-72 bg-black/50 rounded-lg overflow-auto">
              {loading && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Error</span>
                  <p className="text-sm text-center">{error}</p>
                </div>
              )}
              {response && !loading && (
                <pre className="p-4 text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
            <p className="text-slate-300 text-lg">Ready to build something great?</p>
            <Link href="#" className="mt-4 inline-block bg-white text-slate-900 font-bold text-lg px-8 py-3 rounded-md hover:bg-slate-200 transition-colors">
                Get Started for Free
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;