import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { booksAPI, requestsAPI } from '../services/api';
import { 
  BookOpen, 
  Inbox, 
  Send, 
  TrendingUp,
  User,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myBooks: 0,
    receivedRequests: 0,
    sentRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [books, received, sent] = await Promise.all([
        booksAPI.getUserBooks(),
        requestsAPI.getReceivedRequests(),
        requestsAPI.getSentRequests()
      ]);

      setStats({
        myBooks: books.data.length,
        receivedRequests: received.data.length,
        sentRequests: sent.data.length
      });

      const createActivity = (item, type, extra = {}) => ({
        id: item._id,
        type,
        title: item.book?.title || item.title,
        date: item.createdAt,
        ...extra
      });

      const activities = [
        ...books.data.slice(0, 3).map(book => createActivity(book, 'book_added', { 
          author: book.author, 
          icon: BookOpen, 
          color: 'text-primary' 
        })),
        ...received.data.slice(0, 3).map(req => createActivity(req, 'request_received', { 
          requester: req.requester.name, 
          status: req.status,
          icon: Inbox, 
          color: req.status === 'pending' ? 'text-warning' : req.status === 'accepted' ? 'text-success' : 'text-danger' 
        })),
        ...sent.data.slice(0, 3).map(req => createActivity(req, 'request_sent', { 
          owner: req.book.owner.name, 
          status: req.status,
          icon: Send, 
          color: req.status === 'pending' ? 'text-warning' : req.status === 'accepted' ? 'text-success' : 'text-danger' 
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityMessage = (activity) => {
    const messages = {
      book_added: `Added "${activity.title}" by ${activity.author}`,
      request_received: `${activity.requester} requested "${activity.title}"`,
      request_sent: `Requested "${activity.title}" from ${activity.owner}`
    };
    return messages[activity.type] || 'Unknown activity';
  };

  const getActivityStatus = (activity) => {
    if (!activity.status) return null;
    return activity.status === 'pending' ? 'Pending' : 
           activity.status === 'accepted' ? 'Accepted' : 'Declined';
  };

  const statsData = [
    {
      name: 'My Books',
      value: stats.myBooks,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10',
      href: '/my-books'
    },
    {
      name: 'Received Requests',
      value: stats.receivedRequests,
      icon: Inbox,
      color: 'text-success',
      bgColor: 'bg-success bg-opacity-10',
      href: '/requests'
    },
    {
      name: 'Sent Requests',
      value: stats.sentRequests,
      icon: Send,
      color: 'text-info',
      bgColor: 'bg-info bg-opacity-10',
      href: '/requests'
    }
  ];

  const quickActions = [
    {
      name: 'Add New Book',
      description: 'Share a book with the community',
      icon: Plus,
      href: '/add-book',
      color: 'btn-primary'
    },
    {
      name: 'Browse Books',
      description: 'Discover books from other users',
      icon: BookOpen,
      href: '/',
      color: 'btn-success'
    },
    {
      name: 'Manage Requests',
      description: 'Review and respond to book requests',
      icon: Inbox,
      href: '/requests',
      color: 'btn-secondary'
    }
  ];

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

  return (
    <div className="container py-5">
      {/* Welcome Section */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold text-dark">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted">
          Here's what's happening with your BookSwap account.
        </p>
      </div>

       {/* Stats Grid */}
       <div className="row g-4 mb-5">
         {statsData.map((stat) => (
          <div key={stat.name} className="col-md-4">
            <Link
              to={stat.href}
              className="card border-0 shadow-sm h-100 text-decoration-none"
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className={`p-3 rounded-circle me-3 ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="small text-muted mb-1">{stat.name}</p>
                    <p className="h4 fw-bold text-dark mb-0">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <h2 className="h3 fw-bold text-dark mb-4">Quick Actions</h2>
        <div className="row g-4">
          {quickActions.map((action) => (
            <div key={action.name} className="col-md-4">
              <Link
                to={action.href}
                className={`btn ${action.color} w-100 h-100 d-flex flex-column align-items-start p-4 text-decoration-none`}
                style={{minHeight: '120px'}}
              >
                <div className="d-flex align-items-center mb-3">
                  <action.icon size={20} className="me-2" />
                  <h5 className="fw-bold mb-0">{action.name}</h5>
                </div>
                <p className="text-white-50 small mb-0">{action.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

       {/* Recent Activity */}
       <div className="card border-0 shadow-sm">
         <div className="card-header bg-transparent border-0">
           <h2 className="h3 fw-bold text-dark mb-0">Recent Activity</h2>
         </div>
         <div className="card-body">
           {recentActivity.length === 0 ? (
             <div className="text-center py-5">
               <TrendingUp size={48} className="text-muted mb-3" />
               <h3 className="h5 fw-semibold text-dark">No recent activity</h3>
               <p className="text-muted">
                 Start by adding a book or browsing the community.
               </p>
               <div className="mt-4">
                 <Link
                   to="/add-book"
                   className="btn btn-primary"
                 >
                   <Plus size={16} className="me-2" />
                   Add Your First Book
                 </Link>
               </div>
             </div>
           ) : (
             <div className="list-group list-group-flush">
               {recentActivity.map((activity, index) => (
                 <div key={`${activity.type}-${activity.id}`} className="list-group-item border-0 px-0">
                   <div className="d-flex align-items-start">
                     <div className={`p-2 rounded-circle me-3 ${activity.color.replace('text-', 'bg-').replace('text-', 'bg-') + ' bg-opacity-10'}`}>
                       <activity.icon size={20} className={activity.color} />
                     </div>
                     <div className="flex-grow-1">
                       <p className="mb-1 fw-semibold text-dark">
                         {getActivityMessage(activity)}
                       </p>
                       <div className="d-flex justify-content-between align-items-center">
                         <small className="text-muted">
                           {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </small>
                         {activity.status && (
                           <span className={`badge ${
                             activity.status === 'pending' ? 'bg-warning' : 
                             activity.status === 'accepted' ? 'bg-success' : 'bg-danger'
                           }`}>
                             {getActivityStatus(activity)}
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default Dashboard;
