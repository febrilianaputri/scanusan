Design a complete modern web-based Inventory Management System integrated with an IoT Barcode Scanner.

IMPORTANT:
Create BOTH LIGHT MODE and DARK MODE as part of the same design system from the beginning.

Do not treat dark mode as an afterthought.
Every page, component, card, table, chart, form, modal, sidebar, navigation, scanner status, alert, and IoT component must have both Light Mode and Dark Mode variants.

The two themes must have identical layouts and functionality, while adapting colors, contrast, borders, surfaces, and text appropriately.

==================================================
PRODUCT CONCEPT
==================================================

This is an Inventory Management System integrated with an IoT Barcode Scanner.

The website is the central inventory management platform for:
- Product management
- Inventory monitoring
- Stock In
- Stock Out
- Barcode management
- Transaction history
- IoT scanner monitoring
- Real-time scan activity
- Inventory reports
- Supplier management
- User management

The physical IoT barcode scanner communicates with the website through a backend/API.

CORE FLOW:

Physical Barcode Scan
↓
IoT Barcode Scanner
↓
Backend / API
↓
Inventory Validation
↓
Stock Update
↓
Transaction Record
↓
Real-Time Dashboard Update

The interface must clearly communicate that this is an actual IoT-connected inventory system rather than a normal CRUD website.

==================================================
DESIGN DIRECTION
==================================================

Visual style:
- Modern professional SaaS dashboard
- Clean
- Minimal
- Functional
- Professional
- Data-driven
- IoT-focused
- Warehouse and logistics inspired
- Earth-tone visual identity
- Strong information hierarchy
- Comfortable for long monitoring sessions

Avoid:
- Cyberpunk
- Neon colors
- Excessive gradients
- Excessive shadows
- Excessive glassmorphism
- Cartoon-style UI
- Overly decorative elements
- Excessively rounded components

Use:
- Subtle rounded corners
- Clear borders
- Consistent spacing
- Strong typography
- Clear status indicators
- Practical dashboard layouts

==================================================
THEME SYSTEM
==================================================

Create a complete theme system with:

LIGHT MODE
and
DARK MODE

Both themes must use the same design tokens and component structure.

----------------------------
LIGHT MODE
----------------------------

Primary:
Olive Green #5F8D4E
Sage Green #A4BE7B
Dark Green #3F6335

Earth:
Warm Brown #8D6E63
Gold #D4A373

Background:
#F8F5F0

Surface / Card:
#FFFFFF

Secondary Surface:
#EFEAE4

Primary Text:
#3E2C23

Secondary Text:
#6B5B53

Muted Text:
#9A8F87

Border:
#DDD6CE

----------------------------
DARK MODE
----------------------------

Background:
#171815

Sidebar:
#20231D

Surface / Card:
#252923

Secondary Surface:
#2D3029

Primary Text:
#F5F5F0

Secondary Text:
#C8C9C2

Muted Text:
#92958C

Border:
#41453C

Primary Green:
#7FA66A

Secondary Green:
#A4BE7B

Earth Brown:
#A98467

Gold:
#D4A373

IMPORTANT DARK MODE RULES:
- Do not use pure black backgrounds
- Do not use pure white cards
- Maintain comfortable contrast
- Use dark green/earth surfaces
- Use subtle borders to separate cards
- Use slightly brighter text for important information
- Charts must remain readable
- Status colors must remain distinguishable
- Green should remain the main brand color

==================================================
STATUS COLORS
==================================================

Success:
#6AA84F

Warning:
#E9B44C

Danger:
#D9534F

Info:
#5DADE2

Use these consistently for:
- Scanner status
- Inventory status
- Alerts
- Transaction status
- Notifications
- Charts

In dark mode, adjust brightness if necessary to preserve accessibility and readability.

==================================================
TYPOGRAPHY
==================================================

Use:

Poppins
for:
- Page titles
- Section headings
- Dashboard numbers
- Important labels

Inter
for:
- Body text
- Tables
- Forms
- Data
- Navigation
- Small labels

