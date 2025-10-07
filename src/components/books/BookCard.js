import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { withBase, handleImageError } from '../../utils/imageUtils';

const BookCard = ({ book }) => {
  const { user } = useAuth();

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'bg-success';
      case 'good':
        return 'bg-primary';
      case 'fair':
        return 'bg-warning';
      case 'poor':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="card book-card h-100 border-0 shadow-sm">
      <div className="position-relative">
        {book.imagePath ? (
          <img
            src={withBase(book.imagePath)}
            alt={book.title}
            className="card-img-top"
            style={{height: '250px', objectFit: 'cover'}}
            onError={(e) => handleImageError(e, book.title)}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center bg-light" style={{height: '250px'}}>
            <BookOpen size={48} className="text-muted" />
          </div>
        )}
        <div className="position-absolute top-0 end-0 m-2">
          <span className={`badge ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-dark mb-2" style={{fontSize: '1.1rem'}}>
          {book.title}
        </h5>
        
        <p className="card-text text-muted mb-3">
          by <span className="fw-semibold">{book.author}</span>
        </p>
        
        {book.description && (
          <p className="card-text text-muted small mb-3 line-clamp-2">
            {book.description}
          </p>
        )}
        
        <div className="d-flex align-items-center text-muted small mb-3">
          <User size={16} className="me-2" />
          <span>{book.owner?.name || 'Unknown'}</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className={`badge ${book.status === 'available' ? 'bg-success' : 'bg-danger'}`}>
            {book.status === 'available' ? 'Available' : 'Unavailable'}
          </span>
          
          <Link
            to={`/books/${book._id}`}
            className="btn btn-primary btn-sm"
          >
            {user && book.owner._id === user.id ? 'Manage' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
