import React, { useState, useEffect } from 'react';
import { Star, RefreshCw, TrendingUp, Filter, Loader } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchReviews = async () => {
    try {
      const result = await api.getReviews();
      setReviews(result.data);
      setStats(result.stats);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchReviews, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and analyze customer feedback</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                </div>
                <TrendingUp className="text-blue-600" size={32} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.averageRating}</p>
                </div>
                <Star className="text-yellow-500 fill-yellow-500" size={32} />
              </div>
            </div>

            {[5, 4, 3, 2, 1].slice(0, 2).map((rating) => (
              <div key={rating} className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">{rating} Star Reviews</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.ratingDistribution[rating]}
                </p>
                <div className="flex gap-1 mt-2">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterRating === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRating === r.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {r} ⭐
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-600">
            Showing {filteredReviews.length} reviews
          </span>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Customer Review</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">AI Summary</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.aiSummary}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Recommended Actions</h3>
                      <ul className="space-y-1">
                        {review.aiRecommendedActions.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;