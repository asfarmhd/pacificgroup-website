# Deploy to Hostinger (GitHub Actions + FTP)

Every push to the `main` branch triggers an automatic upload of this site to Hostinger via FTP.

## One-time setup

### 1. GitHub repository

- Create a new repository on GitHub (e.g. `pacificgroup-website`).
- Push this folder to it (e.g. `git remote add origin ...`, `git push -u origin main`).

### 2. GitHub secrets

In the repo: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add:

| Secret name     | Value |
|-----------------|--------|
| `FTP_HOST`      | Your Hostinger FTP hostname (e.g. `ftp.yourdomain.com` or the host from hPanel) |
| `FTP_USERNAME`  | Your Hostinger FTP username |
| `FTP_PASSWORD`  | Your Hostinger FTP password |

FTP details are in **Hostinger hPanel** → **Files** → **FTP Accounts** (or in your hosting welcome email).

### 3. Default branch

The workflow runs on push to **main**. If your default branch is **master**, edit `.github/workflows/deploy.yml` and switch the `branches` list to `master`, or add both.

## After setup

- Push to `main` (or the branch you configured) and the site will deploy to `public_html/` on Hostinger.
- Check **Actions** in the GitHub repo to see run history and any errors.
