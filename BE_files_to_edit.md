# Backend Edits for Saved Guest Defaults

This backend needs more than `models/User.js`.

Required backend files:
- `models/User.js`
- `models/booking.js`
- `controllers/Auth.js`
- `controllers/bookings.js`

No route changes are required in:
- `routes/auth.js`
- `routes/bookings.js`

The goal is:
- new users default to `1` adult and `0` children
- every successful booking updates the user's saved default guest counts
- `GET /api/v1/auth/me` returns those saved default guest counts to the frontend

## 1. `models/User.js`

Add these two fields after `role` and before `currentToken`:

```js
  defaultGuestsAdult: {
    type: Number,
    default: 1,
    min: [1, 'At least one adult guest is required']
  },

  defaultGuestsChild: {
    type: Number,
    default: 0,
    min: [0, 'Child guest count cannot be negative']
  },
```

## 2. `models/booking.js`

This schema currently does not contain `guestsAdult` or `guestsChild`, but the frontend already sends them. Add both fields after `roomNumber`:

```js
  guestsAdult: {
    type: Number,
    required: [true, 'Please add adult guest count'],
    default: 1,
    min: [1, 'At least one adult guest is required']
  },
  guestsChild: {
    type: Number,
    required: [true, 'Please add child guest count'],
    default: 0,
    min: [0, 'Child guest count cannot be negative']
  },
```

## 3. `controllers/Auth.js`

### 3.1 Login response

In the `login` response JSON, extend the `data` object:

```js
      return res
        .status(200)
        .cookie("token", token, options)
        .json({
          success: true,
          token,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            telephone: user.telephone,
            role: user.role,
            defaultGuestsAdult: user.defaultGuestsAdult,
            defaultGuestsChild: user.defaultGuestsChild
          }
        });
```

### 3.2 `getMe`

Return the saved guest defaults from `/auth/me`:

```js
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      defaultGuestsAdult: user.defaultGuestsAdult,
      defaultGuestsChild: user.defaultGuestsChild,
      createdAt: user.createdAt
    }
  });
};
```

### 3.3 `sendTokenResponse`

Also include the guest-default fields there for consistency:

```js
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        defaultGuestsAdult: user.defaultGuestsAdult,
        defaultGuestsChild: user.defaultGuestsChild
      }
    });
};
```

## 4. `controllers/bookings.js`

### 4.1 `createBooking`

Normalize and validate guest counts before creating the booking.

Add this block after `req.body.user = req.user.id;`:

```js
    const guestsAdult = Number(req.body.guestsAdult ?? 1);
    const guestsChild = Number(req.body.guestsChild ?? 0);

    if (!Number.isFinite(guestsAdult) || guestsAdult < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one adult guest is required'
      });
    }

    if (!Number.isFinite(guestsChild) || guestsChild < 0) {
      return res.status(400).json({
        success: false,
        message: 'Child guest count cannot be negative'
      });
    }

    req.body.guestsAdult = guestsAdult;
    req.body.guestsChild = guestsChild;
```

Then replace the current user/email block after `const booking = await Booking.create(req.body);` with this:

```js
    const user = await User.findById(req.user.id);
    if (user) {
      user.defaultGuestsAdult = req.body.guestsAdult;
      user.defaultGuestsChild = req.body.guestsChild;
      await user.save({ validateBeforeSave: false });

      await sendEmail(
        user.email,
        'Booking Confirmed - Your Reservation is Secure',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><div style="background-color: #27ae60; color: white; padding: 20px; text-align: center;"><h1 style="margin: 0;">Booking Confirmed</h1></div><div style="padding: 30px; background-color: #f8f9fa; border: 1px solid #ddd;"><p style="font-size: 16px; color: #333;">Dear <strong>${user.name}</strong>,</p><p style="font-size: 14px; line-height: 1.6; color: #555;">Your reservation has been successfully confirmed! We're delighted to welcome you.</p><div style="background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0;"><h3 style="margin-top: 0; color: #2c3e50;">Reservation Details</h3><table style="width: 100%; font-size: 14px; color: #333;"><tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 10px 0;"><strong>Hotel:</strong></td><td style="padding: 10px 0;">${hotel.name}</td></tr><tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 10px 0;"><strong>Address:</strong></td><td style="padding: 10px 0;">${hotel.address}</td></tr><tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 10px 0;"><strong>Check-in Date:</strong></td><td style="padding: 10px 0;">${new Date(req.body.startDate).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</td></tr><tr><td style="padding: 10px 0;"><strong>Number of Nights:</strong></td><td style="padding: 10px 0;">${req.body.nights} night${req.body.nights > 1 ? 's' : ''}</td></tr><tr><td style="padding: 10px 0;"><strong>Guests:</strong></td><td style="padding: 10px 0;">${req.body.guestsAdult} adult(s), ${req.body.guestsChild} child(ren)</td></tr></table></div><p style="font-size: 14px; line-height: 1.6; color: #555;">A confirmation email with check-in instructions will be sent 24 hours before your arrival.</p><p style="text-align: center; margin: 25px 0;"><a href="https://yourapp.com/bookings" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Booking</a></p><p style="font-size: 13px; line-height: 1.6; color: #7f8c8d;">Thank you for choosing Hotel Booking. We look forward to providing you with an exceptional stay!</p></div><div style="background-color: #ecf0f1; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d;"><p style="margin: 5px 0;">Hotel Booking 2026 | All Rights Reserved</p><p style="margin: 5px 0;">Need help? <a href="mailto:support@hotelbooking.com" style="color: #3498db; text-decoration: none;">Contact Support</a></p></div></div>`
      );
    }
