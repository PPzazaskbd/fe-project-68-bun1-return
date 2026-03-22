# Implementation Order

This file sorts interactivity subtasks from easiest to implement to hardest, based on current code structure, scope of change, and dependency risk.

## 1. Stronger Hover and Press States

- Add stronger hover and press states for the main CTA in `src/components/Banner.tsx`.
- Add hover feedback to hotel cards in `src/components/Card.tsx`.
- Add clearer disabled, loading, success, and error visual states across buttons and form actions.

Why first:
- Mostly CSS and small component-state changes.
- Low risk and fast visible payoff.

## 2. Better Empty, Loading, and Status Feedback

- Add empty-state feedback when hotel filtering returns no results in `src/components/CardPanel.tsx`.
- Add skeleton loading states for hotel list loading instead of plain text.
- Add a success toast or status banner after a booking is stored in `src/components/BookingForm.tsx`.
- Add a clearer save-success state after editing a booking in `src/components/BookingList.tsx`.

Why here:
- Still relatively self-contained.
- Improves usability quickly without changing data flow much.

## 3. Inline Validation Improvements

- Add clearer validation feedback if the selected date range is invalid in `src/components/HotelDetailClient.tsx`.
- Improve `src/components/BookingForm.tsx` with inline validation per field instead of submit-only validation.

Why here:
- Small-to-medium logic changes.
- Directly improves the booking flow with limited architectural impact.

## 4. Route and Focus Feedback

- Add route-level loading states for major pages.
- Add focus management after route changes and after opening edit mode.
- Improve keyboard interaction for all major controls.

Why here:
- Mostly UX polish and accessibility work.
- Medium effort, but still does not require major state redesign.

## 5. Booking List Safety and Smoothness

- Add confirmation before delete instead of instant removal in `src/components/BookingList.tsx`.
- Improve edit mode transitions in `src/components/BookingList.tsx`.
- Animate row removal and row update so the list does not jump.

Why here:
- Requires coordinated state and UI updates.
- More moving parts than simple styling or validation work.

## 6. Hero Motion and Intro Animation

- Add subtle image reveal and text stagger on first load in `src/components/Banner.tsx`.
- Add light parallax or pointer-based image movement on desktop only.
- Keep motion optional for reduced-motion users.

Why here:
- More interaction design work than basic hover states.
- Needs motion restraint and accessibility handling.

## 7. Booking Preview Interaction Enhancements

- Turn `src/components/HotelDetailClient.tsx` into a more interactive booking preview.
- Animate total price updates when the stay length changes.
- Show a lightweight confirmation state before redirecting to the booking form.

Why here:
- Touches both pricing logic and transition behavior.
- More complex than basic validation because it affects user flow.

## 8. URL-Driven Browsing State

- Make the date toolbar in `src/components/CardPanel.tsx` URL-driven so selected dates stay in the address bar.
- Move hotel filter state into URL search params where appropriate.

Why here:
- Requires synchronization between UI state and routing.
- Affects refresh behavior, shareability, and navigation history.

## 9. Cross-Tab and Persistence Behavior

- Add tab-sync or refresh-sync for bookings stored in `localStorage`.

Why here:
- Introduces browser storage event handling.
- Easy to get wrong if done before the booking interaction model settles.

## 10. Shared Interactivity Abstractions

- Extract shared interactive patterns into reusable components or utilities.

Why here:
- Best done after the main behaviors are already proven.
- Premature abstraction would slow earlier implementation.

## 11. Stronger Client-Side Data Validation

- Add stronger client-side typing and response validation for API data.
- Remove legacy components that still reflect old data shapes or old UI direction.

Why here:
- Cross-cutting cleanup work.
- Important, but not the fastest route to visible interactivity.

## 12. Backend-Backed Booking Persistence

- Replace `localStorage` booking persistence with real backend-backed bookings when the API is ready.

Why last:
- Highest dependency risk.
- Requires API availability, error handling, and possibly auth/data-model changes.

## Recommended Build Sequence

1. Finish quick UI-state wins first: hover states, empty states, success states.
2. Improve form validation and user feedback next.
3. Add deletion safety and edit/list transitions.
4. Add hero motion and richer booking-preview behavior.
5. Move browsing state into the URL.
6. Add cross-tab sync if localStorage remains in use.
7. Refactor shared patterns after behavior is stable.
8. Replace localStorage with backend persistence last.
