import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI, requestsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MessageSquare, 
  Send,
  CheckCircle,
  XCircle,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';
import { withBase, handleImageError } from '../../utils/imageUtils';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [bookRequests, setBookRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (book && isOwnBook()) {
      fetchBookRequests();
    }
  }, [book]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBookById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to fetch book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await requestsAPI.getReceivedRequests();
      // Filter requests for this specific book
      const requestsForThisBook = response.data.filter(request => request.book._id === id);
      setBookRequests(requestsForThisBook);
    } catch (error) {
      console.error('Error fetching book requests:', error);
      toast.error('Failed to fetch book requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await requestsAPI.updateRequestStatus(requestId, status);
      toast.success(`Request ${status} successfully`);
      fetchBookRequests(); // Refresh the requests list
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const getConditionColor = (condition) => {
    const colors = { excellent: 'bg-success', good: 'bg-primary', fair: 'bg-warning', poor: 'bg-danger' };
    return colors[condition] || 'bg-secondary';
  };

  const getRequestStatusColor = (status) => {
    const colors = { pending: 'bg-warning', accepted: 'bg-success', declined: 'bg-danger' };
    return colors[status] || 'bg-secondary';
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const response = await requestsAPI.createRequest(id, requestMessage);
      toast.success('Request sent successfully!');
      setShowRequestForm(false);
      setRequestMessage('');
      console.log('Request created:', response.data);
    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send request';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const canRequestBook = () => {
    return user && 
           book && 
           book.status === 'available' && 
           book.owner._id !== user.id;
  };

  const isOwnBook = () => {
    return user && book && book.owner._id === user.id;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="h2 fw-bold text-dark">Book not found</h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-link text-primary mt-3"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="btn btn-outline-primary mb-4"
      >
        <ArrowLeft size={20} className="me-2" />
        Back to Browse
      </button>

      <div className="card border-0 shadow-lg rounded-4">
        <div className="row g-0">
          {/* Book Image */}
          <div className="col-md-4">
            {book.imagePath ? (
              <img
                src={withBase(book.imagePath)}
                alt={book.title}
                className="img-fluid rounded-start h-100"
                style={{objectFit: 'cover', minHeight: '400px'}}
                onError={(e) => handleImageError(e, book.title)}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light rounded-start" style={{minHeight: '400px'}}>
                <div className="text-center text-muted">
                  <div style={{fontSize: '4rem'}}>📚</div>
                  <p className="mt-2">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="col-md-8">
            <div className="card-body p-5 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                  <h1 className="display-6 fw-bold text-dark mb-2">{book.title}</h1>
                  <p className="text-muted fs-5 mb-0">by {book.author}</p>
                </div>
                <span className={`badge fs-6 px-3 py-2 ${getConditionColor(book.condition)}`}>
                  {book.condition}
                </span>
              </div>

              {book.description && (
                <div className="mb-4">
                  <h5 className="fw-semibold text-dark mb-3">Description</h5>
                  <p className="text-muted lh-base">{book.description}</p>
                </div>
              )}

              {/* Book Info */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-muted">
                    <User size={20} className="me-2" />
                    <span>Owner: <strong className="text-dark">{book.owner.name}</strong></span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center text-muted">
                    <Calendar size={20} className="me-2" />
                    <span>Posted: {new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                {book.status === 'available' ? (
                  <CheckCircle size={24} className="text-success me-2" />
                ) : (
                  <XCircle size={24} className="text-danger me-2" />
                )}
                <span className={`badge fs-6 ${book.status === 'available' ? 'bg-success' : 'bg-danger'}`}>
                  {book.status === 'available' ? 'Available for Trade' : 'Not Available'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                {isOwnBook() && (
                  <div className="border-top pt-4">
                    <div className="text-center">
                      <p className="text-muted mb-3">
                        This is your book. You can manage it from your dashboard.
                      </p>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          onClick={() => navigate('/my-books')}
                          className="btn btn-outline-primary"
                        >
                          Manage My Books
                        </button>
                        <button
                          onClick={() => navigate('/requests')}
                          className="btn btn-primary"
                        >
                          View Requests
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {canRequestBook() && (
                  <div className="border-top pt-4">
                    {!showRequestForm ? (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="btn btn-primary btn-lg w-100"
                      >
                        <MessageSquare size={20} className="me-2" />
                        Request This Book
                      </button>
                    ) : (
                      <form onSubmit={handleRequestSubmit}>
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label fw-semibold">
                            Message to Owner
                          </label>
                          <textarea
                            id="message"
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            rows={4}
                            className="form-control"
                            placeholder="Tell the owner why you'd like this book..."
                            required
                          />
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="submit"
                            disabled={isSubmittingRequest}
                            className="btn btn-primary flex-grow-1"
                          >
                            {isSubmittingRequest ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send size={16} className="me-2" />
                                Send Request
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowRequestForm(false);
                              setRequestMessage('');
                            }}
                            className="btn btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {!user && (
                  <div className="border-top pt-4">
                    <div className="text-center">
                      <p className="text-muted mb-3">
                        Sign in to request this book
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary btn-lg"
                      >
                        Sign In to Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Book Requests Section for Owner */}
                {isOwnBook() && (
                  <div className="border-top pt-4 mt-4">
                    <div className="d-flex align-items-center mb-3">
                      <Inbox size={20} className="me-2" />
                      <h5 className="fw-bold text-dark mb-0">Requests for this Book</h5>
                    </div>
                    
                    {loadingRequests ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : bookRequests.length === 0 ? (
                      <div className="text-center py-4">
                        <MessageSquare size={32} className="text-muted mb-2" />
                        <p className="text-muted mb-0">No requests yet for this book</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {bookRequests.map((request) => (
                          <div key={request._id} className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                      <User size={16} className="me-2" />
                                      <strong className="text-dark">{request.requester.name}</strong>
                                      <span className={`badge ms-2 ${getRequestStatusColor(request.status)}`}>
                                        {request.status}
                                      </span>
                                    </div>
                                    <p className="text-muted small mb-2">{request.message}</p>
                                    <small className="text-muted">
                                      {new Date(request.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                  
                                  {request.status === 'pending' && (
                                    <div className="ms-3">
                                      <div className="btn-group" role="group">
                                        <button
                                          onClick={() => handleStatusUpdate(request._id, 'accepted')}
                                          className="btn btn-success btn-sm"
                                          title="Accept Request"
                                        >
                                          <CheckCircle size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleStatusUpdate(request._id, 'declined')}
                                          className="btn btn-danger btn-sm"
                                          title="Decline Request"
                                        >
                                          <XCircle size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
