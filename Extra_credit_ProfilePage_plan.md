  # Extra Credit Profile Page Plan                                                                                                                          

  ## Summary                                                                                                                                                
                                                                                                                                                            
  Build a new authenticated /profile page that matches the visual system of the current register page and becomes the signed-in destination of the top-     
  right user icon. Version 1 will let the user view account info and edit name, defaultGuestsAdult, and defaultGuestsChild, while keeping email and role    
  read-only.                                                                                                                                                
                                                                                                                                                            
  ## Step 1: Confirm Current Data Contracts

  - Verify the frontend session already carries _id, name, email, role, token, defaultGuestsAdult, and defaultGuestsChild.                                  
  - Verify GET /api/v1/auth/me returns the same fields.                                                                                                     
  - Confirm whether telephone is needed on the profile page.                                                                                                
  - Confirm whether the frontend uses tel or telephone in shared types and normalize that mismatch only if needed during implementation.                    

  ## Step 2: Add Backend Profile Update API                                                                                                                 

  - Add a self-service authenticated endpoint for updating the current user.
  - Preferred endpoint:                                                                                                                                     
    PATCH /api/v1/auth/me                                                                                                                                   
  - Read the authenticated user from the token/session on the backend.                                                                                      
  - Accept only these editable fields in v1:                                                                                                                
    name                                                                                                                                                    
    defaultGuestsAdult                                                                                                                                      
    defaultGuestsChild                                                                                                                                      
  - Ignore or reject disallowed fields such as:                                                                                                             
    email
    role                                                                                                                                                    
    password                                                                                                                                                
  - Trim name before save.                                                                                                                                  
  - Validate name is not empty.                                                                                                                             
  - Validate defaultGuestsAdult >= 1.                                                                                                                       
  - Validate defaultGuestsChild >= 0.                                                                                                                       
  - Save the updated user.                                                                                                                                  
  - Return a normalized payload with:                                                                                                                       
    _id, name, email, role, defaultGuestsAdult, defaultGuestsChild                                                                                          
  - Keep response shape aligned with existing auth payloads so frontend session updates stay simple.                                                        
                                                                                                                                                            
  ## Step 3: Add Frontend API Helper for Profile Save

  - Create a dedicated frontend helper for updating the current user profile.                                                                               
  - Send the bearer token from the current session.
  - Send only editable fields:                                                                                                                              
    name, defaultGuestsAdult, defaultGuestsChild                                                                                                            
  - Normalize guest values before submit using the same rules already used by booking flows.                                                                
  - Surface backend validation errors cleanly to the UI.                                                                                                    
                                                                                                                                                            
  ## Step 4: Add Protected /profile Route                                                                                                                   
                                                                                                                                                            
  - Create a new src/app/profile/page.tsx.                                                                                                                  
  - Gate the page with getServerSession(authOptions).                                                                                                       
  - If no session exists, redirect to:                                                                                                                      
    /login?callbackUrl=%2Fprofile                                                                                                                           
  - Pass server session data into the page as initial state if useful.                                                                                      
  - Keep the page structure consistent with the existing app routing style used by /mybooking and /admin.                                                   
                                                                                                                                                            
  ## Step 5: Build the Profile Page Layout
                                                                                                                                                            
  - Use the same visual language as src/app/register/page.tsx.                                                                                              
  - Reuse:                                                                                                                                                  
    figma-page                                                                                                                                              
    figma-panel                                                                                                                                             
    figma-input                                                                                                                                             
    figma-button                                                                                                                                            
    feedback message styles                                                                                                                                 
  - Keep the layout mobile-safe and centered like login/register.                                                                                           
  - Structure the page into two zones:                                                                                                                      
    account summary                                                                                                                                         
    editable form                                                                                                                                           
  - Show a clear page title such as PROFILE.
                                                                                                                                                            
  ## Step 6: Decide What the User Sees                                                                                                                      
                                                                                                                                                            
  - Show editable fields:
    name
    defaultGuestsAdult                                                                                                                                      
    defaultGuestsChild                                                                                                                                      
  - Show read-only fields:                                                                                                                                  
    email                                                                                                                                                   
    role                                                                                                                                                    
  - Display saved guest defaults in a way that matches the booking model:                                                                                   
    adults and children as separate numeric inputs                                                                                                          
  - Consider short helper copy near guest defaults:                                                                                                         
    “Used when booking pages open without guest query parameters.”                                                                                          
  - Do not add password-changing UI in v1.                                                                                                                  
  - Do not add email-changing UI in v1.                                                                                                                     
  - Do not add role-changing UI in v1.                                                                                                                      
                                                                                                                                                            
  ## Step 7: Add Form State and Initialization                                                                                                              
                                                                                                                                                            
  - Initialize form state from session user values first so the page renders immediately.
  - Optionally refetch /auth/me on mount to hydrate freshest backend state if the session might be stale.                                                   
  - If refetch is used:                                                                                                                                     
    keep the form stable and avoid jarring resets after the user starts typing.                                                                             
  - Default missing values safely:                                                                                                                          
    name -> empty string only if truly absent                                                                                                               
    defaultGuestsAdult -> 1                                                                                                                                 
    defaultGuestsChild -> 0                                                                                                                                 
                                                                                                                                                            
  ## Step 8: Add Client-Side Validation
                                                                                                                                                            
  - Prevent submission when name is empty after trim.                                                                                                       
  - Prevent submission when defaultGuestsAdult < 1.                                                                                                         
  - Prevent submission when defaultGuestsChild < 0.                                                                                                         
  - Prevent submission when guest values are not numeric.                                                                                                   
  - Keep validation messages specific and field-relevant.                                                                                                   
  - Do not rely only on backend validation; enforce the same rules client-side.                                                                             
                                                                                                                                                            
  ## Step 9: Add Save Interaction                                                                                                                           
                                                                                                                                                            
  - Add a primary submit button such as SAVE PROFILE.
  - Add submitting state:                                                                                                                                   
    disable button while saving                                                                                                                             
    show busy label such as SAVING                                                                                                                          
  - On success:                                                                                                                                             
    show a success message                                                                                                                                  
    update local form baseline so the form is no longer dirty                                                                                               
  - On failure:                                                                                                                                             
    show backend or fallback error message                                                                                                                  
    keep user-entered values intact                                                                                                                         
                                                                                                                                                            
  ## Step 10: Sync NextAuth Session After Save                                                                                                              
                                                                                                                                                            
  - After a successful backend response, call useSession().update(...).                                                                                     
  - Update these session fields immediately:                                                                                                                
    name                                                                                                                                                    
    defaultGuestsAdult
    defaultGuestsChild                                                                                                                                      
  - Keep _id, email, role, and token unchanged unless the backend response explicitly rehydrates them.                                                      
  - Ensure the rest of the app sees the new values without requiring logout/login.                                                                          
  - Confirm booking pages pick up the updated guest defaults immediately after save.                                                                        
                                                                                                                                                            
  ## Step 11: Wire Navigation to the New Page                                                                                                               
                                                                                                                                                            
  - Update TopMenu so the signed-in user icon links to /profile.                                                                                            
  - Keep the BOOKINGS nav text linked to:                                                                                                                   
    /mybooking for standard users                                                                                                                           
    /admin for admins                                                                                                                                       
  - Keep logged-out behavior unchanged:                                                                                                                     
    user icon should still route to login or existing auth entry behavior                                                                                   
  - Do not remove logout from the nav in v1.                                                                                                                
                                                                                                                                                            
  ## Step 12: Handle Admin Users Cleanly                                                                                                                    
                                                                                                                                                            
  - Allow admins to open /profile too.                                                                                                                      
  - Keep their BOOKINGS text link pointing to /admin.                                                                                                       
  - Keep the user icon pointing to /profile.                                                                                                                
  - Show role as read-only text so the admin understands the current account type.                                                                          
                                                                                                                                                            
  ## Step 13: Reuse Existing Guest Default Logic                                                                                                            
                                                                                                                                                            
  - Ensure the profile form uses the same normalization semantics as dateRangeParams.                                                                       
  - Preserve the existing precedence model already implemented in the app:                                                                                  
    URL params override saved defaults                                                                                                                      
    saved defaults override static fallback                                                                                                                 
  - Make profile edits update only the saved default layer, not URL query state.                                                                            
                                                                                                                                                            
  ## Step 14: Add UX Feedback Details
                                                                                                                                                            
  - Show inline or top-level error feedback matching login/register styling.                                                                                
  - Show success feedback after save.                                                                                                                       
  - Optionally show a small explanation that booking changes can also update these defaults automatically.                                                  
  - Avoid overloading the page with extra account-management features in v1.                                                                                
                                                                                                                                                            
  ## Step 15: Testing for Backend API                                                                                                                       
                                                                                                                                                            
  - Authenticated request to PATCH /api/v1/auth/me with valid name and guest defaults should succeed.
  - Response should include updated name, defaultGuestsAdult, defaultGuestsChild.                                                                           
  - Empty name should return validation error.                                                                                                              
  - defaultGuestsAdult = 0 should return validation error.                                                                                                  
  - defaultGuestsChild = -1 should return validation error.                                                                                                 
  - Unauthenticated request should return unauthorized.                                                                                                     
                                                                                                                                                            
  ## Step 16: Testing for Frontend Route Protection                                                                                                         
                                                                                                                                                            
  - Visiting /profile while logged out should redirect to login with callback URL.                                                                          
  - Logging in from that redirect should return the user to /profile.                                                                                       
                                                                                                                                                            
  ## Step 17: Testing for UI Rendering                                                                                                                      
                                                                                                                                                            
  - Profile page should render current session-backed values correctly.                                                                                     
  - Read-only fields should not be editable.                                                                                                                
  - Editable fields should be prefilled and usable on first load.                                                                                           
  - Page should visually align with register/login styling on desktop and mobile.                                                                           
                                                                                                                                                            
  ## Step 18: Testing for Save Behavior                                                                                                                     
                                                                                                                                                            
  - Update only name and save:                                                                                                                              
    backend persists it                                                                                                                                     
    page reflects it                                                                                                                                        
    session reflects it                                                                                                                                     
    refresh preserves it                                                                                                                                    
  - Update only guest defaults and save:                                                                                                                    
    backend persists them                                                                                                                                   
    session reflects them                                                                                                                                   
    booking flows use them when URL guest params are missing                                                                                                
  - Update both name and guest defaults together:                                                                                                           
    all changes persist and reflect immediately                                                                                                             
                                                                                                                                                            
  ## Step 19: Testing for Cross-App Consistency                                                                                                             
                                                                                                                                                            
  - After editing guest defaults on /profile, navigate to venue list without guest query params.
  - Confirm toolbar defaults match saved profile values.                                                                                                    
  - Open hotel detail without guest query params.                                                                                                           
  - Confirm guest inputs match saved profile values.                                                                                                        
  - Go to booking page without guest query params.                                                                                                          
  - Confirm redirect/build logic uses saved profile values.                                                                                                 
  - Confirm explicit URL guest params still override profile defaults.                                                                                      
                                                                                                                                                            
  ## Step 20: Keep V1 Scope Tight                                                                                                                           
                                                                                                                                                            
  - Do not implement password change.                                                                                                                       
  - Do not implement email change.                                                                                                                          
  - Do not implement phone editing unless specifically added later.                                                                                         
  - Do not implement avatar upload.                                                                                                                         
  - Do not implement account deletion.                                                                                                                      
  - Do not implement a multi-tab account hub unless requested later.                                                                                        
                                                                                                                                                            
  ## Public API / Interface Changes                                                                                                                         
                                                                                                                                                            
  - New backend endpoint:                                                                                                                                   
    PATCH /api/v1/auth/me                                                                                                                                   
  - New frontend route:                                                                                                                                     
  - TopMenu signed-in user icon destination changes from bookings/login behavior to /profile

  ## Acceptance Criteria
  - Signed-in users can open /profile from the user icon.
  - The page matches the register-page design language.
  - Users can edit name, defaultGuestsAdult, and defaultGuestsChild.
  - email and role are visible but not editable.
  - Saving persists data server-side.
  - Saving updates the active session client-side.
  - Booking-related defaults across the app use the new saved guest values immediately.
  - Logged-out users are redirected to login and returned to /profile afterward.

  ## Assumptions

  - Backend does not yet expose a documented self-update endpoint, so this feature includes adding one.
  - defaultGuestsAdult and defaultGuestsChild are already part of the backend user model and auth payloads.
  - V1 profile editing is limited to name and guest defaults.
  - The existing register/login visual system is the desired design reference for the profile page.

To keep moving on the profile feature, paste these backend files next so I can lock the save flow instead of guessing it:

- `controllers/Auth.js`
- `routes/auth.js`
- `models/User.js`
- `middleware/auth.js`

If there’s already any user-update controller outside auth, include that too. Once I have those, I’ll turn the profile page into a decision-complete implementation plan.