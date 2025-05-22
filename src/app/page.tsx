'use client';

import { useState } from 'react';
import Lottie from "lottie-react";
import loadingAnim from "./loading.json"; 

type Solution = {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  pricing: string;
  link: string;
};

export default function Home() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<Solution[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('https://comapre-tools-backend-production.up.railway.app/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error('Failed to fetch solutions.');
      const data = await res.json();
      setResults(data.solutions);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-900">
          AI Solution Comparison
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm"
            type="text"
            placeholder="Ask something like: Best tools to build an AI chatbot"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={askQuestion}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Ask
          </button>
        </div>

        {loading && (
          <div className="w-60 mx-auto">
            <Lottie animationData={loadingAnim} loop />
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {results && (
          <div className="overflow-x-auto relative rounded-xl border border-indigo-200">
            <table className="min-w-full text-sm border-collapse border border-indigo-200">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 bg-white p-3 font-bold text-left border border-indigo-200 z-20">
                    Feature
                  </th>
                  {results.map((sol, i) => (
                    <th
                      key={i}
                      className="top-0 bg-white text-center font-bold text-indigo-900 z-10 p-3 border border-indigo-200 group relative"
                    >
                      <div className="relative inline-block cursor-pointer">
                        {sol.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs text-left z-20 pointer-events-none">
                          <p className="font-bold text-indigo-700 mb-1">Description</p>
                          <p className="text-gray-700">{sol.description}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-indigo-50 border-t">
                  <td className="sticky left-0 bg-indigo-50 p-3 font-bold text-gray-800 border border-indigo-200">
                    💰 Pricing
                  </td>
                  {results.map((sol, i) => (
                    <td key={i} className="text-center p-3 border border-indigo-200">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {sol.pricing}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-t">
                  <td className="sticky left-0 bg-green-50 p-3 font-bold text-green-800 border border-green-200">
                    ✅ Pros
                  </td>
                  {results.map((sol, i) => (
                    <td key={i} className="p-3 text-left border border-indigo-200">
                      <ul className="space-y-1">
                        {sol.pros.map((p, idx) => (
                          <li
                            key={idx}
                            className="bg-green-100 text-green-900 px-2 py-1 rounded text-xs flex items-center gap-2"
                          >
                            <span>✔</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="bg-red-50 border-t">
                  <td className="sticky left-0 p-3 font-bold text-red-800 border border-red-200 bg-red-50">
                    ❌ Cons
                  </td>
                  {results.map((sol, i) => (
                    <td key={i} className="p-3 text-left border border-indigo-200">
                      <ul className="space-y-1">
                        {sol.cons.map((c, idx) => (
                          <li
                            key={idx}
                            className="bg-red-100 text-red-900 px-2 py-1 rounded text-xs flex items-center gap-2"
                          >
                            <span>⚠</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="border-t">
                  <td className="sticky left-0 p-3 font-bold text-gray-700 border border-indigo-200 bg-indigo-50">
                    🔗 Link
                  </td>
                  {results.map((sol, i) => (
                    <td key={i} className="text-center p-3 border border-indigo-200">
                      <a
                        href={sol.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-full shadow hover:bg-indigo-700 hover:scale-105 transition transform"
                      >
                        Visit Site
                        <span className="text-sm">↗</span>
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
