'use client';

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';

interface FormData {
  name: string;
  number: number;
  email: string;
}

interface LeadData {
  name: string;
  place_id: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  rating?: number;
  reviews_count?: number;
  categories?: string[];
  website?: string;
  phone?: string;
  link: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    number: 20,
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LeadData[] | null>(null);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    setSuccessMessage('');

    // Client-side validation
    if (formData.number > 100) {
      setError('Limit reached! Please request below 100 leads.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ai.shivamkaushal.site/webhook/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          number: formData.number,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.success && data.data) {
        setSuccessMessage(data.success);
        // Extract leads from the data array
        const leadsData = data.data?.map((item: any) => item.json) || [];
        setResults(leadsData);
      }
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border-2 border-blue-200">
              ✨ AI-Powered Lead Generation
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            ShIvAmKaUsHaL Leads Scraper
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get high-quality business leads instantly. Simply enter what you're looking for 
            and we'll deliver verified leads to your inbox.
          </p>
        </div>

        {/* Loading State with Snake Game */}
        {loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
              <SnakeGame />
            </div>
          </div>
        )}

        {/* Form Section */}
        {!loading && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">🎯</span>
                Get Your Leads
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    What are you looking for?
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800"
                    placeholder="e.g., Restaurants in Singapore"
                  />
                </div>

                <div>
                  <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Leads (Max 100)
                  </label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    required
                    min="1"
                    max="100"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Get Leads Now
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message & Results */}
        {successMessage && results && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md mb-8">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <p className="font-bold">{successMessage}</p>
                  <p className="text-sm">These leads have been sent to: <span className="font-semibold">{formData.email}</span></p>
                </div>
              </div>
            </div>

            {/* Results Grid - Mobile Friendly Cards */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-sky-600">
                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                  <span className="mr-3">📊</span>
                  Your Leads ({results.length} found)
                </h3>
              </div>

              {/* Mobile: Cards, Desktop: Table */}
              <div className="p-4 md:p-6">
                {/* Mobile Cards View */}
                <div className="block md:hidden space-y-4">
                  {results.map((lead) => (
                    <div key={lead.place_id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{lead.name}</h4>
                      
                      {lead.rating && (
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-semibold text-gray-700">{lead.rating}</span>
                          {lead.reviews_count && (
                            <span className="text-sm text-gray-500 ml-1">({lead.reviews_count} reviews)</span>
                          )}
                        </div>
                      )}

                      {lead.address && (
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-600">Address:</span>
                          <p className="text-sm text-gray-700">{lead.address}</p>
                        </div>
                      )}

                      {lead.phone && (
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-600">Phone:</span>
                          <p className="text-sm text-gray-700 font-mono">{lead.phone}</p>
                        </div>
                      )}

                      {lead.categories && lead.categories.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2">
                            {lead.categories.map((cat, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        {lead.website && (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all text-center"
                          >
                            🔗 Website
                          </a>
                        )}
                        <a
                          href={lead.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-all text-center"
                        >
                          📍 Map
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-blue-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Categories</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((lead) => (
                        <tr key={lead.place_id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-800">{lead.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600 max-w-xs">{lead.address || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600 font-mono">{lead.phone || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {lead.categories ? (
                                lead.categories.map((cat, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {lead.rating ? (
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-1">★</span>
                                <span className="font-semibold text-gray-700">{lead.rating}</span>
                                {lead.reviews_count && (
                                  <span className="text-xs text-gray-500 ml-1">({lead.reviews_count})</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              {lead.website && (
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all"
                                >
                                  🔗 Visit
                                </a>
                              )}
                              <a
                                href={lead.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-all"
                              >
                                📍 Map
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-200">
        <p className="text-sm">
          ⚡ Powered by <span className="font-bold text-blue-600">ShIvAmKaUsHaL Leads Scraper</span> • Get quality leads delivered instantly
        </p>
      </footer>
    </div>
  );
}
