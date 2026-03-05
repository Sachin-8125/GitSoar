# Frontend Deployment Guide

## Vercel Deployment

This frontend is configured for automatic deployment on Vercel.

### Prerequisites

1. **Backend URL**: Ensure your backend is deployed and you have the API URL
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: The project should be connected to GitHub

### Environment Variables

Set the following environment variable in your Vercel project settings:

- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Project**: Vercel will auto-detect the project as a Vite app
3. **Set Environment Variables**: Add `VITE_API_URL` in the project settings
4. **Deploy**: Vercel will automatically deploy on git push

### Build Configuration

The project uses the following build settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 20.x
- **Framework**: Vite

### Performance Optimizations

- Code splitting is configured for optimal loading
- Production builds are minified and gzipped
- Static assets are optimized for fast delivery

### Troubleshooting

If deployment fails:
1. Check that `VITE_API_URL` is correctly set
2. Verify the backend is accessible
3. Check the build logs in Vercel dashboard
4. Ensure all dependencies are properly installed

### Custom Domain

To use a custom domain:
1. Add your domain in Vercel project settings
2. Configure DNS settings as instructed
3. Vercel will handle SSL certificate setup

### Monitoring

- Vercel provides built-in analytics and monitoring
- Check the dashboard for deployment status and performance metrics
- Set up alerts for deployment failures if needed