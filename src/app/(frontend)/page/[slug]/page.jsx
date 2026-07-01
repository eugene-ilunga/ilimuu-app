'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

const CustomPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/custom-pages/details?slug=${slug}`, {
        method: "GET",
      });
      const data = await res.json();

      if (data.status === 200) {
        setPageData(data.data);
        
        // Update page title and meta tags
        if (typeof document !== 'undefined') {
          document.title = data.data.title + ' - ELIMUU';
          
          // Update meta description if exists
          if (data.data.metaDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.data.metaDescription;
          }
          
          // Update meta keywords if exists
          if (data.data.metaKeywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.name = 'keywords';
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = data.data.metaKeywords;
          }
        }
      } else if (data.status === 404) {
        setError("Page not found");
      } else {
        setError(data.message || "Failed to load page");
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      setError("Failed to load page. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pageData?.title}
            </h1>
            <p className="text-lg text-indigo-100">
              {pageData?.metaDescription || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none custom-page-content"
              dangerouslySetInnerHTML={{ __html: pageData?.content }}
            />
          </div>

          {/* Last Updated Info */}
          {pageData?.updatedAt && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Last updated: {new Date(pageData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-page-content {
          line-height: 1.8;
          color: #333;
        }
        
        .custom-page-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        
        .custom-page-content h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #2d3748;
        }
        
        .custom-page-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #2d3748;
        }
        
        .custom-page-content p {
          margin-bottom: 1rem;
          color: #4a5568;
        }
        
        .custom-page-content ul,
        .custom-page-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .custom-page-content li {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        
        .custom-page-content a {
          color: #5a67d8;
          text-decoration: underline;
        }
        
        .custom-page-content a:hover {
          color: #4c51bf;
        }
        
        .custom-page-content strong {
          font-weight: 600;
          color: #2d3748;
        }
        
        .custom-page-content em {
          font-style: italic;
        }
        
        .custom-page-content blockquote {
          border-left: 4px solid #5a67d8;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #4a5568;
          font-style: italic;
        }
        
        .custom-page-content code {
          background-color: #f7fafc;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #e53e3e;
        }
        
        .custom-page-content pre {
          background-color: #2d3748;
          color: #fff;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .custom-page-content pre code {
          background-color: transparent;
          color: #fff;
          padding: 0;
        }
        
        .custom-page-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .custom-page-content table th,
        .custom-page-content table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }
        
        .custom-page-content table th {
          background-color: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }
        
        .custom-page-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .custom-page-content hr {
          border: 0;
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default CustomPage;

