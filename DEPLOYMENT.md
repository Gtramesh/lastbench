# LastBench Deployment Guide

Complete deployment guide for the LastBench chat application across all platforms.

## 🚀 Overview

LastBench consists of three main components:
- **Backend Server** (Node.js + Express + Socket.io)
- **Frontend Web App** (React + Tailwind CSS)
- **Mobile App** (Flutter)

## 📋 Prerequisites

- Domain name (optional)
- SSL certificates (recommended)
- Cloud hosting account
- Database hosting (MongoDB Atlas recommended)
- Firebase project (for mobile push notifications)

## 🌐 Backend Deployment

### Option 1: Render (Recommended)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Choose "New Web Service"

2. **Connect Repository**
   - Connect your Git repository
   - Select the `backend` folder as root directory

3. **Configure Environment**
   ```bash
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lastbench
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=production
   ```

4. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Starter (Free) or Standard

5. **Deploy**
   - Click "Deploy Web Service"
   - Wait for deployment to complete

### Option 2: Railway

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose the backend folder

3. **Environment Variables**
   - Add all required environment variables
   - Set NODE_ENV to production

4. **Deploy**
   - Railway will automatically deploy
   - Get your deployment URL

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t2.micro (Free Tier)
   - Configure security groups (ports 22, 80, 443)

2. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd lastbench/backend
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   sudo nano .env
   
   # Start with PM2
   pm2 start server.js --name lastbench-backend
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your Git repository

2. **Configure Project**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   ```bash
   REACT_APP_SERVER_URL=https://your-backend-url.com
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Vercel automatically deploys on push
   - Get your deployment URL

### Option 2: Netlify

1. **Create Netlify Account**
   - Sign up at [netlify.com](https://netlify.com)

2. **Connect Repository**
   - Choose "New site from Git"
   - Select your repository
   - Set base directory to `frontend`

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`

4. **Environment Variables**
   - Add React environment variables

### Option 3: AWS S3 + CloudFront

1. **Create S3 Bucket**
   - Enable static website hosting
   - Set index document to `index.html`

2. **Build and Upload**
   ```bash
   cd frontend
   npm run build
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Set origin to S3 bucket
   - Configure caching

## 📱 Mobile App Deployment

### Google Play Store

1. **Prepare App for Release**
   ```bash
   cd android
   flutter build appbundle --release
   ```

2. **Create Play Console Account**
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Pay developer fee ($25 one-time)

3. **Create App Listing**
   - Fill app details
   - Upload app bundle
   - Add screenshots and descriptions
   - Set content rating

4. **Configure Release**
   - Choose release track (Internal > Alpha > Beta > Production)
   - Add release notes
   - Submit for review

### APK Distribution

1. **Build Signed APK**
   ```bash
   # Generate signing key
   keytool -genkey -v -keystore ~/upload-keystore.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   
   # Build signed APK
   flutter build apk --release --signing-config release
   ```

2. **Distribute APK**
   - Upload to website
   - Share via email
   - Use alternative app stores

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Atlas Account**
   - Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)

2. **Create Cluster**
   - Choose cluster tier (M0 Free for development)
   - Select region closest to your users
   - Configure network access

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Update your backend environment variables

4. **Create Database User**
   - Create database user with strong password
   - Grant read/write permissions
   - Use credentials in connection string

### Self-hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Configure MongoDB**
   - Edit `/etc/mongod.conf`
   - Set bind IP to 0.0.0.0 for remote access
   - Enable authentication

3. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## 🔔 Firebase Setup

1. **Create Firebase Project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Create new project
   - Enable Cloud Messaging

2. **Configure Android App**
   - Add Android app to Firebase project
   - Download `google-services.json`
   - Place in `android/app/`

3. **Configure Web App**
   - Add web app to Firebase project
   - Get Firebase config
   - Add to frontend environment variables

4. **Server Configuration**
   - Generate server key
   - Add to backend environment variables

## 🔒 SSL Configuration

### Let's Encrypt (Free)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Cloudflare (Recommended)

1. **Create Cloudflare Account**
   - Sign up at [cloudflare.com](https://cloudflare.com)

2. **Add Domain**
   - Add your domain to Cloudflare
   - Update nameservers at registrar

3. **Configure SSL**
   - Enable "Full (strict)" SSL
   - Enable automatic HTTPS rewrites

## 📊 Monitoring and Logging

### Backend Monitoring

1. **Application Monitoring**
   - Use PM2 monitoring: `pm2 monit`
   - Set up error tracking (Sentry)
   - Configure logging (Winston)

2. **Server Monitoring**
   - Use CloudWatch (AWS)
   - Set up Uptime monitoring
   - Monitor resource usage

### Frontend Monitoring

1. **Performance Monitoring**
   - Google Analytics
   - Vercel Analytics
   - Web Vitals monitoring

2. **Error Tracking**
   - Sentry integration
   - Console error logging
   - User feedback collection

## 🔄 CI/CD Pipeline

### GitHub Actions

1. **Backend Pipeline**
   ```yaml
   name: Deploy Backend
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Render
           uses: johnnymanzana/render-deploy@v0.0.8
           with:
             service-id: ${{ secrets.RENDER_SERVICE_ID }}
             api-key: ${{ secrets.RENDER_API_KEY }}
   ```

2. **Frontend Pipeline**
   ```yaml
   name: Deploy Frontend
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.ORG_ID }}
             vercel-project-id: ${{ secrets.PROJECT_ID }}
   ```

## 🧪 Testing in Production

### Backend Testing
```bash
# Test API endpoints
curl -X GET https://your-api.com/api/user/all

# Test Socket.io connection
wscat -c wss://your-api.com
```

### Frontend Testing
- Open browser dev tools
- Check network requests
- Test Socket.io connection
- Verify authentication flow

### Mobile Testing
- Test on real devices
- Check push notifications
- Verify offline functionality
- Test file uploads

## 📝 Environment Variables Checklist

### Backend
- [ ] PORT
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] NODE_ENV

### Frontend
- [ ] REACT_APP_SERVER_URL
- [ ] REACT_APP_API_URL

### Mobile
- [ ] Firebase configuration
- [ ] API base URL

## 🔧 Troubleshooting

### Common Issues
- **CORS errors**: Update backend CORS settings
- **Socket connection**: Check firewall and SSL
- **Database connection**: Verify MongoDB URI
- **File uploads**: Check directory permissions
- **Push notifications**: Verify Firebase config

### Debug Commands
```bash
# Backend logs
pm2 logs lastbench-backend

# Frontend build errors
npm run build 2>&1 | tee build.log

# Mobile build issues
flutter doctor -v
```

## 📈 Scaling Considerations

### Backend Scaling
- Use load balancer
- Implement database sharding
- Add Redis for caching
- Use CDN for static files

### Frontend Scaling
- Implement code splitting
- Use CDN for assets
- Optimize bundle size
- Enable browser caching

### Database Scaling
- Read replicas
- Index optimization
- Connection pooling
- Regular backups

---

**LastBench** - Ready for production deployment! 🚀
