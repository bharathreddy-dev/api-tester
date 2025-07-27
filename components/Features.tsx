"use client";

import React, { useState, useEffect, FC } from 'react';
import { ChevronDown, Send, Plus, Trash2, LoaderCircle, AlertTriangle } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type KeyValuePair = { id: string; key: string; value: string; enabled: boolean };
type RequestTabs = 'params' | 'headers' | 'body';
type ResponseTabs = 'body' | 'headers';

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  time: number;
  size: number;
}

// --- DUMMY INITIAL RESPONSE ---
const initialDummyResponse: ApiResponse = {
  status: 200,
  statusText: "OK",
  data: {
    id: 1,
    title: "delectus aut autem",
    completed: false,
    user: {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz"
    }
  },
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=14400",
    "expires": "Sat, 20 Jul 2024 20:00:00 GMT",
  },
  time: 128,
  size: 207
};

// --- HELPER SUB-COMPONENTS (Not exported) ---

const KeyValueEditor: FC<{
  items: KeyValuePair[];
  setItems: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
  placeholderKey: string;
  placeholderValue: string;
}> = ({ items, setItems, placeholderKey, placeholderValue }) => {

  const handleItemChange = (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: crypto.randomUUID(), key: '', value: '', enabled: true }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2 p-1">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={(e) => handleItemChange(item.id, 'enabled', e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
          />
          <input
            type="text"
            value={item.key}
            onChange={(e) => handleItemChange(item.id, 'key', e.target.value)}
            placeholder={placeholderKey}
            className="flex-1 rounded-md border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500"
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
            placeholder={placeholderValue}
            className="flex-1 rounded-md border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-300 placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500"
          />
          <button onClick={() => removeItem(item.id)} className="p-2 text-slate-500 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="mt-2 flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-sky-400 hover:bg-sky-500/10"
      >
        <Plus className="h-4 w-4" />
        <span>Add</span>
      </button>
    </div>
  );
};


const JsonViewer: FC<{ data: any }> = ({ data }) => {
  const jsonString = JSON.stringify(data, null, 2);

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-green-400'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-400'; // key
        } else {
          cls = 'text-amber-400'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-fuchsia-400'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-slate-500'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <pre className="overflow-x-auto bg-transparent p-4 text-sm">
      <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
    </pre>
  );
};


