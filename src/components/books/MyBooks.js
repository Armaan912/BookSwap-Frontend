import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { withBase, handleImageError } from '../../utils/imageUtils';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getUserBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching my books:', error);
      toast.error('Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksAPI.deleteBook(bookId);
      toast.success('Book deleted successfully');
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-5 fw-bold text-dark mb-2">My Books</h1>
          <p className="text-muted mb-0">
            Manage your book collection and track requests
          </p>
        </div>
        <Link
          to="/add-book"
          className="btn btn-primary btn-lg"
        >
          <Plus size={20} className="me-2" />
          Add New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-5">
          <div className="text-muted mb-4">
            <BookOpen size={64} />
          </div>
          <h3 className="text-muted mb-3">No books yet</h3>
          <p className="text-muted mb-4">
            Get started by adding your first book to share with the community.
          </p>
          <Link
            to="/add-book"
            className="btn btn-primary btn-lg"
          >
            <Plus size={20} className="me-2" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
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
                  
                  <div className="d-flex align-items-center text-muted small mb-3">
                    <Calendar size={16} className="me-2" />
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    {book.status === 'available' ? (
                      <CheckCircle size={20} className="text-success me-2" />
                    ) : (
                      <XCircle size={20} className="text-danger me-2" />
                    )}
                    <span className={`badge ${book.status === 'available' ? 'bg-success' : 'bg-danger'}`}>
                      {book.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <Link
                      to={`/books/${book._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <Eye size={16} className="me-1" />
                      View
                    </Link>
                    
                    <div className="btn-group" role="group">
                      <Link
                        to={`/edit-book/${book._id}`}
                        className="btn btn-outline-secondary btn-sm"
                        title="Edit Book"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Book"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default MyBooks;
