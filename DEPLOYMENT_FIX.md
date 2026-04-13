# Vercel Deployment Fix - Images, Videos & AI Chatbot

## Issues Fixed

### 1. ✅ Backend folder not included in Vercel deployment
**Problem:** Images and videos weren't loading because the `backend/` directory (containing database models) wasn't included in `vercel.json`.

**Solution:** Updated `vercel.json` to include `"backend/**"` in the `includeFiles` array.

### 2. ✅ AI Chatbot widget added
**Problem:** No chatbot widget existed on the website, even though the chat API was available.

**Solution:** Added a floating chatbot widget with:
- `index.html` - Added chatbot HTML structure
- `css/styles.css` - Added chatbot styling
- `js/chatbot.js` - Added chatbot functionality

---

## What Was Changed

### Files Modified:
1. **vercel.json** - Added `"backend/**"` to deployment files
2. **index.html** - Added chatbot widget HTML before closing `</body>` tag
3. **css/styles.css** - Added chatbot widget styles
4. **js/chatbot.js** - Created new file for chatbot functionality

---

## Required Steps for Vercel Deployment

### Step 1: Add GROQ API Key (IMPORTANT!)

Your chatbot requires a **GROQ API key** which is currently missing from your `.env` file.

#### Get GROQ API Key:
1. Visit: https://console.groq.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key

#### Add to Vercel:
1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** [paste your GROQ API key]
   - **Environments:** Production, Preview, Development

### Step 2: Verify MongoDB Connection

Make sure your MongoDB connection string is set in Vercel:
1. Go to **Settings** → **Environment Variables**
2. Verify `MONGODB_URI` is set correctly:
   ```
   MONGODB_URI=mongodb+srv://sabirahmad_db_user:cKPCpACpGBTPYELz@cluster0.eb4cbeq.mongodb.net/gilgit-treks?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 3: Deploy to Vercel

#### Option A: Push to GitHub (Recommended)
```bash
git add .
git commit -m "Fix Vercel deployment - add backend folder and AI chatbot"
git push origin main
```
Vercel will automatically redeploy.

#### Option B: Manual Deploy via Vercel CLI
```bash
vercel --prod
```

---

## Testing After Deployment

### 1. Test Images & Videos
- Visit your deployed site: https://your-site.vercel.app
- Scroll down to the **Gallery** section
- Scroll down to the **Videos** section
- Both should now load properly

### 2. Test AI Chatbot
- Look for the **floating green chat button** in the bottom-right corner
- Click it to open the chat window
- Type a message like "What destinations do you offer?"
- You should get an AI response

### 3. Check API Health
Visit: `https://your-site.vercel.app/api/health`
Should return: `{"ok":true}`

### 4. Check Page Data
Visit: `https://your-site.vercel.app/api/page-data?need=gallery,videos`
Should return JSON with gallery images and videos

---

## Troubleshooting

### If images/videos still don't load:

1. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for errors related to `/api/page-data`

2. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on your latest deployment
   - Check the "Functions" tab for errors

3. **Verify MongoDB Connection:**
   - Ensure your MongoDB cluster is accessible from Vercel's IP addresses
   - Check MongoDB Atlas → Network Access → Allow access from anywhere (0.0.0.0/0)

### If chatbot doesn't respond:

1. **Missing GROQ_API_KEY:**
   - The most common issue
   - Add it to Vercel environment variables (see Step 1 above)
   - Redeploy after adding

2. **Check Chat API:**
   - Visit: `https://your-site.vercel.app/api/chat/test`
   - Should show if GROQ API is working

3. **Rate Limiting:**
   - The chat endpoint has rate limiting (10 requests per 15 minutes)
   - Wait and try again

---

## Features of the New Chatbot

✅ **Floating button** - Always visible in bottom-right corner
✅ **Smooth animations** - Professional slide-in effects
✅ **Typing indicator** - Shows "..." while AI is thinking
✅ **Context memory** - Remembers last 10 exchanges per user
✅ **Mobile responsive** - Works on all screen sizes
✅ **Keyboard shortcuts** - ESC to close
✅ **Click outside to close** - User-friendly UX

---

## Environment Variables Checklist

Make sure these are set in Vercel:

- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - For user authentication
- ✅ `DEV_JWT_SECRET` - For developer panel
- ⚠️ `GROQ_API_KEY` - **REQUIRED for chatbot** (currently missing!)
- ✅ `EMAIL_USER` - Gmail for newsletters
- ✅ `EMAIL_PASS` - Gmail app password

---

## Next Steps

1. ✅ Get GROQ API key from https://console.groq.com/
2. ✅ Add `GROQ_API_KEY` to Vercel environment variables
3. ✅ Commit and push changes to GitHub
4. ✅ Wait for Vercel to redeploy
5. ✅ Test gallery, videos, and chatbot on live site

---

## Support

If you encounter any issues after deployment, check:
- Vercel deployment logs
- Browser console errors (F12)
- MongoDB Atlas network access
- Environment variables are set correctly

The chatbot will display an error message if the GROQ API key is missing or invalid, so you'll know immediately if there's a configuration issue.

---

**All changes are now ready for deployment!** 🚀
