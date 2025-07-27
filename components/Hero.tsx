"use client";

import React, { useState, useEffect, FC, FormEvent } from 'react';
import { Send, ChevronDown, LoaderCircle, ServerCrash, Zap } from 'lucide-react';

// Define the type for the response data
interface ApiResponse {
  data: any;
  status: number;
  time: number;
  size: string;
}

const Hero: FC = () => {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dummyResponse: ApiResponse = {
    data: {
      message: "Welcome to the Instant API Tester!",
      instructions: "Enter a URL, select a method, and click 'Send' to test an API endpoint.",
      example: {
        userId: 1,
        id: 1,
        title: "This is a sample todo item.",
        completed: false
      }
    },
    status: 200,
    time: 42,
    size: "158 B"
  };

  useEffect(() => {
    // Set initial dummy response on mount
    setResponse(dummyResponse);
  }, []);

  const handleSendRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("URL cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const res = await fetch(url, { method });
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseBody = await res.json();
      const responseSize = new TextEncoder().encode(JSON.stringify(responseBody)).length;
      
      const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes'
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
      }

      setResponse({
        data: responseBody,
        status: res.status,
        time: duration,
        size: formatBytes(responseSize)
      });

      if (!res.ok) {
        setError(`HTTP error! Status: ${res.status}`);
      }

    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(err.message || 'An unexpected error occurred. Check the console and network tab for details.');
      setResponse({
        data: { 
          error: "Failed to fetch",
          message: err.message,
          tip: "This might be a CORS issue, a network error, or an invalid URL."
        },
        status: 0, // Used for client-side errors
        time: duration,
        size: '0 Bytes'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 300 && status < 400) return 'text-sky-400';
    if (status >= 400 && status < 500) return 'text-amber-400';
    if (status >= 500) return 'text-rose-500';
    return 'text-slate-400';
  };

  return (
    <section id="hero" className="w-full bg-slate-900 text-slate-100 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-sky-400" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 text-transparent bg-clip-text">
            Instant API Tester
          </h1>
        </div>
        <p className="max-w-2xl mx-auto mt-4 mb-10 text-lg text-slate-400">
          Craft, test, and debug your API requests directly in your browser. No more context switching, just seamless development.
        </p>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-2xl shadow-sky-900/20 border border-slate-700 backdrop-blur-sm">
          <form onSubmit={handleSendRequest} className="flex items-center p-4 border-b border-slate-700">
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="appearance-none bg-slate-700 text-slate-100 font-semibold py-2 pl-4 pr-10 rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-all"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              className="w-full bg-slate-900 text-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center shrink-0 justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-6 rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>

          <div className="p-4">
            <div className="flex items-center gap-6 text-sm font-medium mb-4 text-slate-400">
              {(response || error) && (
                <>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <span className={`font-bold ${getStatusColor(response?.status ?? 0)}`}>
                        {response?.status !== 0 ? response?.status : <ServerCrash className="w-4 h-4 inline-block text-rose-500" />}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Time:</span>
                    <span className="font-bold text-slate-200">{response?.time ?? 0} ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Size:</span>
                    <span className="font-bold text-slate-200">{response?.size ?? '0 Bytes'}</span>
                  </div>
                </>
              )}
            </div>
            <div className="bg-black/50 rounded-lg overflow-hidden">
                <pre className="text-left p-4 text-sm text-slate-200 overflow-x-auto h-[350px]">
                  <code>
                    {loading && 'Fetching response...'}
                    {response && JSON.stringify(response.data, null, 2)}
                  </code>
                </pre>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-sm font-semibold text-slate-400 mb-6">INTEGRATES WITH YOUR FAVORITE TOOLS</p>
          <div className="flex justify-center items-center gap-8 md:gap-12 opacity-60">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current text-slate-500 hover:text-slate-300 transition-colors">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current text-slate-500 hover:text-slate-300 transition-colors">
              <title>GitLab</title>
              <path d="m23.955 13.438-2.033-6.25a.86.86 0 0 0-.818-.625H2.894a.86.86 0 0 0-.818.625l-2.033 6.25a.66.66 0 0 0 .253.775l9.428 6.062a.88.88 0 0 0 1.052 0l9.428-6.062a.66.66 0 0 0 .253-.775Z" />
            </svg>
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current text-slate-500 hover:text-slate-300 transition-colors">
                <title>Slack</title>
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.522h5.042a2.527 2.527 0 0 1 2.521 2.522v5.042a2.527 2.527 0 0 1-2.521 2.521H8.834a2.527 2.527 0 0 1-2.521-2.521v-5.042zM8.834 5.042a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 13.876 5.042a2.528 2.528 0 0 1-2.521 2.522H8.834v-2.522zM8.834 6.313a2.528 2.528 0 0 1-2.523 2.521V3.792a2.528 2.528 0 0 1 2.523-2.521h5.042a2.528 2.528 0 0 1 2.521 2.521v2.522H8.834zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.685 8.834a2.528 2.528 0 0 1-2.523 2.522V1.274a2.528 2.528 0 0 1 2.523-2.521h-5.04a2.528 2.528 0 0 1-2.522 2.521v5.042h5.04z" />
            </svg>
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current text-slate-500 hover:text-slate-300 transition-colors">
              <title>Vercel</title>
              <path d="M12 1.5l12 21H0L12 1.5z"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;