```

### 4.2 `updateBooking`

Resolve the next guest counts, validate them, and write them back into `req.body`.

Add this block after the authorization check and before `const hotelId = ...`:

```js
    const nextGuestsAdult =
      req.body.guestsAdult != null ? Number(req.body.guestsAdult) : booking.guestsAdult;
    const nextGuestsChild =
      req.body.guestsChild != null ? Number(req.body.guestsChild) : booking.guestsChild;

    if (!Number.isFinite(nextGuestsAdult) || nextGuestsAdult < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least one adult guest is required'
      });
    }

    if (!Number.isFinite(nextGuestsChild) || nextGuestsChild < 0) {
      return res.status(400).json({
        success: false,
        message: 'Child guest count cannot be negative'
      });
    }

    req.body.guestsAdult = nextGuestsAdult;
    req.body.guestsChild = nextGuestsChild;
```

Then replace the current post-update user/email block with this:

```js
    const updatedBooking = await Booking.findById(req.params.id).populate('hotel');
    const bookingOwner = await User.findById(booking.user);

    if (bookingOwner && updatedBooking) {
      bookingOwner.defaultGuestsAdult = updatedBooking.guestsAdult;
      bookingOwner.defaultGuestsChild = updatedBooking.guestsChild;
      await bookingOwner.save({ validateBeforeSave: false });

      await sendEmail(
        bookingOwner.email,
        'Booking Updated Successfully',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><div style="background-color: #3498db; color: white; padding: 20px; text-align: center;"><h1 style="margin: 0;">Booking Updated</h1></div><div style="padding: 30px; background-color: #f8f9fa; border: 1px solid #ddd;"><p style="font-size: 16px; color: #333;">Hi <strong>${bookingOwner.name}</strong>,</p><p style="font-size: 14px; line-height: 1.6; color: #555;">Your reservation${updatedBooking.hotel ? ' at <strong>' + updatedBooking.hotel.name + '</strong>' : ''} has been successfully updated.</p><div style="background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0;"><h3 style="margin-top: 0; color: #2c3e50;">Updated Details</h3><table style="width: 100%; font-size: 14px; color: #333;"><tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 10px 0;"><strong>Check-in Date:</strong></td><td style="padding: 10px 0;">${new Date(updatedBooking.startDate).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</td></tr><tr style="border-bottom: 1px solid #bdc3c7;"><td style="padding: 10px 0;"><strong>Number of Nights:</strong></td><td style="padding: 10px 0;">${updatedBooking.nights} night${updatedBooking.nights > 1 ? 's' : ''}</td></tr><tr><td style="padding: 10px 0;"><strong>Guests:</strong></td><td style="padding: 10px 0;">${updatedBooking.guestsAdult} adult(s), ${updatedBooking.guestsChild} child(ren)</td></tr></table></div><p style="font-size: 13px; line-height: 1.6; color: #7f8c8d;">If you did not make this change or have any questions, please contact our support team immediately.</p><p style="text-align: center; margin: 25px 0;"><a href="https://yourapp.com/bookings" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Booking</a></p></div><div style="background-color: #ecf0f1; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d;"><p style="margin: 5px 0;">Hotel Booking 2026 | All Rights Reserved</p><p style="margin: 5px 0;">Questions? <a href="mailto:support@hotelbooking.com" style="color: #3498db; text-decoration: none;">Contact Support</a></p></div></div>`
      );
    }
```

## 5. Route files

No backend route additions are needed.

Existing routes already cover the behavior:
- `GET /api/v1/auth/me`
- `POST /api/v1/hotels/:hotelId/bookings`
- `PUT /api/v1/bookings/:id`

## 6. Notes

- If you only want the saved defaults to change on booking creation, skip the `updateBooking` part.
- If you want the frontend session to pick these values up immediately after login on every device, `getMe` must include `defaultGuestsAdult` and `defaultGuestsChild`.
