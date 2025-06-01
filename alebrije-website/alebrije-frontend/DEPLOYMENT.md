# 🚀 ALBJ Token Website - Deployment Guide

## Overview
This guide walks you through deploying the ALBJ Token website to Netlify and connecting it to the albj.io domain.

## 📋 Prerequisites
- [Netlify Account](https://netlify.com) (free)
- Domain access to albj.io
- This codebase ready for deployment

## 🚀 Deployment Steps

### Phase 1: Deploy to Netlify (Staging)

#### Option A: Deploy via Git (Recommended)
1. **Push code to Git repository** (GitHub/GitLab)
2. **Connect to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Set build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Node version:** `18`

#### Option B: Manual Deploy
1. **Build the project locally:**
   ```bash
   npm run build
   ```
2. **Deploy to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Drag and drop the `dist` folder

### Phase 2: Test Staging Environment
1. **Get staging URL** (e.g., `amazing-albj-123.netlify.app`)
2. **Test all functionality:**
   - ✅ Website loads correctly
   - ✅ Navigation works
   - ✅ Wallet connection works
   - ✅ Test mode works (`?testmode=true`)
   - ✅ All sections display properly
   - ✅ Mobile responsiveness
   - ✅ SSL certificate active

### Phase 3: Connect Custom Domain

#### Step 1: Add Domain to Netlify
1. In Netlify Dashboard → Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `albj.io` and `www.albj.io`

#### Step 2: Configure DNS
**Option A: Use Netlify DNS (Recommended)**
1. Point your domain nameservers to Netlify:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

**Option B: External DNS**
1. Add these DNS records to your domain provider:
   ```
   Type: A      Name: @         Value: [Netlify IP from dashboard]
   Type: CNAME  Name: www       Value: [your-site].netlify.app
   ```

#### Step 3: Enable HTTPS
- Netlify automatically provisions SSL certificates
- Verify HTTPS works for both `albj.io` and `www.albj.io`

## 🔧 Build Configuration

### Environment Variables (if needed)
```bash
# Add to Netlify Environment Variables if using any APIs
VITE_API_URL=https://api.albj.io
VITE_SOLANA_NETWORK=mainnet-beta
```

### Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18`
- **Build timeout:** `10 minutes`

## 📊 Post-Deployment Checklist

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] Navigation works on all sections
- [ ] Countdown timer displays correctly
- [ ] Wallet connection functional
- [ ] Test mode works (`albj.io/?testmode=true`)
- [ ] All modals work properly
- [ ] Mobile responsive design
- [ ] Social media links work
- [ ] Whitepaper downloads correctly

### SEO & Performance
- [ ] Page titles and meta descriptions
- [ ] Open Graph tags for social sharing
- [ ] Favicon displays correctly
- [ ] Page speed optimization
- [ ] SSL certificate active
- [ ] Redirects working (www → non-www)

### Security Headers
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection enabled
- [ ] Content Security Policy
- [ ] HTTPS enforced

## 🔄 Continuous Deployment

### Automatic Deployments
Once connected to Git:
- **Push to main branch** → Auto-deploy to production
- **Pull requests** → Deploy previews automatically
- **Branch deployments** → Test features before merging

### Manual Deployments
- Drag & drop new `dist` folder to Netlify
- Use Netlify CLI: `netlify deploy --prod`

## 🚨 Troubleshooting

### Common Issues
1. **Build fails:** Check Node version and dependencies
2. **404 errors:** Verify `netlify.toml` redirects are correct
3. **Assets not loading:** Check public folder structure
4. **SSL issues:** Wait 24-48 hours for DNS propagation

### Support Resources
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [DNS Propagation Checker](https://dnschecker.org/)

## 🎯 Performance Optimization

### Current Build Size
- Total bundle: ~643 KB (gzipped: ~198 KB)
- Consider code splitting for larger chunks
- Optimize images and assets

### Recommended Optimizations
- Enable Netlify's image optimization
- Use CDN for static assets
- Implement service worker for caching
- Monitor Core Web Vitals

---

## 🚀 Quick Deploy Commands

```bash
# Build for production
npm run build

# Test build locally
npm run preview

# Deploy via Netlify CLI (install first: npm install -g netlify-cli)
netlify login
netlify init
netlify deploy --prod
```

**🎉 Your ALBJ Token website will be live at albj.io!** 