import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { booksAPI } from '../../services/api';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddBook = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const selectedFile = watch('image');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue('image', null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('condition', data.condition);
      formData.append('description', data.description || '');
      
      if (data.image) {
        formData.append('image', data.image);
      }

      await booksAPI.createBook(formData);
      toast.success('Book added successfully!');
      navigate('/my-books');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-header bg-transparent border-0 py-4">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <Upload size={32} className="text-primary" />
                </div>
                <h1 className="display-6 fw-bold text-dark mb-2">Add New Book</h1>
                <p className="text-muted mb-0">
                  Share your book with the BookSwap community
                </p>
              </div>
            </div>
            
            <div className="card-body p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-3">
                    Book Cover Image (Optional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="position-relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{width: '100%', height: '250px', objectFit: 'cover'}}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                        style={{width: '35px', height: '35px'}}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="image" className="d-block cursor-pointer">
                      <div className="border-2 border-dashed border-secondary rounded p-4 text-center bg-light upload-area" 
                           style={{minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Upload size={48} className="text-muted mb-3" />
                        <h5 className="fw-semibold text-dark mb-2">Click to upload image</h5>
                        <p className="text-muted mb-0">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                    </label>
                  )}
                </div>

                <div className="row g-4">
                  {/* Title */}
                  <div className="col-12">
                    <label htmlFor="title" className="form-label fw-semibold text-dark">
                      Book Title *
                    </label>
                    <input
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 1,
                          message: 'Title must not be empty'
                        }
                      })}
                      type="text"
                      id="title"
                      className="form-control form-control-lg"
                      placeholder="Enter book title"
                    />
                    {errors.title && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.title.message}
                      </div>
                    )}
                  </div>

                  {/* Author */}
                  <div className="col-12">
                    <label htmlFor="author" className="form-label fw-semibold text-dark">
                      Author *
                    </label>
                    <input
                      {...register('author', {
                        required: 'Author is required',
                        minLength: {
                          value: 1,
                          message: 'Author must not be empty'
                        }
                      })}
                      type="text"
                      id="author"
                      className="form-control form-control-lg"
                      placeholder="Enter author name"
                    />
                    {errors.author && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.author.message}
                      </div>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="col-12">
                    <label htmlFor="condition" className="form-label fw-semibold text-dark">
                      Book Condition *
                    </label>
                    <select
                      {...register('condition', {
                        required: 'Condition is required'
                      })}
                      id="condition"
                      className="form-select form-select-lg"
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent - Like new</option>
                      <option value="good">Good - Minor wear</option>
                      <option value="fair">Fair - Noticeable wear</option>
                      <option value="poor">Poor - Significant wear</option>
                    </select>
                    {errors.condition && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.condition.message}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label htmlFor="description" className="form-label fw-semibold text-dark">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={4}
                      className="form-control"
                      placeholder="Describe the book, its condition, or any additional details..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-3 pt-4 mt-4 border-top">
                  <button
                    type="button"
                    onClick={() => navigate('/my-books')}
                    className="btn btn-outline-secondary btn-lg px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg px-5"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Book...
                      </>
                    ) : (
                      'Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
