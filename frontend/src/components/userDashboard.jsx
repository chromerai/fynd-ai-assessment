import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, XCircle, Loader } from 'lucide-react';
import { api } from '../services/api';

const UserDashboard = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal && submissionState?.type === 'success') {
      const timer = setTimeout(() => {
        setShowModal(false);
        setSubmissionState(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal, submissionState]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setSubmissionState({ type: 'error', message: 'Please select a rating' });
      return;
    }
    
    if (!reviewText.trim()) {
      setSubmissionState({ type: 'error', message: 'Please write a review' });
      return;
    }

    if (!name.trim()) {
    setSubmissionState({ type: 'error', message: 'Please enter your name' });
    return;
    }

    if (!email.trim()) {
      setSubmissionState({ type: 'error', message: 'Please enter your email' });
      return;
    }

  // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmissionState({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setSubmissionState(null);

    try {
      const result = await api.submitReview(rating, reviewText, name, email);
      setSubmissionState({
        type: 'success',
        message: result.message,
        aiResponse: result.data.aiResponse
      });
      setShowModal(true);
      setRating(0);
      setReviewText('');
      setName("");
      setEmail("");
    } catch (error) {
      setSubmissionState({
        type: 'error',
        message: 'Failed to submit review. Please try again.'
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Share Your Feedback</h1>
          <p className="text-gray-600 mb-8">We'd love to hear about your experience</p>
          {/* Name and Email Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="space-y-6">
            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rate Your Experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You selected: {rating} star{rating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Write Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {reviewText.length}/2000 characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !reviewText.trim() || !name.trim() || !email.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
          {/* Submission Result */}
          {showModal && submissionState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop with blur */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => {
                setShowModal(false);
                setSubmissionState(null);
              }}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center">
                {submissionState.type === 'success' ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-4">{submissionState.message}</p>
                    {submissionState.aiResponse && (
                      <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">{submissionState.aiResponse}</p>
                      </div>
                    )}
                    <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-green-600 h-full animate-shrink" style={{
                        animation: 'shrink 5s linear forwards'
                      }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Closing automatically...</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <XCircle className="text-red-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{submissionState.message}</p>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSubmissionState(null);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          )}

          <style>{`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
    </div>
  );
};

export default UserDashboard;