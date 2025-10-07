import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookList from "../components/books/BookList";
import { BookOpen, Users, MessageSquare, TrendingUp } from "lucide-react";

const Home = () => {
	const { user } = useAuth();

	return (
		<div>
			{/* Hero Section */}
			<div className="hero-section text-white">
				<div className="container py-5">
					<div className="text-center">
						<h1 className="display-4 fw-bold mb-4">Welcome to BookSwap</h1>
						<p className="lead mb-4">
							Trade, share, and discover amazing books with fellow readers
						</p>
						<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
							<Link to="/" className="btn btn-light btn-lg">
								Browse Books
							</Link>
							{user ? (
								<Link to="/add-book" className="btn btn-outline-light btn-lg">
									Add Your Book
								</Link>
							) : (
								<Link to="/register" className="btn btn-outline-light btn-lg">
									Join Now
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-5 bg-light">
				<div className="container">
					<div className="text-center mb-5">
						<h2 className="display-5 fw-bold mb-3">How BookSwap Works</h2>
						<p className="lead">
							Simple steps to start your book trading journey
						</p>
					</div>

					<div className="row g-4">
						<div className="col-md-6 col-lg-3">
							<div className="text-center">
								<div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
									<BookOpen size={32} className="text-primary" />
								</div>
								<h4 className="fw-semibold mb-2">Add Your Books</h4>
								<p className="text-muted">
									Upload books you want to share with the community
								</p>
							</div>
						</div>

						<div className="col-md-6 col-lg-3">
							<div className="text-center">
								<div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
									<Users size={32} className="text-primary" />
								</div>
								<h4 className="fw-semibold mb-2">Browse & Discover</h4>
								<p className="text-muted">
									Explore books shared by other readers in your area
								</p>
							</div>
						</div>

						<div className="col-md-6 col-lg-3">
							<div className="text-center">
								<div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
									<MessageSquare size={32} className="text-primary" />
								</div>
								<h4 className="fw-semibold mb-2">Request Books</h4>
								<p className="text-muted">
									Send requests to book owners and start conversations
								</p>
							</div>
						</div>

						<div className="col-md-6 col-lg-3">
							<div className="text-center">
								<div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
									<TrendingUp size={32} className="text-primary" />
								</div>
								<h4 className="fw-semibold mb-2">Trade & Enjoy</h4>
								<p className="text-muted">
									Complete the trade and enjoy your new reading material
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Books Section */}
			<div className="py-5">
				<div className="container">
					<div className="text-center mb-5">
						<h2 className="display-5 fw-bold mb-3">Recently Added Books</h2>
						<p className="lead">
							Discover the latest books shared by our community
						</p>
					</div>

					<BookList />
				</div>
			</div>
		</div>
	);
};

export default Home;
