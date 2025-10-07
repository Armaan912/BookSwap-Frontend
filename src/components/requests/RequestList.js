import React, { useState, useEffect } from 'react';
import { requestsAPI } from '../../services/api';
import { 
  Inbox, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  User,
  Calendar,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { withBase, handleImageError } from '../../utils/imageUtils';

const RequestList = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [receivedResponse, sentResponse] = await Promise.all([
        requestsAPI.getReceivedRequests(),
        requestsAPI.getSentRequests()
      ]);
      setReceivedRequests(receivedResponse.data);
      setSentRequests(sentResponse.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await requestsAPI.updateRequestStatus(requestId, status);
      toast.success(`Request ${status} successfully`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await requestsAPI.deleteRequest(requestId);
      toast.success('Request cancelled successfully');
      setSentRequests(sentRequests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="display-5 fw-bold text-dark mb-4">Book Requests</h1>
        
        {/* Tabs */}
        <ul className="nav nav-tabs border-0" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              onClick={() => setActiveTab('received')}
              className={`nav-link ${activeTab === 'received' ? 'active' : ''} border-0 rounded-3 me-2`}
              style={{fontWeight: '600'}}
            >
              <Inbox size={20} className="me-2" />
              Received ({receivedRequests.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              onClick={() => setActiveTab('sent')}
              className={`nav-link ${activeTab === 'sent' ? 'active' : ''} border-0 rounded-3`}
              style={{fontWeight: '600'}}
            >
              <Send size={20} className="me-2" />
              Sent ({sentRequests.length})
            </button>
          </li>
        </ul>
      </div>

      {/* Request List */}
      {currentRequests.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            {activeTab === 'received' ? (
              <Inbox size={48} />
            ) : (
              <Send size={48} />
            )}
          </div>
          <h3 className="text-muted mb-2">
            No {activeTab} requests
          </h3>
          <p className="text-muted">
            {activeTab === 'received' 
              ? 'You haven\'t received any book requests yet.'
              : 'You haven\'t sent any book requests yet.'
            }
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {currentRequests.map((request) => (
            <div key={request._id} className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-3">
                        {getStatusIcon(request.status)}
                        <span className={`badge ms-2 ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="d-flex">
                        {/* Book Info */}
                        <div className="flex-shrink-0 me-3">
                          {request.book.imagePath ? (
                            <img
                              src={withBase(request.book.imagePath)}
                              alt={request.book.title}
                              className="rounded"
                              style={{width: '80px', height: '100px', objectFit: 'cover'}}
                              onError={(e) => handleImageError(e, request.book.title)}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: '80px', height: '100px'}}>
                              <BookOpen size={32} className="text-muted" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow-1">
                          <h5 className="fw-bold text-dark mb-1">
                            {request.book.title}
                          </h5>
                          <p className="text-muted mb-2">by {request.book.author}</p>
                          
                          <div className="d-flex align-items-center text-muted small mb-3">
                            {activeTab === 'received' ? (
                              <>
                                <User size={16} className="me-1" />
                                <span>Requested by: <strong className="text-dark">{request.requester.name}</strong></span>
                              </>
                            ) : (
                              <>
                                <User size={16} className="me-1" />
                                <span>Owner: <strong className="text-dark">{request.book.owner.name}</strong></span>
                              </>
                            )}
                            <Calendar size={16} className="ms-3 me-1" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="bg-light rounded p-3">
                            <div className="d-flex">
                              <MessageSquare size={16} className="text-muted me-2 mt-1" />
                              <p className="text-dark small mb-0">{request.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="ms-3">
                      {activeTab === 'received' && request.status === 'pending' && (
                        <div className="d-flex flex-column gap-2">
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'accepted')}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle size={16} className="me-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'declined')}
                            className="btn btn-danger btn-sm"
                          >
                            <XCircle size={16} className="me-1" />
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {activeTab === 'sent' && request.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(request._id)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;
