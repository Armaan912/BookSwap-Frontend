# BookSwap Marketplace - Frontend

A React.js frontend application for the BookSwap Marketplace that provides an intuitive interface for users to trade, share, and discover books.

## 🚀 Features

- **User Authentication**: Login/Register with JWT integration
- **Book Management**: Add, edit, view, and delete books
- **Image Upload**: Drag-and-drop style image upload for book covers
- **Search & Filter**: Advanced book search with condition filtering
- **Request System**: Send and manage book requests
- **Dashboard**: User dashboard with statistics and recent activity
- **Responsive Design**: Mobile-friendly Bootstrap-based UI
- **Real-time Updates**: Dynamic data fetching and state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Used book app/frontend"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Create a `.env` file in the frontend directory (optional)
   - Add API URL if different from default:

   ```env
   REACT_APP_API_URL=https://bookswap-backend-np9d.onrender.com
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically reload when you make changes

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── books/
│   │   │   ├── AddBook.js
│   │   │   ├── BookCard.js
│   │   │   ├── BookDetail.js
│   │   │   ├── BookList.js
│   │   │   ├── EditBook.js
│   │   │   └── MyBooks.js
│   │   ├── layout/
│   │   │   └── Header.js
│   │   └── requests/
│   │       └── RequestList.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   └── Home.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 UI Components

### Pages

- **Home**: Landing page with hero section and features
- **Dashboard**: User dashboard with stats and recent activity
- **Login/Register**: Authentication forms with validation

### Book Components

- **BookList**: Searchable and filterable book grid
- **BookCard**: Individual book display with actions
- **BookDetail**: Detailed book view with request functionality
- **AddBook**: Form for adding new books with image upload
- **EditBook**: Form for editing existing books
- **MyBooks**: User's book management interface

### Request Components

- **RequestList**: Manage sent and received book requests

## 🔧 Key Technologies

- **React**: Frontend framework
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API calls
- **Bootstrap**: UI framework and styling
- **Lucide React**: Icon library
- **React Hot Toast**: Notification system
- **Context API**: State management

## 📱 Features Overview

### Authentication

- Secure login/register with form validation
- JWT token management
- Protected routes
- User session persistence

### Book Management

- Add books with title, author, condition, description
- Upload book cover images (up to 5MB)
- Edit existing books
- Delete books
- View book details

### Search & Discovery

- Search books by title
- Filter by book condition (Excellent, Good, Fair, Poor)
- Clear search functionality
- Debounced search for performance

### Request System

- Send book requests with messages
- View received requests
- Accept/decline requests
- Track request status
- View sent requests

### Dashboard

- Book statistics (My Books, Received Requests, Sent Requests)
- Recent activity timeline
- Quick navigation to key features

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Bootstrap UI**: Clean, professional appearance
- **Interactive Elements**: Hover effects, smooth transitions
- **Form Validation**: Real-time validation feedback
- **Loading States**: Spinners and loading indicators
- **Toast Notifications**: User feedback for actions
- **Image Upload**: Drag-and-drop style upload interface

## 🔌 API Integration

The frontend communicates with the backend API through:

- **Authentication**: Login, register, profile management
- **Books**: CRUD operations for books
- **Requests**: Create and manage book requests
- **File Upload**: Image upload for book covers

## 🚀 Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests (if configured)
- `npm eject`: Eject from Create React App

## 🌐 Environment Variables

| Variable            | Description     | Default                                      |
| ------------------- | --------------- | -------------------------------------------- |
| `REACT_APP_API_URL` | Backend API URL | `https://bookswap-backend-np9d.onrender.com` |

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Errors**

   - Ensure backend server is running
   - Check API URL in environment variables
   - Verify CORS settings in backend

2. **Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for syntax errors in components

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token validity
   - Verify user is logged in

### Development Tips

- Use React Developer Tools browser extension
- Check browser console for errors
- Use Network tab to debug API calls
- Test on different screen sizes for responsiveness

## 📦 Dependencies

### Core

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Routing

### UI & Styling

- **bootstrap**: CSS framework
- **lucide-react**: Icons

### Forms & Validation

- **react-hook-form**: Form handling
- **react-hot-toast**: Notifications

### HTTP & State

- **axios**: HTTP client
- **react**: Context API for state

## 🎯 Performance Optimizations

- **Debounced Search**: Prevents excessive API calls
- **Image Optimization**: Proper image sizing and formats
- **Lazy Loading**: Components load as needed
- **Efficient State Management**: Minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
