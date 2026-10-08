# Vehicle Rental Management System (HTML + CSS + JS + React)

## Run it
1. Open the folder in VS Code.
2. Right-click `html/index.html` and choose Open with Live Server.
   (Double-clicking a page will NOT work, the .jsx files need a server.)
   Alternative: run `python -m http.server 5500` in this folder, open http://localhost:5500
3. Works offline: React and Babel are in `vendor/`.

## Logins
Admin: admin@driveeasy.com / admin123   (set in js/config.js)
Customers: use Register on the login page (name, email, phone, licence number, password).

## Pages
index.html          home (hero, popular vehicles, how it works)
vehicles.html       fleet: search, type filter, sort, "available now", reserve with dates
reservations.html   customer: my reservations, cancel, return vehicle (final bill)
admin.html          admin only: Vehicles, Customers, Reservations, Returns + stats
login.html          login / register
contact.html        contact form, details, FAQ

## How the rental logic works (js/utils.js)
Vehicles.isFree()              blocks overlapping dates for the same vehicle
Vehicles.statusNow()           Available / Rented / Maintenance
Reservations.create()          validates dates, total = days x daily rate
Reservations.previewReturn()   late fee = late days x rate x 1.5, plus damage fee
Reservations.processReturn()   marks Returned, stores the final bill, frees the vehicle
All data lives in the browser (localStorage, keys start with vrms_).
"Reset demo data" on the Admin page restores the starting data.

## Folder map
html/               pages (scripts at the bottom of body)
css/                small files: base, layout, buttons, navbar, footer, motion, cards, chips, forms, modal, feedback
                    plus one per page: home, vehicles, reservations, admin, login, contact
js/config.js        names, nav, fees, starting vehicles, text
js/utils.js         data logic (no React)
js/components.jsx   Navbar, Footer, VehicleCard, ReturnForm, Modal, mountPage
js/pages/*.jsx      one React component per page
vendor/             React, ReactDOM, Babel (never edit)

## Changing things quickly
Fee rules: SITE.fees in config.js.
Vehicle types: SITE.categories and SITE.typeStyle.
New starting vehicles: edit SITE.vehicles, then press "Reset demo data" in Admin.
Main blue colour everywhere: Find in Files (Ctrl+Shift+H), search #1f6feb, replace inside css/.
