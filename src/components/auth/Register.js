import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <User size={32} className="text-primary" />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">
                    Join BookSwap
                  </h2>
                  <p className="text-muted mb-0">
                    Create your account and start trading books
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold text-dark">Full Name</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={20} className="text-muted" />
                      </span>
                      <input
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        id="name"
                        className="form-control border-start-0"
                        placeholder="Enter your full name"
                        style={{borderColor: '#e9ecef'}}
                      />
                    </div>
                    {errors.name && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">Email Address</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={20} className="text-muted" />
                      </span>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        id="email"
                        className="form-control border-start-0"
                        placeholder="Enter your email"
                        style={{borderColor: '#e9ecef'}}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={20} className="text-muted" />
                      </span>
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="form-control border-start-0"
                        placeholder="Create a password"
                        style={{borderColor: '#e9ecef'}}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark">Confirm Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={20} className="text-muted" />
                      </span>
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type="password"
                        id="confirmPassword"
                        className="form-control border-start-0"
                        placeholder="Confirm your password"
                        style={{borderColor: '#e9ecef'}}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-danger small mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary btn-lg rounded-3 fw-semibold"
                      style={{padding: '12px', fontSize: '16px'}}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
