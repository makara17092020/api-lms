# GitHub Actions CI/CD Configuration for AI-LMS Backend

## What's Included

### 📋 Workflow Files Created

1. **`.github/workflows/ci.yml`** - Continuous Integration
   - Triggers on: push to main/develop, and pull requests
   - Tests on Node.js 18.x and 20.x
   - Runs: linting, type checking, and build process
   - Validates Prisma migrations

2. **`.github/workflows/cd.yml`** - Continuous Deployment
   - Triggers on: successful push to main branch
   - Deploys automatically to Render
   - Uses secure API credentials

3. **`.github/workflows/code-quality.yml`** - Quality Checks
   - Triggers on: push to main/develop, and pull requests
   - Checks: npm security audit, outdated dependencies
   - Warns about console statements left in code

4. **`.env.example`** - Environment Template
   - Documents all required environment variables
   - Use as reference for setting up Render environment

## Quick Start - Get It Working in 5 Minutes

### 1️⃣ Get Your Render Credentials

```bash
# From Render Dashboard:
# 1. Go to your service
# 2. Note the service ID from URL: https://dashboard.render.com/services/srv-xxxxxxxxx
# 3. Go to Account Settings → API Keys
# 4. Generate or copy your API key
```

### 2️⃣ Add GitHub Secrets

Go to: **Repository → Settings → Secrets and variables → Actions**

Create these secrets:

- `RENDER_SERVICE_ID`: `srv-xxxxxxxxx` (from your Render URL)
- `RENDER_API_KEY`: Your API key from Render

### 3️⃣ Configure Render Environment Variables

In Render Dashboard for your service:

1. Click **Environment**
2. Add each variable from `.env.example`:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (generate: `openssl rand -hex 32`)
   - `NEXTAUTH_URL` (your Render service URL)
   - `GOOGLE_API_KEY`
   - Other service keys (email, Cloudinary, etc.)

### 4️⃣ Test the Pipeline

```bash
# Create a test commit
git add .github/
git add .env.example
git add CI_CD_SETUP.md
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

**Watch your workflows run:**

- Go to **Repository → Actions** tab
- You should see CI workflow running
- After success, CD workflow deploys to Render

### 5️⃣ Monitor Deployment

- **GitHub**: Check Actions tab for run logs
- **Render**: Check your service's logs for deployment output

---

## 🔄 How the Workflows Work

### CI Pipeline Flow

```
Code Push/PR
    ↓
├─ Setup Node + Cache Dependencies
├─ Run ESLint (code style)
├─ TypeScript Check (type safety)
├─ Build Project (compilation)
└─ Test Database Migration
```

### CD Pipeline Flow

```
Successful Push to main + CI Passed
    ↓
├─ Trigger Render Deployment Webhook
├─ Render pulls latest code
├─ Runs build command
├─ Runs start migrations (if configured)
└─ Deploys to production
```

---

## 🛠️ Customization Examples

### Run on Additional Branches

Edit `.github/workflows/ci.yml`:

```yaml
on:
  push:
    branches: [main, develop, staging] # Add branches here
```

### Add Test Step

Install testing tools first:

```bash
npm install --save-dev vitest @vitest/ui
```

Add to `ci.yml`:

```yaml
- name: Run tests
  run: npm test
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

### Slack Notifications on Deployment

Add step to `cd.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ github.sha }}"
      }
```

### Add Code Coverage Reports

```yaml
- name: Generate coverage
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## 📊 What Gets Deployed to Render

The CD workflow automatically deploys:

- Latest code from `main` branch
- All dependencies installed (`npm install`)
- Built Next.js application (`.next/` directory)
- Prisma migrations (if pre-deploy hook configured)

**Important:** Make sure your `build` script in `package.json` works without errors:

```bash
npm run build  # Must succeed for deployment to work
```

---

## 🚨 Troubleshooting

| Issue                              | Solution                                                |
| ---------------------------------- | ------------------------------------------------------- |
| **CI fails on build**              | Check `npm run build` works locally first               |
| **Deployment webhook 404**         | Verify `RENDER_SERVICE_ID` is correct in GitHub secrets |
| **Database migration fails**       | Ensure `DATABASE_URL` is set in Render environment      |
| **ESLint errors block deployment** | Fix with `npm run lint` or ignore in eslint.config.mjs  |
| **Secrets not working**            | Verify secret names match exactly in workflow files     |

---

## 📚 Next Steps

- [ ] Add unit/integration tests (Jest or Vitest)
- [ ] Add E2E tests (Cypress or Playwright)
- [ ] Set up code coverage tracking
- [ ] Add staging environment with separate deployment
- [ ] Configure Slack/Discord notifications
- [ ] Set up database backup workflows
- [ ] Add performance monitoring alerts

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Only `.env.example` should be in git
2. **Rotate API keys regularly** - Update GitHub secrets when needed
3. **Use environment-specific secrets** - Separate staging and production keys
4. **Review CI logs** - Check for exposed credentials in logs
5. **Keep dependencies updated** - Monitor with `npm outdated`

---

## 📖 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render CI/CD Guide](https://render.com/docs/deploys-from-git)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Migrations](https://www.prisma.io/docs/orm/prisma-migrate)
