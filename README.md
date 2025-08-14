# Laxoria Backend (Ready)

This is a minimal, ready-to-deploy backend for **Laxoria** with:
- TypeScript source files
- Prebuilt `dist/` JavaScript output (so Vercel can run without running `tsc`)
- `package.json` with scripts

## How to deploy to Vercel
1. Create a Vercel project and connect your Git repo or push this project.
2. In Project Settings set:
   - Install Command: `npm install`
   - Build Command: `npm run build`  (optional, dist is included)
   - Output Directory: `.`
3. Add Environment Variables in Vercel:
   - `DATABASE_URL` (e.g. `file:./dev.db` for local sqlite or a Postgres URL)
   - `SECRET_KEY`
4. Deploy.

## Run locally
```bash
npm install
npm run build
npm start
```
