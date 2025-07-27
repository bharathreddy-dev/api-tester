"use client";

import { useState, FC, FormEvent, useRef, useEffect } from 'react';
import { ChevronDown, Send, Loader2 } from 'lucide-react';

interface ApiHandlerProps {
  navItemPath: string;
}

const initialResponse = {
  message: "This is a default response. Try sending a real request to see it in action!",
  data: [
    { "id": 1, "type": "product", "attributes": { "name": "Modern Desk Lamp", "price": "79.99" } },
    { "id": 2, "type": "product", "attributes": { "name": "Ergonomic Chair", "price": "349.99" } }
  ],
  timestamp: new Date().toISOString(),
};

const ApiHandler: FC<ApiHandlerProps> = ({ navItemPath }) => {
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/users/1');
  const [requestBody, setRequestBody] = useState<string>(JSON.stringify({ title: 'New Post', body: 'This is the body of the post.', userId: 1 }, null, 2));
  const [response, setResponse] = useState<any>(initialResponse);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>('200 OK (Default)');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const methods: { name: string, color: string }[] = [
    { name: 'GET', color: 'text-sky-400' },
    { name: 'POST', color: 'text-green-400' },
    { name: 'PUT', color: 'text-yellow-400' },
    { name: 'DELETE', color: 'text-red-400' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMethodSelect = (m: string) => {
    setMethod(m);
    setDropdownOpen(false);
  };

  const handleSendRequest = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (['POST', 'PUT'].includes(method)) {
        try {
          JSON.parse(requestBody); // Validate JSON before sending
          options.body = requestBody;
        } catch (jsonError) {
          throw new Error("Invalid JSON in request body.");
        }
      }

      const res = await fetch(url, options);
      const endTime = Date.now();
      const duration = endTime - startTime;

      setStatus(`${res.status} ${res.statusText} (${duration}ms)`);

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      setStatus(`Error (${duration}ms)`);
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const formatJsonResponse = (json: object) => {
    const jsonString = JSON.stringify(json, null, 2);
    const html = jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-green-400'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-400'; // key
        } else {
          cls = 'text-amber-400'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-400'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-slate-500'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
    return { __html: html };
  };

  const currentMethodColor = methods.find(m => m.name === method)?.color || 'text-slate-400';

  return (
    <section id={navItemPath} className="w-full py-20 lg:py-28 bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">API Request Simulator</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
            A Postman-style interface to test API endpoints directly from your browser. Configure your request and see the live response below.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-lg shadow-2xl shadow-slate-900/50 p-4 sm:p-6 backdrop-blur-sm">
          <form onSubmit={handleSendRequest} className="flex flex-col sm:flex-row items-center gap-2 mb-4">
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className={`flex items-center justify-between w-full sm:w-32 px-4 py-2.5 font-semibold bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors ${currentMethodColor}`}
              >
                <span>{method}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                  {methods.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => handleMethodSelect(m.name)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-700 font-semibold transition-colors ${m.color}`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              className="flex-grow w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </>
              )}
            </button>
          </form>

          {['POST', 'PUT'].includes(method) && (
            <div className="mt-4">
              <label htmlFor="request-body" className="block text-sm font-medium text-slate-400 mb-2">Request Body (JSON)</label>
              <textarea
                id="request-body"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={8}
                className="w-full p-3 font-mono text-sm bg-slate-950 border border-slate-700 rounded-md text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                placeholder='{ "key": "value" }'
              />
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Response</h3>
            <div className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 rounded-t-md">
              <span className="text-sm font-medium text-slate-400">Status:</span>
              <span className={`font-mono text-sm font-semibold px-2 py-0.5 rounded-full ${status?.startsWith('2') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                {status || '...'}
              </span>
            </div>
            <div className="h-96 overflow-y-auto bg-slate-950 p-4 border border-t-0 border-slate-700 rounded-b-md">
              <pre className="text-sm whitespace-pre-wrap break-all">
                {loading && <div className="text-slate-400">Loading response...</div>}
                {response && <code dangerouslySetInnerHTML={formatJsonResponse(response)} />}
                {!loading && !response && <div className="text-slate-500">No response data.</div>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiHandler;