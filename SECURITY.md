# 🔒 Security Guidelines for TaskFlow Pro

## Environment Variables Protection

### ⚠️ NEVER COMMIT THESE FILES:
- `.env` (root directory)
- `server/.env` (backend directory)
- Any file containing API keys, passwords, or secrets

### ✅ Safe to Commit:
- `.env.example` (template without real values)
- `server/.env.example` (backend template)

## 🔑 Sensitive Information

### Protected by .gitignore:
- **MongoDB Connection String**: Contains database credentials
- **JWT Secret**: Used for authentication token signing
- **API Keys**: Any third-party service keys
- **Database Passwords**: MongoDB Atlas credentials

## 🚀 Deployment Security

### Production Environment Variables:
1. **Railway (Backend)**:
   ```
   MONGODB_URI=your-atlas-connection-string
   JWT_SECRET=generate-a-new-secure-random-string
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

2. **Vercel (Frontend)**:
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
   ```

## 🛡️ Security Best Practices

### JWT Secret Generation:
```bash
# Generate a secure JWT secret (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Atlas Security:
- ✅ Use strong passwords
- ✅ Enable IP whitelisting (or 0.0.0.0/0 for global access)
- ✅ Use connection string with SSL
- ✅ Regular password rotation

### General Security:
- ✅ Never share .env files
- ✅ Use different secrets for development/production
- ✅ Regularly update dependencies
- ✅ Monitor for security vulnerabilities

## 🚨 If Credentials Are Compromised:

1. **Immediately change MongoDB password** in Atlas
2. **Generate new JWT secret** and redeploy
3. **Update all environment variables** in deployment platforms
4. **Force logout all users** (JWT tokens will become invalid)

## 📞 Contact

If you discover a security vulnerability, please report it responsibly.