Typography:
H1: 32px Bold
H2: 24px SemiBold
H3: 18px SemiBold
Body: 14–16px
Caption: 12px
Dashboard statistics: 28–32px Bold

==================================================
GLOBAL LAYOUT
==================================================

Desktop frame:
1440px width

Sidebar:
240px

Topbar:
70px

Main content:
32px padding

Spacing system:
8px base spacing

Border radius:
12–16px

Create the entire application using a consistent dashboard shell.

==================================================
SIDEBAR
==================================================

Create a fixed left sidebar.

LIGHT MODE:
- Warm light background
- Dark text
- Olive green active navigation

DARK MODE:
- Dark forest/green-gray sidebar
- Light text
- Olive green active navigation
- Subtle borders

Sidebar:

Logo:
"KAMI Inventory"

Subtitle:
"Inventory Management"

Navigation:

MAIN
Dashboard
Inventory
Transactions

MONITORING
IoT Scanner
Scan Activity
Reports

MANAGEMENT
Suppliers
Users
Settings

Bottom:
Scanner Status

🟢 Scanner-01
Online

Make the active menu clearly visible in both themes.

==================================================
TOPBAR
==================================================

Include:

- Page title
- Global search
- Notification icon
- Theme toggle
- User avatar
- Admin
- Dropdown

IMPORTANT:
Add a visible Light/Dark Mode toggle.

Theme toggle states:

☀ Light
🌙 Dark

The toggle must be designed as a reusable component.

==================================================
PAGE 1 — DASHBOARD
==================================================

Header:

Dashboard

"Overview of your inventory and scanner activity"

Statistic cards:

Total Items
1,284 items

Stock In Today
+120

Stock Out Today
-85

Low Stock
12 items

Out of Stock
4 items

Each card:
- Icon
- Label
- Large number
- Trend indicator
- Optional comparison to previous period

Create both Light and Dark variants.

Main section:

STOCK MOVEMENT

Line chart:
- Stock In
- Stock Out

Time filters:
Today
7 Days
30 Days

Chart must remain readable in both themes.

Scanner Status card:

Scanner-01
🟢 Online

WiFi:
Excellent

Battery:
72%

Last Scan:
10:32:21

Total Scans:
248

Below:

RECENT TRANSACTIONS

Columns:
Time
Product
Barcode
Type
Quantity
Scanner
User

Beside it:

LOW STOCK ALERTS

Example:
RJ45 Connector
8 pcs remaining

CAT6 Cable
6 pcs remaining

USB Adapter
4 pcs remaining

==================================================
LIVE SCAN CENTER
==================================================

This is one of the most important components.

Create a prominent real-time IoT component.

Default state:

LIVE SCAN

🟢 Scanner Online

Waiting for barcode scan...

Scanner-01

Scanning state:

SCANNING...

Success state:

✓ Barcode Detected

899001234567

CAT6 UTP Cable

STOCK OUT

-5 pcs

Stock:
35 → 30

Scanner-01

Error state:

⚠ Unknown Barcode

899001234567

Product not registered

Create:
- Waiting
- Scanning
- Success
- Error

variants.

Make the component visually distinct in both themes.

==================================================
PAGE 2 — INVENTORY
==================================================

Header:

Inventory

"Manage products and current stock levels"

Primary button:

+ Add Product

Toolbar:
- Search
- Category filter
- Stock status
- Location
- Sort

Inventory table:

Product
Barcode
Category
Current Stock
Unit
Minimum Stock
Status
Location
Supplier
Actions

Example:

CAT6 UTP Cable
899001...
Networking
35 pcs
10
Good

RJ45 Connector
899002...
Networking
8 pcs
10
Low Stock

HDMI Cable
899003...
Accessories
0 pcs
5
Out of Stock

Create both Light and Dark table variants.

Dark mode table:
- Dark surface
- Subtle borders
- High contrast text
- Clear row hover
- Green active states

==================================================
PAGE 3 — ADD / EDIT PRODUCT
==================================================

Create a modal or side drawer.

Title:
Add New Product

Fields:
Product Name
Barcode
Category
Unit
Minimum Stock
Initial Stock
Location
Supplier

