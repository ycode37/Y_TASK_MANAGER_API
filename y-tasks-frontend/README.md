# Y. Tasks — frontend

A minimalist frontend for the [`Y_TASK_MANAGER_API`](https://github.com/ycode37/Y_TASK_MANAGER_API)
backend: register, sign in, and manage a task list with search, filtering,
sorting and pagination.

Built with **Vite + React**, **Tailwind CSS v4**, **Framer Motion**, **Zustand**,
**axios**, and **lucide-react**.

## Design approach

The whole UI is a single running list rather than a card grid — hairline
dividers instead of boxes and shadows, one serif for the few "brand" moments
(titles, empty states) and a grotesk sans for everything functional. The one
elaborate animation is the checkbox: checking a task draws an SVG checkmark
and a strike-through, like crossing something off a paper list. Everything
else (buttons, page transitions, toasts) follows one quieter, consistent
hover/tap language so that motion never competes with the list itself.

## Getting started

1. Make sure the backend is running first (it needs `MONGO_URI` and
   `JWT_SECRET` set in its own `.env`, see the backend repo). By default it
   listens on `http://localhost:3000` and only accepts requests from
   `http://localhost:5173` — so the frontend **must** run on port 5173.

2. Install and run the frontend:

   ```bash
   npm install
   npm run dev
   ```

   It will start at `http://localhost:5173` (the dev server is pinned to
   that exact port in `vite.config.js` to match the backend's CORS setting).

3. If your backend runs somewhere other than `http://localhost:3000`, copy
   `.env.example` to `.env` and change `VITE_API_URL`.

## Notes on the backend as-is

A few things in the current API shaped some frontend decisions — worth
knowing if you touch the backend later:

- **Tokens expire in 5 minutes** (`jwt.sign(..., { expiresIn: "5m" })`) and
  there's no refresh endpoint. The frontend tracks that expiry itself
  (`useAuthStore`) and signs the person out proactively with a "session
  ended" toast, rather than letting a stale token hit the API and fail.
- **Expired/invalid/missing tokens currently surface as a generic 500**,
  because `authMiddleware` (`middleware/jwt.js`) throws synchronously
  instead of returning `401`, and that unhandled throw falls through to the
  generic error handler. The frontend treats any `401`/`403`/`500` on a
  request that *should* have been authenticated as a session issue, so the
  person sees a plain-language message instead of "Internal Server Error."
- **`GET /user/me` is currently non-functional** — its `authMiddleware` is
  commented out in `routes/user.route.js`, so `req.userId` is always
  `undefined`. The frontend never calls it; it keeps the `user` object
  returned by `/user/login` and `/user/register` in local state instead.
- Error response shapes vary by failure type (`{ message }`,
  `{ message, errors }` from Zod, Mongoose `ValidationError`, the duplicate
  email `11000` case, etc.). `src/lib/api.js` has a single
  `getErrorMessage()` helper that normalizes all of them, and also cleans up
  the one typo in the API's own copy ("Invalid Credetnials").

## Project structure

```
src/
  lib/api.js              axios instance, interceptors, endpoint calls
  store/                  zustand stores (auth, tasks, toasts)
  components/
    LoginPage / RegisterPage / AuthLayout   auth screens
    Dashboard / QuickAdd / Toolbar          task list screen
    TaskRow                                 checkbox + inline rename + delete
    Pagination / Skeleton / EmptyState      list states
    Toaster / Button / Field                shared primitives
```

## Building for production

```bash
npm run build
```

Outputs a static bundle to `dist/`. Remember the backend's CORS is currently
hard-coded to `http://localhost:5173`, so if you deploy the frontend
elsewhere you'll need to update `cors({ origin: ... })` in `server.js`
accordingly.
