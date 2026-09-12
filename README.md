# Wedding Companion

A phone-sized web app guests open by scanning a QR code. It carries the order of
service, the reception programme, the menu, a shared photo wall and a guestbook.

Built from `wedding-app-prototype-v2.html`, which is kept as the visual reference.

## Setup

1. Install dependencies.

   ```
   npm install
   ```

2. Create a Supabase project, then run `supabase/schema.sql` in its SQL editor.
   That creates the two tables, their row-level security policies, and the
   public `wedding-photos` storage bucket.

3. Copy the environment template and fill it in.

   ```
   cp .env.local.example .env.local
   ```

   | Variable | Purpose |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase settings |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public key, safe in the browser |
   | `COUPLE_PASSCODE` | Six digits, server-side only. Pick a fresh one |
   | `NEXT_PUBLIC_SITE_URL` | Deployed URL, used by the QR generator |
   | `SUPABASE_SERVICE_ROLE_KEY` | Needed only for hide/unhide moderation |

4. Run it.

   ```
   npm run dev
   ```

## Routes

| Path | What it is |
| --- | --- |
| `/` | The guest app, six tabs |
| `/couple` | Passcode-gated dashboard for moderation and bulk download |
| `/qr` | A printable QR code pointing at `NEXT_PUBLIC_SITE_URL` |

## Printable QR files

```
npm run qr
```

Writes a 2000px PNG and an SVG to `public/qr/`. That folder is git-ignored.

## Clearing test data

```
npm run reset            # shows what is there, deletes nothing
npm run reset -- --yes   # deletes it
```

Removes every photo row, every guestbook message, and every file in the
storage bucket. Ceremony content is untouched, since that lives in the code.
Needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, because row-level security
blocks deletes otherwise. Deletion is permanent.

The same thing by hand: in the Supabase dashboard, empty the `photos` and
`wishes` tables from the Table Editor, then delete the files in the
`wedding-photos` bucket under Storage. The bucket is separate from the tables,
so clearing rows alone leaves the images behind.

## Keeping the site alive between now and December

Supabase pauses free projects after 7 days without activity, which breaks the
photo wall and guestbook until someone resumes the project by hand. Vercel is
not a concern: deployments with a domain attached are exempt from its 30-day
retention cull.

`.github/workflows/keep-supabase-awake.yml` pings the database every 3 days so
that timer never runs out. It needs two repository secrets, under Settings ->
Secrets and variables -> Actions:

| Secret | Value |
| --- | --- |
| `SUPABASE_URL` | same as `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | same as `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

The anon key is deliberate. A plain read counts as activity, so the service
role key never has to live in GitHub.

GitHub also disables scheduled workflows after 60 days of repository
inactivity. Since nobody will be committing here after the wedding, the job
commits a heartbeat file every 25 days to keep its own schedule enabled.

If the ping ever fails, the run goes red and GitHub emails you. That usually
means the project was already paused and needs resuming in the Supabase
dashboard.

## How the passcode works

The passcode never reaches the browser. A guest submits it to `/api/verify`,
which compares it in constant time and, on success, sets an HttpOnly cookie
holding an HMAC keyed by the passcode itself. Download and moderation routes
verify that cookie. Changing `COUPLE_PASSCODE` invalidates every cookie already
issued. The cookie lasts 12 hours.

## Notes

- Photo uploads accept JPEG, PNG, WebP and HEIC up to 12 MB.
- The wall and guestbook refresh every 20 seconds.
- Hidden rows stay in the database. Guests cannot read them because row-level
  security filters on `hidden = false`.