Barcode field:
[ Scan Barcode ]

Helper:
"Use the connected IoT scanner to automatically enter the barcode."

Buttons:
Cancel
Save Product

States:
- Default
- Focus
- Filled
- Error
- Success
- Disabled

Create both Light and Dark variants.

==================================================
PAGE 4 — PRODUCT DETAIL
==================================================

Product:
CAT6 UTP Cable

Show:
Category
Location
Barcode

Statistics:
Current Stock
Minimum Stock
Total Stock In
Total Stock Out

Product Information card.

Barcode visualization.

Stock Movement chart.

Transaction History table.

Buttons:
Edit Product
Delete Product

Support both themes.

==================================================
PAGE 5 — TRANSACTIONS
==================================================

Header:

Transactions

"Track every inventory movement"

Tabs:
All
Stock In
Stock Out

Filters:
Search
Date
Product
Category
Scanner
User

Transaction table:

Time
Barcode
Product
Type
Quantity
Previous Stock
Current Stock
Scanner
User

STOCK IN:
+20 pcs

STOCK OUT:
-5 pcs

Make it look like a professional audit trail.

Create Light and Dark variants.

==================================================
PAGE 6 — STOCK TRANSACTION
==================================================

Create a dedicated transaction interface.

Header:

Stock Transaction

Tabs:
STOCK IN
STOCK OUT

Connected Scanner:

Scanner-01
🟢 Online

Large scanner interaction area:

📡
Waiting for barcode...

After scan:

Barcode Detected

899001234567

CAT6 UTP Cable

Current Stock:
35 pcs

Quantity:
[-] 5 [+]

For Stock In:

New Stock:
40 pcs

For Stock Out:

New Stock:
30 pcs

Primary buttons:
Confirm Stock In
Confirm Stock Out

States:

Waiting
Scanning
Product Found
Product Not Found
Insufficient Stock
Transaction Success
Transaction Failed

All states must work in both themes.

==================================================
PAGE 7 — IOT SCANNER
==================================================

Header:

IoT Scanner

"Monitor connected barcode scanning devices"

Scanner cards:

Scanner-01
🟢 Online

WiFi:
Excellent

Battery:
72%

Last Scan:
10:32:21

Total Scans:
248

Scanner-02
🔴 Offline

Last Seen:
2 hours ago

Each card:
- Device name
- Status
- WiFi
- Battery
- Last scan
- Total scans
- View Details

Below:

LIVE SCAN ACTIVITY

Timeline:

10:32:21
Barcode: 899001234567
CAT6 UTP Cable
STOCK OUT
-5 pcs
Scanner-01

10:31:02
Barcode: 899002345678
RJ45 Connector
STOCK IN
+20 pcs
Scanner-01

New events should visually stand out.

==================================================
PAGE 8 — SCANNER DETAIL
==================================================

Header:

Scanner-01
🟢 Online

Statistics:
Online Status
WiFi Signal
Battery
Uptime

Device Information:
Device ID
Firmware
IP Address
Connection Type
Last Connected

Scan Activity chart.

Recent Scans table.

Create Light and Dark versions.

==================================================
PAGE 9 — REPORTS
==================================================

Header:

Reports

"Inventory activity overview"

Date filters:
Today
This Week
This Month
Custom Range

Summary:
Total Stock In
Total Stock Out
Net Stock Movement
Total Transactions

Charts:
Stock Movement
Stock In vs Stock Out

Top Moving Products.

Transaction Summary.

Export Report button.

Charts and tables must work visually in both themes.

==================================================
PAGE 10 — SUPPLIERS
==================================================

Supplier management table.

Fields:
Supplier
Contact
Products
Last Transaction
Status
Actions

Add Supplier button.

Light and Dark variants.

==================================================
PAGE 11 — USERS
==================================================

User management.

Table:
User
Email
Role
Status
Last Activity
Actions

Roles:
Admin
Operator

Admin:
Full access

Operator:
Inventory and transaction access

Light and Dark variants.

==================================================
PAGE 12 — SETTINGS
==================================================

