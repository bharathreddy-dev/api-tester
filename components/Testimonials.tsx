'use client';

import React, { useState, FormEvent, FC } from 'react';
import { ChevronDown, Loader2, Send, Server, Braces, VenetianMask } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface DummyData {
  [key: string]: any;
}

const dummyData: DummyData = {
  '/users': [
    { id: 1, name: 'Amelia C. Harris', email: 'amelia.harris@example.com', role: 'Admin' },
    { id: 2, name: 'Benjamin Carter', email: 'ben.carter@example.com', role: 'Developer' },
    { id: 3, name: 'Olivia Martinez', email: 'olivia.m@example.com', role: 'User' },
  ],
  '/products': [
    { id: 101, name: 'Quantum Laptop', price: 1999.99, inStock: true },
    { id: 102, name: 'Nebula Smartwatch', price: 349.99, inStock: false },
    { id: 103, name: 'Fusion VR Headset', price: 599.00, inStock: true },
  ],
  '/health': {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
          database: 'connected',
          cache: 'connected',
      }
  },
  'default': {
    message: "Resource not found. Try endpoints like '/users', '/products', or '/health'.",
  },
};

const highlightJson = (jsonString: string): string => {
  if (!jsonString) return '';
  jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'text-yellow-400'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-cyan-400'; // key
      } else {
        cls = 'text-emerald-400'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-400'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-rose-400'; // null
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

const Testimonials: FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://api.example.dev/users');
  const [requestBody, setRequestBody] = useState('{\n  "name": "New User",\n  "email": "new.user@example.com"\n}');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_API_KEY"\n}');
  const [activeRequestTab, setActiveRequestTab] = useState<'body' | 'headers'>('headers');
  
  const [response, setResponse] = useState<any | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [activeResponseTab, setActiveResponseTab] = useState<'body' | 'headers'>('body');

  const showBodyInput = ['POST', 'PUT', 'PATCH'].includes(method);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseHeaders(null);
    setStatus(null);
    setStatusText(null);
    setResponseTime(null);
    const startTime = Date.now();

    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;

      await new Promise(res => setTimeout(res, 800 + Math.random() * 500));

      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      let resData;
      let resStatus = 404;
      let resStatusText = "Not Found";
      let resHeaders = { 'Content-Type': 'application/json', 'X-Powered-By': 'Next-Test-API' };

      if (Object.keys(dummyData).includes(path)) {
        if (method === 'GET') {
          resData = dummyData[path];
          resStatus = 200;
          resStatusText = "OK";
        } else if (showBodyInput) {
          try {
            const parsedBody = JSON.parse(requestBody);
            resData = { message: `Resource at ${path} processed with ${method}`, data: parsedBody };
            resStatus = method === 'POST' ? 201 : 200;
            resStatusText = method === 'POST' ? 'Created' : 'OK';
          } catch (jsonError) {
            resStatus = 400;
            resStatusText = "Bad Request";
            resData = { error: "Invalid JSON in request body." };
          }
        } else {
            resData = { message: `${method} request to ${path} successful` };
            resStatus = 200;
            resStatusText = "OK";
        }
      } else {
        resData = dummyData['default'];
      }
      
      setResponse(resData);
      setResponseHeaders(resHeaders);
      setStatus(resStatus);
      setStatusText(resStatusText);

    } catch (err: any) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setError(err.message || 'An unexpected error occurred. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = () => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    if (status >= 400) return 'text-red-500';
    return 'text-gray-400';
  }

  return (
    <section id="testimonials" className="bg-gray-50 dark:bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-sky-600 dark:text-sky-400">API Playground</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Test Your Endpoints in Real-Time
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Simulate API requests directly from your browser. Our interactive console lets you test endpoints, inspect responses, and debug with an interface inspired by Postman.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-2xl bg-white dark:bg-gray-900/50 dark:ring-1 dark:ring-white/10 shadow-2xl ring-1 ring-gray-900/5">
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:w-auto">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as HttpMethod)}
                        className="w-full sm:w-36 appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-2 pl-3 pr-8 font-semibold text-gray-800 dark:text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                        <option>PATCH</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.dev/v1/resource"
                  className="flex-grow w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-800 dark:text-gray-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono text-sm"
                />
                <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span>{loading ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
              {showBodyInput && (
                <button
                  onClick={() => setActiveRequestTab('body')}
                  className={`px-4 py-2 transition-colors ${activeRequestTab === 'body' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  Body
                </button>
              )}
              <button
                onClick={() => setActiveRequestTab('headers')}
                className={`px-4 py-2 transition-colors ${activeRequestTab === 'headers' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                Headers
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50">
                {showBodyInput && activeRequestTab === 'body' && (
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-40 resize-y border-0 bg-transparent p-4 font-mono text-sm text-gray-800 dark:text-gray-200 focus:ring-0"
                    spellCheck="false"
                  />
                )}
                {activeRequestTab === 'headers' && (
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    className="w-full h-40 resize-y border-0 bg-transparent p-4 font-mono text-sm text-gray-800 dark:text-gray-200 focus:ring-0"
                    spellCheck="false"
                  />
                )}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response</h3>
            <div className="mt-2 rounded-lg bg-gray-900 min-h-[20rem] flex flex-col ring-1 ring-gray-700">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                        <p className="mt-4 font-medium">Fetching response...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-red-400">
                      <p className="font-bold">Error:</p>
                      <p className="font-mono mt-2">{error}</p>
                    </div>
                ) : response ? (
                    <>
                        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-700 text-sm">
                            <div className="flex items-center gap-4">
                                <p>Status: <span className={`font-bold ${getStatusColor()}`}>{status} {statusText}</span></p>
                                <p>Time: <span className="font-bold text-sky-400">{responseTime} ms</span></p>
                            </div>
                            <div className="flex text-gray-400">
                               <button onClick={() => setActiveResponseTab('body')} className={`px-3 py-1 rounded-md text-xs ${activeResponseTab === 'body' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800'}`}>Body</button>
                               <button onClick={() => setActiveResponseTab('headers')} className={`px-3 py-1 rounded-md text-xs ${activeResponseTab === 'headers' ? 'bg-gray-700 text-white' : 'hover:bg-gray-800'}`}>Headers</button>
                            </div>
                        </div>
                        <div className="flex-grow p-4 overflow-auto">
                            {activeResponseTab === 'body' && (
                                <pre className="text-sm">
                                    <code
                                      className="font-mono text-white"
                                      dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(response, null, 2)) }}
                                    />
                                </pre>
                            )}
                            {activeResponseTab === 'headers' && (
                                <pre className="text-sm">
                                    <code
                                      className="font-mono text-white"
                                      dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(responseHeaders, null, 2)) }}
                                    />
                                </pre>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Server className="h-10 w-10" />
                        <p className="mt-4 text-base font-medium">Your response will appear here</p>
                        <p className="text-sm text-gray-600">Click "Send" to make a request</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;