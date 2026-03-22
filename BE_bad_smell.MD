# Backend/API Bad Smells

Scope:
- Backend source code is not present in this repository.
- The findings below are inferred from `BE_api_docs.MD` and the current frontend integration code under `src/`.
- Where a point is based on frontend workarounds, it is marked as an integration smell rather than a proven server-side implementation bug.

## 1. Logout is modeled as `GET` even though it changes auth state

Severity: High

Evidence:
- `BE_api_docs.MD:10` documents `GET /api/v1/auth/logout`.

Why this smells:
- `GET` should be safe and non-mutating.
- A logout route changes session/auth state, so using `GET` invites accidental logout through browser prefetching, crawlers, caches, link previews, or CSRF-style navigation.

Impact:
- Fragile session handling.
- Harder caching behavior.
- Surprising client behavior in browsers and proxies.

Recommendation:
- Change this to `POST /api/v1/auth/logout` or `DELETE /api/v1/sessions/current`.
- Document whether logout is token revocation, cookie clearing, or both.

## 2. Auth response and error envelopes are not stable enough for one clean client

Severity: High

Evidence:

- `src/app/api/auth/[...nextauth]/authOptions.ts:27-33` accepts login data from either top-level fields or nested `data` fields.
- `src/libs/authOptions.ts:20-33` logs in first, then calls `/auth/me` to rebuild the user profile.
- `src/app/register/page.tsx:28-29` has to check both `data.message` and `data.msg`.

Why this smells:

- A stable API should not force clients to guess whether user data is at `user.name` or `user.data.name`, or whether errors use `message` vs `msg`.
- The extra `/auth/me` call after login is a strong sign that `/auth/login` is not returning a complete, normalized auth payload.

Impact:

- Duplicate parsing logic.
- More auth round trips than necessary.
- Brittle client code and higher regression risk.

Recommendation:

- Standardize one response envelope across auth endpoints.
- Return a normalized user object and token directly from `/auth/login`.
- Standardize one error field, for example `error.message`.

## 3. Role/authorization contract is under-specified, so clients are inventing their own admin rules

Severity: High

Evidence:

- `BE_api_docs.MD:11` exposes an admin-only role promotion endpoint, but the doc does not say where `role` is guaranteed to appear in auth responses.
- `src/app/api/auth/[...nextauth]/authOptions.ts:17-22` contains a hardcoded admin login shortcut.
- `src/libs/authOptions.ts:27` falls back to `email === "admin@example.com"` to decide admin role.
- `src/components/BookingList.tsx:43-46` also treats `admin@example.com` as admin.

Why this smells:

- Even if the hardcoded admin path is a frontend mistake, teams usually add these shortcuts when the backend role contract is weak, undocumented, or inconvenient to trust.
- Authorization should come from server-issued claims, not email string checks in multiple clients.

Impact:

- Privilege logic drifts across clients.
- Higher risk of accidental over-permissioning.
- Admin behavior becomes environment-specific and difficult to audit.

Recommendation:

- Make `role` a guaranteed part of the authenticated user payload.
- Document the exact auth claims returned by `/auth/login` and `/auth/me`.
- Remove all email-based or hardcoded admin inference from clients.

## 4. Booking ownership rules are ambiguous, which is an IDOR risk

Severity: High

Evidence:
- `BE_api_docs.MD:25-29` marks booking reads and mutations as only `Yes`, without saying whether they are owner-only, admin-only, or both.
- `BE_api_docs.MD:30` is explicitly marked `Admin`, which makes the earlier booking rows look underspecified rather than intentionally broad.

Why this smells:
- `GET /bookings/:id`, `PUT /bookings/:id`, and `DELETE /bookings/:id` are the endpoints most likely to leak or modify other users' records if ownership checks are weak.
- The current doc does not say what happens when a logged-in user accesses another user's booking ID.

Impact:
- Real risk of insecure direct object reference if backend authorization is incomplete.
- Frontend cannot reliably predict `403` vs `404` behavior.

Recommendation:
- Document and enforce ownership rules for every booking endpoint.
- State whether admins can access all bookings and whether normal users are restricted to their own.
- Document expected `401`, `403`, and `404` responses.

## 5. The booking contract is too thin to integrate safely

Severity: Medium

Evidence:
- `BE_api_docs.MD:27-29` lists booking CRUD routes, but no request body schema, no response shape, and no example payloads.
- `src/interface.ts:1-9` shows the current booking model only stores hotel name, dates, guests, and user email.
- `src/components/BookingForm.tsx:105-117` creates bookings only in local state/local storage.
- `src/components/BookingList.tsx:55-61` and `src/components/BookingList.tsx:85-145` read, update, and delete bookings only from local storage.
- `src/libs/bookingStorage.ts:5-17` is the actual persistence layer today.

Why this smells:
- The API says bookings exist, but the contract is not self-describing enough for the frontend to use as the source of truth.
- The biggest gap is identity and relation modeling: the doc does not show the booking payload, returned ID format, or how hotel references are represented beyond `:hotelId` in the URL.

Impact:
- The app still behaves like a local-only booking demo instead of a real client of the backend.
- Higher integration churn once real booking API wiring starts.

Recommendation:
- Publish request/response examples for create, list, update, and delete booking flows.
- Define the booking ID, hotel reference field, user ownership field, and validation errors explicitly.
- Keep one canonical booking schema across all booking endpoints.

## 6. Hotel search is advertised but not actually documented

Severity: Medium

Evidence:
- `BE_api_docs.MD:16` says `GET /api/v1/hotels` supports search.
- `src/components/CardPanel.tsx:30-39` performs search entirely on the client after loading all hotels.

Why this smells:
- Saying "with search" without query parameter documentation is not enough for clients to implement server-side filtering.
- There is no documented `q`, `province`, `region`, `page`, `limit`, `sort`, or availability filter contract.

Impact:
- Clients fetch everything and filter locally.
- Poor scalability once the hotel list grows.
- Hard to add real pagination, indexing, or availability-aware search.

Recommendation:
- Document every supported query parameter on `GET /hotels`.
- Define response behavior for pagination, sorting, and empty results.
- If search is not actually implemented yet, remove the claim from the doc until it is.
