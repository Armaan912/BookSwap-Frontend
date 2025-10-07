import React, { useState, useEffect } from 'react';
import { booksAPI } from '../../services/api';
import BookCard from './BookCard';
import { Search, Filter, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchBooks();
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []); // Only fetch on component mount

  const fetchBooks = async (searchParams = {}) => {
    try {
      setLoading(true);
      
      // If no search parameters, get all books
      if (!searchParams.title && !searchParams.condition) {
        const response = await booksAPI.getAllBooks();
        setBooks(response.data);
      } else {
        // Otherwise, use search API
        const response = await booksAPI.searchBooks(searchParams);
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
      setBooks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    
    if (searchTerm.trim()) {
      params.title = searchTerm.trim();
    }
    
    if (filterCondition) {
      params.condition = filterCondition;
    }
    
    fetchBooks(params);
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const newTimeout = setTimeout(() => {
      const params = {};
      if (value.trim()) params.title = value.trim();
      if (filterCondition) params.condition = filterCondition;
      fetchBooks(params);
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterCondition(value);
    
    const params = {};
    if (searchTerm.trim()) params.title = searchTerm.trim();
    if (value) params.condition = value;
    fetchBooks(params);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilterCondition('');
    setSearchTimeout(null);
    fetchBooks(); // Fetch all books
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
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="display-6 fw-bold mb-4">Browse Books</h1>
        
        {/* Search and Filter */}
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch} className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <Filter size={20} />
                  </span>
                  <select
                    className="form-select"
                    value={filterCondition}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Conditions</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-2">
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    Search
                  </button>
                  {(searchTerm || filterCondition) && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={clearSearch}
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted mb-0">
            Found {books.length} book{books.length !== 1 ? 's' : ''}
          </p>
          
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      {books.length === 0 ? (
        <div className="text-center py-5">
          <Search size={48} className="text-muted mb-3" />
          <h3 className="text-muted">No books found</h3>
          <p className="text-muted">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'row g-4' : 'row g-3'}>
          {books.map((book) => (
            <div key={book._id} className={viewMode === 'grid' ? 'col-md-6 col-lg-4 col-xl-3' : 'col-12'}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
