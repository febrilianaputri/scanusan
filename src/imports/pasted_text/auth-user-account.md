==================================================
AUTHENTICATION & USER ACCOUNT
==================================================

IMPORTANT:

Add complete authentication and user account interfaces to the Inventory Management System.

The authentication system must visually match the main dashboard design and support both:

LIGHT MODE
and
DARK MODE

Use the same earth-tone design system, typography, spacing, buttons, inputs, status colors, and visual language as the main application.

==================================================
PAGE 13 — LOGIN
==================================================

Create a modern professional login page.

Desktop layout:
Use a split-screen layout.

LEFT SIDE:
Brand/product introduction.

Show:
"KAMI Inventory"

"Smart Inventory Management"

Short description:

"Manage inventory, track stock movement, and connect your IoT barcode scanner in real time."

Include a subtle visual illustration related to:
- Barcode
- Inventory
- IoT scanner
- Warehouse

Keep the illustration minimal and professional.

RIGHT SIDE:
Login form.

Title:
"Welcome Back"

Subtitle:
"Sign in to your inventory dashboard"

Fields:

Email Address
[ Enter your email ]

Password
[ Enter your password ] 👁

Options:

[ ] Remember me

Forgot Password?

Primary button:
"Sign In"

Divider:
"OR"

Alternative button:
"Continue with Google"

Bottom:

"Don't have an account?"
"Create Account"

Include validation states:

Default
Focused
Invalid Email
Wrong Password
Loading
Login Success

Error message example:

"Invalid email or password."

Loading state:

"Signing in..."

Success:

"Login successful"

==================================================
LOGIN — DARK MODE
==================================================

Create a complete dark mode version.

Dark mode:
- Dark background
- Dark green/earth-tone surfaces
- Light text
- Olive green primary button
- Subtle borders
- Comfortable contrast

The login layout must remain identical between themes.

==================================================
PAGE 14 — REGISTER
==================================================

Create a professional registration page matching the Login page.

Title:

"Create Account"

Subtitle:

"Create your account to manage your inventory."

Fields:

Full Name
[ Enter your full name ]

Email Address
[ Enter your email ]

Password
[ Create a password ]

Confirm Password
[ Confirm your password ]

Role:
Do not allow normal users to freely select Admin.
If role selection is required, only show appropriate roles based on system permissions.

Checkbox:

[ ] I agree to the Terms and Privacy Policy

Primary button:

"Create Account"

Bottom:

"Already have an account?"
"Sign In"

Create validation states:

- Empty field
- Invalid email
- Weak password
- Password mismatch
- Email already registered
- Successful registration
- Loading

Success state:

"Account created successfully"

"Redirecting to dashboard..."

==================================================
PAGE 15 — FORGOT PASSWORD
==================================================

Create a password recovery page.

Title:

"Forgot Password?"

Subtitle:

"Enter your email address and we'll send you a password reset link."

Field:

Email Address

Primary button:

"Send Reset Link"

Secondary:
"Back to Sign In"

Success state:

"Reset link sent"

"Check your email for further instructions."

==================================================
PAGE 16 — MY PROFILE
==================================================

Create a user profile page.

Header:

"My Profile"

Subtitle:

"Manage your personal information."

Profile section:

Large avatar

Admin

admin@kami-inventory.com

Role:
Administrator

Status:
🟢 Active

Personal Information:

Full Name
Email
Phone Number
Position
Department

Button:

"Edit Profile"

Activity section:

"Recent Activity"

Examples:

10:32
Stock Out — CAT6 Cable

09:45
Updated product — RJ45 Connector

Yesterday
Logged in

==================================================
PAGE 17 — ACCOUNT SETTINGS
==================================================

Create an account settings page.

Sections:

PROFILE

Profile photo
Full Name
Email
Phone
Position

SECURITY

Change Password
Two-Factor Authentication
Active Sessions

NOTIFICATIONS

Email Notifications
Low Stock Alerts
Scanner Offline Alerts
Transaction Notifications

APPEARANCE

Theme

☀ Light
🌙 Dark
◐ System

LANGUAGE

English
Bahasa Indonesia

DANGER ZONE

Delete Account

Use a visually distinct danger area for destructive actions.

==================================================
PROFILE DROPDOWN
==================================================

Create a reusable profile dropdown component for the top navigation.

When clicking:

Admin ▼

Show:

┌──────────────────────────────┐
│ 👤 Admin                     │
│ admin@kami-inventory.com     │
├──────────────────────────────┤
│ 👤 My Profile                │
│ ⚙ Account Settings           │
│ 🔔 Notifications             │
├──────────────────────────────┤
│ 🚪 Logout                    │
└──────────────────────────────┘

Use the same dropdown in Light and Dark Mode.

==================================================
LOGOUT CONFIRMATION
==================================================

Create a logout confirmation modal.

Title:

"Sign out?"

Message:

"Are you sure you want to sign out of your account?"

Buttons:

Cancel
Sign Out

After confirmation:

Redirect to Login page.

==================================================
AUTHENTICATION STATES
==================================================

Create reusable states for authentication:

LOGIN:
- Default
- Focus
- Error
- Loading
- Success

REGISTER:
- Default
- Focus
- Validation Error
- Loading
- Success

PASSWORD:
- Hidden
- Visible
- Weak
- Medium
- Strong
- Error

PROFILE:
- View
- Edit
- Saving
- Saved
- Error

==================================================
AUTHENTICATION PROTOTYPE FLOW
==================================================

Create clickable prototype:

LOGIN
↓
Enter credentials
↓
Sign In
↓
Dashboard

LOGIN
↓
Create Account
↓
Register
↓
Success
↓
Dashboard

LOGIN
↓
Forgot Password
↓
Enter Email
↓
Reset Link Sent
↓
Login

DASHBOARD
↓
Profile Dropdown
↓
My Profile

DASHBOARD
↓
Profile Dropdown
↓
Account Settings

DASHBOARD
↓
Profile Dropdown
↓
Logout
↓
Confirmation Modal
↓
Login

==================================================
ROLE-BASED USER EXPERIENCE
==================================================

The interface should support two main roles:

ADMIN

Admin can access:
- Dashboard
- Inventory
- Products
- Stock In
- Stock Out
- Transactions
- IoT Scanner
- Reports
- Suppliers
- Users
- Settings

OPERATOR

Operator can access:
- Dashboard
- Inventory
- Stock In
- Stock Out
- Transactions
- IoT Scanner
- Scan Activity

Operator should NOT have access to:
- User Management
- System-level Settings

Hide restricted navigation items rather than simply disabling them.

==================================================
AUTHENTICATION DESIGN SYSTEM
==================================================

Create reusable components:

Auth Input
Auth Password Input
Auth Button
Social Login Button
Checkbox
Remember Me
Forgot Password Link
Auth Error Message
Auth Success Message
Password Strength Indicator
Profile Avatar
Profile Dropdown
User Role Badge
User Status Badge
Confirmation Modal

Every authentication component must have:

Light Mode
Dark Mode

==================================================
FINAL AUTHENTICATION EXPERIENCE
==================================================

The authentication experience must feel like the same product as the main Inventory Management System.

Do not make Login/Register look like a completely separate template.

Maintain:
- Same typography
- Same earth-tone brand
- Same green primary color
- Same button style
- Same border radius
- Same spacing
- Same Light/Dark theme
- Same professional SaaS aesthetic

The complete user journey should feel cohesive:

LOGIN
↓
DASHBOARD
↓
INVENTORY
↓
TRANSACTION
↓
IOT SCANNER
↓
REPORTS
↓
PROFILE / SETTINGS
↓
LOGOUT