Settings sections:

GENERAL
Company Name
Warehouse
Timezone

INVENTORY
Default Unit
Low Stock Threshold
Stock Alert

SCANNER
Connected Device
Scanner Configuration
Connection Settings

APPEARANCE
Theme:
Light
Dark
System

Show a visual theme selector.

==================================================
FIGMA COMPONENT SYSTEM
==================================================

Create reusable components with variants.

BUTTONS:
- Primary
- Secondary
- Ghost
- Danger
- Icon
- Disabled

INPUTS:
- Text
- Search
- Number
- Select
- Date Picker

NAVIGATION:
- Sidebar
- Topbar
- Breadcrumb
- Pagination

CARDS:
- Statistic Card
- Product Card
- Scanner Card
- Alert Card
- Device Health Card

TABLES:
- Inventory Table
- Transaction Table
- User Table

STATUS:
- Online
- Offline
- Connecting
- Good
- Low Stock
- Out of Stock
- Error

IOT:
- Scanner Status
- Live Scan Center
- Scan Result
- Barcode Display
- Scan Activity
- Device Health

FEEDBACK:
- Toast
- Modal
- Confirmation
- Success
- Error
- Empty State
- Loading

THEME:
Create Light and Dark variants for ALL components.

Example:

Button
├── Light / Primary
├── Light / Secondary
├── Dark / Primary
└── Dark / Secondary

Card
├── Light
└── Dark

Table
├── Light
└── Dark

Scanner Status
├── Light / Online
├── Light / Offline
├── Dark / Online
└── Dark / Offline

==================================================
THEME TOGGLE
==================================================

Create a reusable theme switcher.

States:

Light Mode:
☀
Light

Dark Mode:
🌙
Dark

System:
◐
System

Prototype interaction:
Click theme toggle
→ Switch entire interface between Light and Dark Mode.

Maintain:
- Same layout
- Same spacing
- Same component sizes
- Same information hierarchy

Only visual tokens change.

==================================================
RESPONSIVE DESIGN
==================================================

Create:
Desktop: 1440px
Tablet: 1024px
Mobile: 390px

Desktop:
Fixed sidebar

Tablet:
Collapsible sidebar

Mobile:
Hamburger navigation
or bottom navigation

Cards stack vertically.

Tables become horizontally scrollable or responsive cards.

Scanner interaction must remain prominent and easy to use on mobile.

Theme toggle must remain accessible on every screen.

==================================================
PROTOTYPE FLOW
==================================================

Create clickable prototype:

Dashboard
→ Inventory
→ Product Detail

Inventory
→ Add Product
→ Edit Product
→ Delete Confirmation

Dashboard
→ Live Scan Center
→ Scan Result

IoT Scanner
→ Scanner Detail
→ Scan Activity

Stock Transaction
→ Scan Barcode
→ Product Found
→ Enter Quantity
→ Confirm
→ Success

Stock Out:
Scan
→ Validate Stock
→ Confirm
→ Update Inventory
→ Transaction Created
→ Dashboard Updated

Theme Toggle:
Light Mode
↔
Dark Mode

When transaction succeeds:
- Current stock updates
- Dashboard statistics update
- Transaction history updates
- Stock movement chart updates
- Live scan activity updates

==================================================
FINAL DESIGN REQUIREMENT
==================================================

The final UI should feel like a professional commercial IoT inventory platform.

Visual keywords:

modern
professional
clean
earth tone
warehouse
inventory
IoT
barcode
real-time
data-driven
reliable
efficient
minimal
dark mode
light mode

The most important concept is:

PHYSICAL BARCODE SCANNER
↓
REAL-TIME SCAN
↓
INVENTORY TRANSACTION
↓
STOCK UPDATE
↓
LIVE DASHBOARD

Make this relationship visually obvious throughout the application.

Deliver a cohesive Figma design system with:
1. Light Mode
2. Dark Mode
3. Reusable Components
4. Component Variants
5. Responsive Layouts
6. Interactive Prototype Flow

Do not design Light Mode first and add Dark Mode later.
Design both themes together as one unified product design system.