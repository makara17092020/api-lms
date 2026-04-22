# CI/CD Setup Guide

## Overview

Your project now has automated CI/CD using GitHub Actions with deployment to Render.

## Workflows Created

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop` branches:

- ✅ Lints code with ESLint
- ✅ Type checks with TypeScript
- ✅ Builds the Next.js project
- ✅ Tests on Node 18.x and 20.x
- ✅ Validates Prisma schema

### 2. **CD Workflow** (`.github/workflows/cd.yml`)

Automatically deploys to Render when:

- Code is pushed to `main` branch
- CI workflow completes successfully

## Setup Instructions

### Step 1: Add GitHub Secrets for Render Deployment

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add these secrets:
   - `RENDER_SERVICE_ID`: Your Render service ID (found in your Render dashboard URL: `https://dashboard.render.com/services/srv-xxx`)
   - `RENDER_API_KEY`: Your Render API key (get from Account Settings → API Keys on Render)

### Step 2: Verify Environment Variables

Make sure your `.env.local` or `.env.production` contains required variables for:

- Database connection (DATABASE_URL)
- NextAuth secrets
- Google Generative AI API keys
- Any other service credentials

Add these as **Render Environment Variables**:

1. In Render dashboard, go to your service
2. Click **Environment**
3. Add all necessary environment variables

### Step 3: Update CD Deployment Hook

The CD workflow uses Render's deployment webhook. Ensure:

1. Your Render service has "Auto-Deploy" disabled (so GitHub Actions controls it)
2. Your `RENDER_SERVICE_ID` is correctly set in the workflow

### Step 4: Configure Prisma Migrations (Optional)

If you want automatic migrations during deployment:

1. In Render dashboard, go to your service
2. Click **Settings → Build & Deploy**
3. Add a pre-deploy command:
   ```bash
   npx prisma migrate deploy
   ```

## Next Steps: Adding Tests

To add testing capability:

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Or use Vitest (faster alternative)
npm install --save-dev vitest @vitest/ui
```

Then update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Add to `.github/workflows/ci.yml`:

```yaml
- name: Run tests
  run: npm test -- --coverage
```

## Monitoring & Debugging

- **GitHub Actions Logs**: View at `Settings → Actions` on your repo
- **Render Logs**: Check service logs in your Render dashboard
- **Failed Deployments**: Check CI logs to see what failed, fix, and push again

## Customization

You can modify the workflows to:

- Add additional branches (`staging`, `production`)
- Include code coverage reports
- Add security scanning (Snyk, CodeQL)
- Notify Slack on deployment
- Run E2E tests (Cypress, Playwright)
