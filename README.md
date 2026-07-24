# Simple Authentication App with JWT

This project is a small full-stack authentication example using:

- Next.js frontend in `front-end/`
- Express backend in `backend/`
- Supabase as the user database
- `bcryptjs` for password hashing
- JSON Web Tokens stored in an HTTP-only cookie

## Auth Architecture

The frontend talks to the backend through `front-end/lib/api.ts`.

```txt
Next.js pages -> front-end/lib/api.ts -> Express /api/auth routes -> Supabase users table
```

The backend mounts all auth routes under:

```txt
http://localhost:5000/api/auth
```

CORS is configured in `backend/src/server.js` to allow requests from:

```txt
http://localhost:3000
```

Because authentication uses cookies, frontend requests include:

```ts
credentials: "include"
```

## Signup Flow

Signup starts from `front-end/app/signup/page.tsx`.

1. The user enters email, password, and confirm password.
2. The frontend checks that all fields are filled.
3. The frontend checks that password and confirm password match.
4. The page calls `register(email, password)` from `front-end/lib/api.ts`.
5. `register()` sends a `POST` request to:

```txt
/api/auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "plain-text-password"
}
```

The backend route is defined in `backend/src/routes/authRoutes.js`:

```js
router.post("/register", registerUser);
```

`registerUser` in `backend/src/controllers/authController.js` then:

1. Reads `email` and `password` from `req.body`.
2. Hashes the password with `bcrypt.hash(password, 10)`.
3. Inserts the email and hashed password into the Supabase `users` table.
4. Returns `{ "message": "User created" }` if the insert succeeds.
5. Returns a `400` response with the Supabase error message if the insert fails.

The signup flow does not automatically log the user in. After success, the frontend shows a message asking the user to log in.

## Login Flow

Login starts from `front-end/app/page.tsx`.

1. The user enters email and password.
2. The page calls `login(email, password)` from `front-end/lib/api.ts`.
3. `login()` sends a `POST` request to:

```txt
/api/auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "plain-text-password"
}
```

The backend route is:

```js
router.post("/login", loginUser);
```

`loginUser` then:

1. Looks up the user in the Supabase `users` table by email.
2. Returns `401` with `{ "error": "Invalid email" }` if no user is found.
3. Compares the submitted password with the stored hashed password using `bcrypt.compare()`.
4. Returns `401` with `{ "error": "Wrong password" }` if the password does not match.
5. Creates a JWT with `generateToken(user.id)`.
6. Stores the JWT in a cookie named `token`.
7. Returns `{ "message": "Login successful" }`.

The JWT payload contains the user id:

```json
{
  "id": "user-id"
}
```

The token currently expires after `1m`, as configured in `backend/src/utils/generateToken.js`.

## Cookie-Based Session

After login, the backend sets this cookie:

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: false,
});
```

Important details:

- `httpOnly: true` means browser JavaScript cannot read the cookie.
- `secure: false` allows the cookie over local HTTP during development.
- The browser sends the cookie automatically on later API requests when `credentials: "include"` is used.

## Protected Profile Flow

The profile page lives at `front-end/app/profile/page.tsx`.

When the page loads:

1. It calls `getProfile()` from `front-end/lib/api.ts`.
2. `getProfile()` sends a `GET` request to:

```txt
/api/auth/profile
```

The backend route is protected with `authMiddleware`:

```js
router.get("/profile", authMiddleware, getProfile);
```

`authMiddleware` in `backend/src/middleware/authMiddleware.js`:

1. Reads the `token` cookie from `req.cookies`.
2. Returns `401` with `{ "error": "No token" }` if the cookie is missing.
3. Verifies the JWT using `process.env.JWT_SECRET`.
4. Returns `401` with `{ "error": "Invalid token" }` if verification fails.
5. Stores the decoded token on `req.user`.
6. Allows the request to continue to `getProfile`.

`getProfile` returns:

```json
{
  "message": "Protected data",
  "user": {
    "id": "user-id",
    "iat": 1234567890,
    "exp": 1234567950
  }
}
```

If the frontend receives an error from the profile endpoint, it redirects the user back to the login page.

## Logout Flow

Logout starts from the profile page.

1. The user clicks the logout button.
2. The page calls `logout()` from `front-end/lib/api.ts`.
3. `logout()` sends a `POST` request to:

```txt
/api/auth/logout
```

The backend route is:

```js
router.post("/logout", logoutUser);
```

`logoutUser` clears the `token` cookie and returns:

```json
{
  "message": "Logged out"
}
```

The frontend then redirects the user to the login page.

## Backend Environment Variables

The backend expects these values in `backend/.env`:

```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
JWT_SECRET=your-jwt-secret
```

`SUPABASE_URL` and `SUPABASE_KEY` are used by `backend/src/config/supabase.js`.

`JWT_SECRET` is used to sign and verify JWTs.

## API Summary

| Method | Endpoint | Purpose | Auth required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user | No |
| `POST` | `/api/auth/login` | Verify credentials and set JWT cookie | No |
| `GET` | `/api/auth/profile` | Return protected profile data | Yes |
| `POST` | `/api/auth/logout` | Clear the auth cookie | No |

## Current Implementation Notes

- Registration currently validates required fields only on the frontend.
- The backend should also validate email and password before hashing or inserting.
- The database should enforce unique emails to avoid duplicate accounts.
- The API URL is hard-coded in `front-end/lib/api.ts` as `http://localhost:5000/api/auth`.
- The JWT expires after one minute, so users will be redirected to login when the token expires.
