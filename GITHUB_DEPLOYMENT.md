# 🚀 GitHub Deployment Guide for LastBench

This guide will help you deploy the LastBench chat application using GitHub Pages and GitHub Actions.

## 📋 Prerequisites

1. **Git Installation**
   - Download Git from https://git-scm.com/download/win
   - Install with default settings
   - Restart your terminal/command prompt

2. **GitHub Account**
   - Create account at https://github.com
   - Verify email address

3. **Repository Setup**
   - Create new repository on GitHub
   - Choose public repository (free for GitHub Pages)

## 🛠 Step-by-Step Deployment

### Step 1: Install Git (if not installed)

1. Download Git from https://git-scm.com/download/win
2. Run the installer with default settings
3. Open Command Prompt and verify:
   ```bash
   git --version
   ```

### Step 2: Initialize Local Repository

1. Open Command Prompt in your project directory:
   ```bash
   cd "d:\new lastbench"
   ```

2. Initialize Git repository:
   ```bash
   git init
   ```

3. Add all files:
   ```bash
   git add .
   ```

4. Make initial commit:
   ```bash
   git commit -m "Initial commit: LastBench chat application"
   ```

### Step 3: Connect to GitHub Repository

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `lastbench`
   - Description: `Real-time chat application for students and communities`
   - Choose Public repository
   - Don't initialize with README (we already have one)

2. Add remote repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lastbench.git
   ```

3. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Step 4: Deploy Frontend to GitHub Pages

#### Option 1: Automatic Deployment with GitHub Actions

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout
         uses: actions/checkout@v3
         
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
           cache-dependency-path: frontend/package-lock.json
           
       - name: Install dependencies
         run: |
           cd frontend
           npm install
           
       - name: Build
         run: |
           cd frontend
           npm run build
           
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./frontend/build
   ```

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Source: GitHub Actions
   - Save

#### Option 2: Manual Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Create `gh-pages` branch:
   ```bash
   git checkout --orphan gh-pages
   git --work-tree frontend/build add --all
   git --work-tree frontend/build commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   git checkout main
   ```

### Step 5: Deploy Backend (Optional)

#### Option 1: Render (Free Hosting)

1. Create account at https://render.com
2. Connect your GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### Option 2: Railway (Free Hosting)

1. Create account at https://railway.app
2. Import from GitHub
3. Select backend folder
4. Add environment variables

#### Option 3: Heroku (Free Tier)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create lastbench-backend`
4. Deploy: `git subtree push --prefix backend heroku main`

### Step 6: Update Frontend Configuration

1. Update `frontend/package.json` proxy:
   ```json
   "proxy": "https://your-backend-url.com"
   ```

2. Update API URLs in React components:
   ```javascript
   // In contexts/AuthContext.js
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

## 🌐 Access Your Deployed Application

### Frontend (GitHub Pages)
- URL: `https://YOUR_USERNAME.github.io/lastbench`
- Available immediately after deployment

### Backend Options

#### Render
- URL: `https://your-app-name.onrender.com`
- Free tier with automatic deployments

#### Railway
- URL: `https://your-app-name.railway.app`
- Free tier with automatic deployments

#### Heroku
- URL: `https://your-app-name.herokuapp.com`
- Free tier (with limitations)

## 📱 Mobile App Deployment

### Google Play Store

1. **Build APK**:
   ```bash
   cd android
   flutter build apk --release
   ```

2. **Create Play Console Account**:
   - Go to https://play.google.com/console
   - Pay $25 developer fee
   - Create new application

3. **Upload APK**:
   - Upload release APK
   - Add screenshots and descriptions
   - Submit for review

### Alternative App Stores

1. **F-Droid**: Open source app store
2. **APKPure**: Direct APK distribution
3. **GitHub Releases**: Host APK files

## 🔧 Configuration Files

### Backend Environment Variables
Create `backend/.env.production`:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lastbench
JWT_SECRET=your_production_jwt_secret
```

### Frontend Environment Variables
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

## 🚀 Deployment Commands Summary

```bash
# 1. Install Git
# Download from https://git-scm.com/download/win

# 2. Initialize Repository
cd "d:\new lastbench"
git init
git add .
git commit -m "Initial commit"

# 3. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/lastbench.git
git branch -M main
git push -u origin main

# 4. Deploy Frontend
cd frontend
npm run build
# GitHub Actions will deploy automatically

# 5. Deploy Backend (choose one option)
# Option A: Render - Connect repo on render.com
# Option B: Railway - Import repo on railway.app
# Option C: Heroku - Use Heroku CLI
```

## 📊 Monitoring and Analytics

### GitHub Pages Analytics
- Go to repository Settings → Insights → Traffic
- View page views and visitors

### Backend Monitoring
- Add logging to your backend
- Use services like Sentry for error tracking
- Monitor API usage and performance

## 🔒 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Always use HTTPS in production
3. **Authentication**: Secure your API endpoints
4. **Rate Limiting**: Prevent abuse of your APIs
5. **CORS**: Configure proper CORS settings

## 🎯 Next Steps

1. ✅ Install Git
2. ✅ Create GitHub repository
3. ✅ Push code to GitHub
4. ✅ Set up GitHub Actions for frontend
5. ✅ Deploy backend to hosting service
6. ✅ Test deployed application
7. ✅ Share your application with others!

## 🆘 Troubleshooting

### Common Issues

**Git not recognized**:
- Restart Command Prompt after installing Git
- Check PATH environment variable

**GitHub Pages not updating**:
- Check GitHub Actions logs
- Ensure build is successful
- Wait a few minutes for propagation

**Backend deployment issues**:
- Check environment variables
- Review deployment logs
- Verify database connection

**Mobile app build errors**:
- Run `flutter doctor` to check setup
- Update Flutter SDK
- Check Android SDK installation

### Getting Help

- GitHub Documentation: https://docs.github.com
- React Documentation: https://reactjs.org/docs
- Flutter Documentation: https://flutter.dev/docs
- Stack Overflow: Search for specific error messages

---

🎉 **Your LastBench application is now ready for the world!**
