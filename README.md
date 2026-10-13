# John's Mart

A black-theme Next.js store with INR + USD pricing, Supabase-backed product inventory, image uploads, password-protected admin access, and Discord ticket ordering.

## 1. Requirements
- Node.js 20.9+ (Node.js 22 LTS recommended)
- A Supabase project
- A Discord server invite URL

## 2. Install locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

Open http://localhost:3000.

## 3. Configure Supabase
1. Create a project at https://supabase.com.
2. Open SQL Editor and run the full contents of `supabase/schema.sql`.
3. In Project Settings -> API, copy the Project URL and `service_role` key into `.env.local`.
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_` variable or client component.

## 4. Set environment variables
Set these in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: server-only service role key
- `ADMIN_PASSWORD`: a strong, unique admin password
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters
- `NEXT_PUBLIC_DISCORD_INVITE`: your Discord invite URL

Generate a session secret with Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
Restart `npm run dev` after changing `.env.local`.

## 5. Admin
- Open `/admin/login`.
- Enter `ADMIN_PASSWORD`.
- Add products with both INR and USD prices.
- Add/update stock. Stock 0 displays as out of stock.
- Uncheck “Visible in public store” to hide a product without deleting it.

Admin session uses an HttpOnly, SameSite=Strict cookie signed with `ADMIN_SESSION_SECRET`, expires after 8 hours, and is checked on the server for all product changes.

## 6. Discord ordering note
Buy Now copies the chosen product name and price to the customer’s clipboard, then opens your Discord invite. The customer joins (if needed) and manually creates a ticket, then pastes the copied order details. Automatic private ticket creation would require a separate Discord bot integration.

## 7. Deploy to Vercel
1. Push the project to a private GitHub repository.
2. Import it at https://vercel.com.
3. Add every environment variable from `.env.example` in Vercel Project Settings -> Environment Variables.
4. Deploy, then open `/admin/login`.
5. Test adding a sample product and check that it appears on the homepage.

## Notes
- INR and USD prices are independently entered by the admin; they are not automatically converted.
- Product images are public so they can appear on the storefront. Do not upload private images.
- Keep your Supabase service role key and admin secrets private.
