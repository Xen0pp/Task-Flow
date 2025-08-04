# 🚀 TaskFlow Pro - Advanced Collaborative Task Management

<div align="center">

![TaskFlow Pro Logo](https://img.shields.io/badge/TaskFlow-Pro-blue?style=for-the-badge&logo=react)

**The Ultimate Hackathon & Project Management Platform** 🎯

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io)

</div>

## 🌟 Overview

TaskFlow Pro is a cutting-edge, real-time collaborative platform designed specifically for hackathons, project management, and team collaboration. Built with modern web technologies, it provides seamless organization management, task tracking, and event coordination all in one beautiful interface.

### ✨ Key Highlights

- 🏢 **Multi-Organization Support** - Create and manage multiple organizations
- 🎯 **Hackathon Management** - Complete hackathon lifecycle tracking
- ✅ **Advanced Task Management** - Drag-and-drop, real-time updates
- 🚀 **Real-time Collaboration** - Live updates across all team members
- 🌙 **Dark/Light Mode** - Beautiful themes for any preference
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- 🔒 **Secure Authentication** - JWT-based user management
- 🌐 **Global Deployment** - MongoDB Atlas + Cloud hosting ready

---

## 🎯 Features

### 🏢 Organization Management
- **Create Organizations** with unique invite codes
- **Invite Team Members** via shareable codes
- **Member Management** with role-based access
- **Multi-Organization Support** for different projects

### 🎪 Hackathon Tracking
- **Complete Hackathon Lifecycle** from registration to completion
- **Event & Milestone Management** with dates and descriptions
- **Team Collaboration** with shared hackathon spaces
- **Progress Tracking** with visual status indicators
- **Real-time Updates** when team members make changes

### ✅ Advanced Task Management
- **Drag & Drop Interface** for intuitive task organization
- **Real-time Synchronization** across all team members
- **Task Completion Tracking** with beautiful animations
- **Priority Management** with visual indicators
- **Filtering & Search** to find tasks quickly
- **Optimistic Updates** for instant user feedback

### 🚀 Real-time Collaboration
- **Socket.io Integration** for live updates
- **Multi-user Synchronization** across all features
- **Instant Notifications** for team activities
- **Collaborative Editing** with conflict resolution

### 🎨 User Experience
- **Modern UI/UX** with Tailwind CSS
- **Smooth Animations** and transitions
- **Dark/Light Mode Toggle** with system preference detection
- **Responsive Design** that works on all devices
- **Intuitive Navigation** with tab-based interface

---

## 🛠️ Tech Stack

### Frontend 🎨
- **React 18** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **date-fns** - Date manipulation library

### Backend ⚙️
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database 🗄️
- **MongoDB Atlas** - Cloud-hosted MongoDB
- **Mongoose** - Elegant MongoDB object modeling
- **Aggregation Pipeline** - Complex data queries
- **Indexing** - Optimized query performance

### Deployment 🚀
- **Vercel** - Frontend deployment platform
- **Railway** - Backend deployment platform
- **MongoDB Atlas** - Database hosting
- **Environment Variables** - Secure configuration management

---

## 🚀 Quick Start

### Prerequisites 📋

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) 📦
- **npm** or **yarn** package manager 📦
- **Git** for version control 🔧
- **MongoDB Atlas** account (free tier available) 🗄️

### 1. Clone the Repository 📥

```bash
git clone https://github.com/yourusername/taskflow-pro.git
cd taskflow-pro
```

### 2. Install Dependencies 📦

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup 🔧

#### Backend Configuration
```bash
# Copy the environment template
cp server/.env.example server/.env

# Edit server/.env with your actual values:
# - Replace MongoDB URI with your Atlas connection string
# - Generate a secure JWT secret
# - Configure CORS origins
```

#### Frontend Configuration (Optional)
```bash
# For local development, create .env.local (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> .env.local
```

### 4. MongoDB Atlas Setup 🗄️

1. **Create MongoDB Atlas Account** at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create a New Cluster** (free tier M0 is perfect)
3. **Create Database User** with read/write permissions
4. **Configure Network Access** (add your IP or 0.0.0.0/0 for global access)
5. **Get Connection String** and add it to `server/.env`

### 5. Generate Secure JWT Secret 🔐

```bash
# Generate a secure random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in server/.env
```

### 6. Start the Application 🚀

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm start
```

### 7. Access the Application 🌐

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 Production Deployment

### Backend Deployment (Railway) 🚂

1. **Create Railway Account** at [railway.app](https://railway.app)
2. **Connect GitHub Repository**
3. **Set Root Directory** to `/server`
4. **Configure Environment Variables**:
   ```
   MONGODB_URI=your-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
5. **Deploy** - Railway will automatically build and deploy

### Frontend Deployment (Vercel) ⚡

1. **Create Vercel Account** at [vercel.com](https://vercel.com)
2. **Import GitHub Repository**
3. **Configure Build Settings**:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
   ```
5. **Deploy** - Vercel will build and deploy automatically

### Update CORS Configuration 🔧

After deployment, update the `CLIENT_URL` in Railway with your actual Vercel URL.

---

## 📱 Usage Guide

### Getting Started 🎯

1. **Register Account** - Create your user account
2. **Create Organization** - Set up your team/project organization
3. **Invite Team Members** - Share the invite code with your team
4. **Start Collaborating** - Create hackathons, add events, manage tasks

### Organization Management 🏢

- **Create Organization**: Set up a new team workspace
- **Generate Invite Code**: Get a unique code to share with team members
- **Manage Members**: View all organization members and their details
- **Multi-Organization**: Join multiple organizations for different projects

### Hackathon Management 🎪

- **Create Hackathons**: Add new hackathon projects with team details
- **Add Events & Milestones**: Track important dates and deadlines
- **Monitor Progress**: Visual status tracking and completion indicators
- **Team Collaboration**: Real-time updates when team members make changes

### Task Management ✅

- **Create Tasks**: Add new tasks with descriptions and priorities
- **Drag & Drop**: Reorder tasks with intuitive drag and drop
- **Mark Complete**: Check off completed tasks with beautiful animations
- **Filter Tasks**: Show/hide completed tasks, search functionality
- **Real-time Sync**: See updates instantly across all team members

---

## 🔒 Security Features

### Authentication & Authorization 🛡️
- **JWT-based Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Organization-based Access Control** - users only see their organization's data
- **Secure API Endpoints** with authentication middleware

### Data Protection 🔐
- **Environment Variables** for sensitive configuration
- **CORS Protection** with origin whitelisting
- **MongoDB Atlas** with SSL encryption
- **Input Validation** and sanitization

### Deployment Security 🚀
- **Secure Environment Variable Management**
- **Production-ready Configuration**
- **HTTPS Enforcement** in production
- **Regular Security Updates**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup 💻

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes** and test thoroughly
4. **Commit Changes**: `git commit -m 'Add amazing feature'`
5. **Push to Branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Contribution Guidelines 📝

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the excellent database platform
- **Tailwind CSS** for the beautiful styling system
- **Socket.io** for real-time communication
- **Vercel & Railway** for seamless deployment platforms

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/taskflow-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/taskflow-pro/discussions)
- **Email**: your-email@example.com

---

<div align="center">

**Made with ❤️ for the developer community**

⭐ **Star this repository if you found it helpful!** ⭐

</div>
