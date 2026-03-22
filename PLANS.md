# Interactivity Plan

## Goal

Add meaningful web interactivity to the current Bun1 frontend so the site feels more responsive, easier to use, and closer to a polished booking product without breaking the existing Figma-inspired layout.

## Current Baseline

- Animated page fade between routes
- Sliding active indicator in the top menu (done)
- Basic hover and button transitions
- Editable booking cards
- Live booking total on the booking form and hotel detail page

## Phase 1: High-Impact UI Interactions

1. Improve the home page hero interaction in `src/components/Banner.tsx`.
2. Add subtle image reveal and text stagger on first load.
3. Add stronger hover and press states for the main CTA so it feels clickable.
4. Add a light parallax or pointer-based image movement effect on desktop only.
5. Keep all motion optional for users with reduced-motion preferences.

### Acceptance Criteria

- The hero feels interactive without becoming distracting.
- Motion is smooth on desktop and does not hurt mobile usability.
- Reduced-motion users get a static but clean version.

## Phase 2: Hotel Browsing Interactions

1. Make the date toolbar in `src/components/CardPanel.tsx` URL-driven so selected dates stay in the address bar.
2. Add animated card entrance when changing pages in the hotel list.
3. Add hover feedback to hotel cards: image zoom, shadow lift, and stronger detail-button response.
4. Add empty-state feedback when filters return no visible hotels.
5. Add skeleton loading states for hotel list loading instead of plain text.

### Acceptance Criteria

- Date selections survive refresh and sharing via URL.
- Hotel cards feel responsive on hover and tap.
- Loading and empty states look intentional instead of unfinished.

## Phase 3: Hotel Detail and Booking Flow

1. Turn `src/components/HotelDetailClient.tsx` into a more interactive booking preview.
2. Animate total price updates when the stay length changes.
3. Add clearer validation feedback if the selected date range is invalid.
4. Show a lightweight confirmation state before redirecting to the booking form.
5. Improve the booking form in `src/components/BookingForm.tsx` with inline validation per field, not just at submit time.
6. Add success toast or status banner after a booking is stored.

### Acceptance Criteria

- Users can understand price changes immediately.
- Invalid inputs are caught early and explained clearly.
- Booking submission gives visible feedback without ambiguity.

## Phase 4: Booking Management Interactions

1. Improve `src/components/BookingList.tsx` with better edit mode transitions.
2. Add confirmation before delete instead of instant removal.
3. Animate row removal and row update so the list does not jump.
4. Add a clearer save-success state after editing a booking.
5. Add tab-sync or refresh-sync for bookings stored in `localStorage` so changes appear across multiple open tabs.

### Acceptance Criteria

- Delete actions are harder to trigger by accident.
- Editing feels deliberate and visually stable.
- Multiple tabs stay in sync when bookings change.

## Phase 5: Navigation and Global Feedback

1. Add route-level loading states for major pages.
2. Add a reusable toast or notification system for login, booking, edit, and delete actions.
3. Add focus management after route changes and after opening edit mode.
4. Improve keyboard interaction for all major controls.
5. Add consistent disabled, loading, success, and error states across the site.

### Acceptance Criteria

- Users always know whether an action is loading, done, or failed.
- The app remains usable with keyboard-only navigation.
- Major interactive states look consistent across pages.

## Phase 6: Data and Architecture Improvements

1. Move hotel filter state into URL search params where appropriate.
2. Extract shared interactive patterns into reusable components.
3. Replace `localStorage` booking persistence with backend-backed bookings when the API is ready.
4. Add stronger client-side typing and response validation for API data.
5. Remove legacy components that still reflect old data shapes or old UI direction.

### Acceptance Criteria

- State is easier to reason about and share across routes.
- Interactive logic is not duplicated across multiple files.
- The booking flow can evolve from demo persistence to real persistence cleanly.

## Recommended File Targets

- `src/components/Banner.tsx`
- `src/components/CardPanel.tsx`
- `src/components/Card.tsx`
- `src/components/HotelDetailClient.tsx`
- `src/components/BookingForm.tsx`
- `src/components/BookingList.tsx`
- `src/components/TopMenu.tsx`
- `src/app/globals.css`

## Suggested Implementation Order

1. Finish browsing and booking-flow interactivity first because it affects the main user journey.
2. Add feedback and validation improvements second because they directly improve usability.
3. Add delete confirmation, edit transitions, and cross-tab sync next.
4. Move shared patterns into reusable utilities after the behavior is proven.
5. Replace demo persistence with backend persistence last so the UI interaction model is already settled.

## Testing Plan

1. Add component tests for date changes, total-price recalculation, and booking-form validation.
2. Add integration tests for hotel browsing, booking create, booking edit, and booking delete flows.
3. Add admin-flow tests for viewing and managing user bookings.
4. Add manual responsive checks for desktop, tablet, and mobile breakpoints.
5. Add accessibility checks for keyboard flow, focus visibility, and reduced-motion behavior.
