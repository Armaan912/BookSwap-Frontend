import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
	BookOpen,
	User,
	LogOut,
	Menu,
	X,
	Plus,
	Bell,
	Settings
} from "lucide-react";

const Header = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
		setIsMenuOpen(false);
		setIsProfileOpen(false);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand d-flex align-items-center">
					<BookOpen className="me-2 text-primary" size={24} />
					<span className="fw-bold">BookSwap</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					onClick={toggleMenu}
					aria-expanded={isMenuOpen}
				>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				<div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link to="/" className="nav-link">
								Browse Books
							</Link>
						</li>

						{user && (
							<li className="nav-item">
								<Link to="/dashboard" className="nav-link">
									Dashboard
								</Link>
							</li>
						)}
					</ul>

					<ul className="navbar-nav">
						{user ? (
							<>
								<li className="nav-item dropdown">
									<button
										className="nav-link dropdown-toggle btn btn-link"
										onClick={toggleProfile}
										type="button"
										aria-expanded={isProfileOpen}
									>
										<User size={16} className="me-1" />
										{user.name}
									</button>

									{isProfileOpen && (
										<ul className="dropdown-menu dropdown-menu-end show">
											<li>
												<Link
													to="/my-books"
													className="dropdown-item"
													onClick={() => setIsProfileOpen(false)}
												>
													<BookOpen size={16} className="me-2" />
													My Books
												</Link>
											</li>
											<li>
												<Link
													to="/requests"
													className="dropdown-item"
													onClick={() => setIsProfileOpen(false)}
												>
													<Bell size={16} className="me-2" />
													Requests
												</Link>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<button
													onClick={handleLogout}
													className="dropdown-item"
												>
													<LogOut size={16} className="me-2" />
													Sign out
												</button>
											</li>
										</ul>
									)}
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link to="/login" className="nav-link">
										Sign in
									</Link>
								</li>
								<li className="nav-item">
									<Link to="/register" className="btn btn-primary btn-sm">
										Sign up
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Header;
