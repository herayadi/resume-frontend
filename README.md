# Regina Resume Frontend

Static HTML, CSS, and JavaScript frontend preserving the Laravel resume design. It contains Home, About, Resume, Contact, and an A4 printable CV.

## Data flow

The UI first requests `GET /api/v1/resume` from the Next.js backend. If the backend is unavailable or not configured, it uses `data/resume.json`, generated from the original Laravel SQLite export. The fallback is resilience only; production content should come from Supabase through the API.

## Local preview

1. Start the Next.js backend on port 3000, or use the committed fallback JSON.
2. Run `npm run verify`.
3. Run `npm run serve` and open `http://localhost:8080`.

## Deployment

1. Replace `https://CHANGE-ME.vercel.app/api/v1` once in `js/config.js` with the deployed backend API URL.
2. Import this repository into Cloudflare Pages.
3. Use Framework preset `None`, build command `exit 0`, and output directory `.`.
4. Set the backend `FRONTEND_URL` to the final Cloudflare/custom-domain origin.

The old static PDF remains in `assets/resume` as a rollback asset. The Home download button opens `/cv/?print=1`, which renders current API/database data before opening the browser print dialog.
