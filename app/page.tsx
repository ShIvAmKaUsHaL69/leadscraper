'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  number: number;
  email: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    number: 20,
    email: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Client-side validation
    if (formData.number > 100) {
      setError('Limit reached! Please request below 100 leads.');
      return;
    }

    // Fire off the request in the background (don't wait for response)
    fetch('https://ai.shivamkaushal.site/webhook/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        number: formData.number,
        email: formData.email,
      }),
    }).catch(() => {
      // Silently catch errors since we're not waiting
    });

    // Immediately show success message
    setSuccessMessage('Success! Your leads are being processed and will be sent to your email shortly.');
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

        {/* Form Section */}
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
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">⚡</span>
                  Get Leads Now
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="text-3xl mr-4">✅</span>
                <div>
                  <p className="font-bold text-lg mb-1">Success!</p>
                  <p className="text-sm">Your leads are being processed and will be sent to <span className="font-semibold">{formData.email}</span> shortly.</p>
                  <p className="text-xs mt-2 text-green-600">Please check your inbox in a few moments.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="text-3xl mr-4">⚠️</span>
                <div>
                  <p className="font-bold text-lg mb-1">Error</p>
                  <p className="text-sm">{error}</p>
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
