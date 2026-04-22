# CI/CD Setup Checklist

## ✅ What's Been Created

- [x] `.github/workflows/ci.yml` - Build, lint, and type check
- [x] `.github/workflows/cd.yml` - Deploy to Render
- [x] `.github/workflows/code-quality.yml` - Security and quality checks
- [x] `.env.example` - Environment variables template
- [x] `CI_CD_COMPLETE_GUIDE.md` - Full documentation

## 🚀 Your Action Items

### Phase 1: Immediate Setup (5 minutes)

- [ ] Go to GitHub repo → **Settings → Secrets and variables → Actions**
- [ ] Create secret `RENDER_SERVICE_ID` with your service ID (from Render URL)
- [ ] Create secret `RENDER_API_KEY` with your Render API key
- [ ] Verify your `.env.local` or `.env.production` contains all needed variables

### Phase 2: Render Configuration (5 minutes)

- [ ] Open Render Dashboard and go to your service
- [ ] Click **Environment**
- [ ] Add all environment variables from `.env.example`
- [ ] Verify `DATABASE_URL` is correctly set (PostgreSQL connection)
- [ ] Verify `NEXTAUTH_SECRET` is set (generate with `openssl rand -hex 32` if missing)

### Phase 3: Test Deployment (5 minutes)

```bash
# Make a test commit to trigger CI/CD
git add .github/ .env.example CI_CD*.md
git commit -m "ci: initial CI/CD setup"
git push origin main
```

- [ ] Go to **GitHub → Actions** tab
- [ ] Watch CI workflow complete
- [ ] Watch CD workflow trigger deployment
- [ ] Check Render logs to confirm deployment succeeded

### Phase 4: Verify Application Works

- [ ] Visit your Render service URL in browser
- [ ] Test core functionality (login, dashboard, etc.)
- [ ] Check Render logs for errors: `tail -f logs/` or Render dashboard

## 🎯 Optional Enhancements

- [ ] Add tests (Jest/Vitest) - instructions in `CI_CD_COMPLETE_GUIDE.md`
- [ ] Add Slack notifications on deploy
- [ ] Set up staging environment
- [ ] Add performance monitoring
- [ ] Configure automated backups

## 📝 Important Notes

- **Database migrations** - If you want auto-migrations on deploy, add this pre-deploy hook in Render:

  ```bash
  npx prisma migrate deploy
  ```

- **Build script** - Make sure `npm run build` works locally:

  ```bash
  npm run build
  ```

- **Node version** - Render will use the Node version specified in your `package.json`
  (currently testing on 18.x and 20.x)

## 🆘 Need Help?

1. **CI failing?** → Check `npm run lint` and `npm run build` work locally
2. **Deployment not triggering?** → Verify GitHub secrets are set correctly
3. **502 errors on Render?** → Check database connection and environment variables
4. **Migrations failing?** → Verify `DATABASE_URL` points to correct PostgreSQL database

---

**Next: Push a test commit and watch the workflows run!** 🚀