// --- MAIN COMPONENT ---
const Features = ({ navItemPath = "features" }: { navItemPath?: string }) => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [params, setParams] = useState<KeyValuePair[]>([]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([]);
  const [body, setBody] = useState('');
  
  const [activeRequestTab, setActiveRequestTab] = useState<RequestTabs>('params');
  const [activeResponseTab, setActiveResponseTab] = useState<ResponseTabs>('body');
  
  const [response, setResponse] = useState<ApiResponse | null>(initialDummyResponse);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const enabledParams = params.filter(p => p.enabled && p.key);
    const queryString = new URLSearchParams(enabledParams.map(p => [p.key, p.value])).toString();
    
    const [baseUrl] = url.split('?');
    if (queryString) {
      setUrl(`${baseUrl}?${queryString}`);
    } else {
      setUrl(baseUrl);
    }
  }, [params]);


  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach(h => {
        if (h.enabled && h.key) {
          requestHeaders[h.key] = h.value;
        }
      });
      
      const res = await fetch(url, {
        method,
        headers: requestHeaders,
        body: (method === 'POST' || method === 'PUT') ? body : undefined,
      });

      const endTime = Date.now();
      const responseData = await res.json();
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const size = (await (await res.blob()).size)
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: responseData,
        headers: responseHeaders,
        time: endTime - startTime,
        size: size,
      });

    } catch (err: any) {
      const endTime = Date.now();
      setError(err.message || 'An unexpected error occurred.');
      setResponse({
        status: 0,
        statusText: "Error",
        data: { error: err.message },
        headers: {},
        time: endTime - startTime,
        size: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'text-red-400';
    if (status >= 400) return 'text-amber-400';
    if (status >= 300) return 'text-yellow-400';
    if (status >= 200) return 'text-green-400';
    return 'text-slate-400';
  }

  const tabClass = (isActive: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-t-md cursor-pointer transition-colors ${
      isActive
        ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
        : 'text-slate-400 hover:bg-slate-700/50'
    }`;


  return (
    <section id={navItemPath} className="bg-slate-950 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Our API Interactively
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Don't just read about our features—try them. Use our live API explorer below to send requests and see real-time responses, just like you would in Postman.
          </p>
        </div>

        <div className="mt-16 w-full max-w-5xl mx-auto rounded-xl border border-slate-700 bg-slate-900/70 shadow-2xl shadow-sky-500/10 backdrop-blur-sm">
          {/* Request Section */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className="appearance-none w-full sm:w-32 rounded-md border-slate-600 bg-slate-800 py-2 pl-3 pr-8 text-sm font-semibold text-white focus:border-sky-500 focus:ring-sky-500"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <input 
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/v1/users"
                className="flex-1 rounded-md border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-300 font-mono placeholder-slate-500 focus:border-sky-500 focus:ring-sky-500"
              />
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </div>

          {/* Request Tabs */}
          <div className="p-4">
            <div className="border-b border-slate-700">
              <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                <button onClick={() => setActiveRequestTab('params')} className={tabClass(activeRequestTab === 'params')}>Params</button>
                <button onClick={() => setActiveRequestTab('headers')} className={tabClass(activeRequestTab === 'headers')}>Headers</button>
                <button onClick={() => setActiveRequestTab('body')} className={tabClass(activeRequestTab === 'body')}>Body</button>
              </nav>
            </div>
            <div className="py-4">
              {activeRequestTab === 'params' && <KeyValueEditor items={params} setItems={setParams} placeholderKey="Parameter" placeholderValue="Value"/>}
              {activeRequestTab === 'headers' && <KeyValueEditor items={headers} setItems={setHeaders} placeholderKey="Header" placeholderValue="Value"/>}
              {activeRequestTab === 'body' && (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{ "key": "value" }'
                  className="w-full h-40 font-mono text-sm p-3 rounded-md bg-slate-900 border border-slate-600 focus:border-sky-500 focus:ring-sky-500 text-slate-300 resize-y"
                />
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className="border-t border-slate-700">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Response</h3>
              {loading && (
                <div className="flex items-center justify-center h-48 text-slate-400">
                    <LoaderCircle className="h-8 w-8 animate-spin" />
                </div>
              )}
              {error && (
                 <div className="p-4 rounded-md bg-red-900/50 text-red-300 border border-red-700 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-red-400" />
                    <div>
                        <h4 className="font-semibold">Request Failed</h4>
                        <p className="text-sm font-mono">{error}</p>
                    </div>
                 </div>
              )}
              {response && (
                 <div>
                    <div className="flex items-center space-x-6 text-sm mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Status:</span>
                            <span className={`font-semibold ${getStatusColor(response.status)}`}>{response.status} {response.statusText}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Time:</span>
                            <span className="font-semibold text-slate-200">{response.time} ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Size:</span>
                            <span className="font-semibold text-slate-200">{ (response.size / 1024).toFixed(2) } KB</span>
                        </div>
                    </div>
                    <div className="border border-slate-700 rounded-md bg-slate-800/50">
                        <div className="border-b border-slate-700">
                           <nav className="flex space-x-2 px-2" aria-label="Tabs">
                             <button onClick={() => setActiveResponseTab('body')} className={tabClass(activeResponseTab === 'body')}>Body</button>
                             <button onClick={() => setActiveResponseTab('headers')} className={tabClass(activeResponseTab === 'headers')}>Headers</button>
                           </nav>
                        </div>
                        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                           {activeResponseTab === 'body' && <JsonViewer data={response.data} />}
                           {activeResponseTab === 'headers' && (
                                <div className="p-4 font-mono text-sm text-slate-300">
                                {Object.entries(response.headers).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-2 py-1">
                                    <span className="text-sky-400 truncate">{key}:</span>
                                    <span className="text-amber-400 col-span-2 break-all">{value}</span>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;