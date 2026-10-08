// =====================================================================
//  config.js  -  Vehicle Rental Management System
//  Names, nav links, fees, text and the starting fleet live here.
//  NOTE: vehicles/users are copied into localStorage the first time the
//  site opens. If you edit the vehicles below later, press
//  "Reset demo data" on the Admin page (or change storagePrefix).
// =====================================================================
const SITE = {
  name: "DriveEasy Rentals",
  tagline: "Cars, bikes and vans on rent, with every reservation and return tracked in one place.",
  storagePrefix: "vrms_",
  currency: "₹",

  itemLabel: "Vehicle",
  itemLabelPlural: "Vehicles",
  bookingLabel: "Reservation",
  bookingLabelPlural: "Reservations",
  actionLabel: "Reserve",

  admin: {
    name: "Admin",
    email: "admin@driveeasy.com",
    password: "admin123"
  },

  fees: {
    lateMultiplier: 1.5,
    damage: [
      { label: "No damage", fee: 0 },
      { label: "Minor damage", fee: 500 },
      { label: "Major damage", fee: 2500 }
    ]
  },

  nav: [
    { label: "Home", href: "index.html" },
    { label: "Vehicles", href: "vehicles.html" },
    { label: "My Reservations", href: "reservations.html" },
    { label: "Contact", href: "contact.html" },
    { label: "Admin", href: "admin.html", adminOnly: true }
  ],

  hero: {
    title: "Pick a vehicle, set your dates, and drive away",
    subtitle: "Browse the fleet, reserve in under a minute and return it with a clear final bill. No paperwork, no queues.",
    primaryCta: { label: "Browse vehicles", href: "vehicles.html" },
    secondaryCta: { label: "See how it works", href: "#how" }
  },

  features: [
    { icon: "🚗", title: "Wide fleet", text: "Hatchbacks, sedans, SUVs, vans, bikes and scooters." },
    { icon: "📅", title: "Date-safe booking", text: "A vehicle can never be double-booked for the same dates." },
    { icon: "🧾", title: "Clear billing", text: "Late and damage charges are shown before you confirm a return." },
    { icon: "🛠", title: "Managed fleet", text: "Admins add vehicles, track customers and handle returns." }
  ],

  steps: [
    { title: "Register as a customer", text: "Add your name, phone number and driving licence number once." },
    { title: "Reserve a vehicle", text: "Choose pickup and return dates. The total is calculated instantly." },
    { title: "Return and pay", text: "Return it on time and in good condition to pay only the booked amount." }
  ],

  stats: [
    { value: 60, suffix: "+", label: "Vehicles" },
    { value: 2400, suffix: "+", label: "Reservations" },
    { value: 98, suffix: "%", label: "On-time returns" },
    { value: 24, suffix: "/7", label: "Support" }
  ],

  testimonials: [
    { name: "Asha R.", role: "Student", text: "Reserved a scooter for the weekend in two minutes. Returning it was just as easy." },
    { name: "Karthik M.", role: "Developer", text: "The final bill was exactly what the app showed me before I confirmed." },
    { name: "Priya S.", role: "Designer", text: "I could see all my past and current reservations on one page." }
  ],

  categories: ["Hatchback", "Sedan", "SUV", "Van", "Bike", "Scooter"],

  typeStyle: {
    Hatchback: { icon: "🚗", color: "#6366f1" },
    Sedan: { icon: "🚘", color: "#0ea5e9" },
    SUV: { icon: "🚙", color: "#10b981" },
    Van: { icon: "🚐", color: "#f59e0b" },
    Bike: { icon: "🏍️", color: "#ef4444" },
    Scooter: { icon: "🛵", color: "#ec4899" }
  },

  fuels: ["Petrol", "Diesel", "Electric", "CNG"],
  transmissions: ["Manual", "Automatic"],

  vehicles: [
    { id: 1, name: "Maruti Swift", type: "Hatchback", plate: "KA01AB1234", price: 1200, seats: 5, fuel: "Petrol", transmission: "Manual", rating: 4.4, maintenance: false, icon: "🚗", color: "#6366f1" },
    { id: 2, name: "Honda City", type: "Sedan", plate: "KA02CD5678", price: 2200, seats: 5, fuel: "Petrol", transmission: "Automatic", rating: 4.6, maintenance: false, icon: "🚘", color: "#0ea5e9" },
    { id: 3, name: "Hyundai Creta", type: "SUV", plate: "KA03EF9012", price: 2800, seats: 5, fuel: "Diesel", transmission: "Manual", rating: 4.7, maintenance: false, icon: "🚙", color: "#10b981" },
    { id: 4, name: "Toyota Innova", type: "Van", plate: "KA04GH3456", price: 3500, seats: 7, fuel: "Diesel", transmission: "Manual", rating: 4.8, maintenance: false, icon: "🚐", color: "#f59e0b" },
    { id: 5, name: "Royal Enfield Classic", type: "Bike", plate: "KA05JK7890", price: 900, seats: 2, fuel: "Petrol", transmission: "Manual", rating: 4.6, maintenance: false, icon: "🏍️", color: "#ef4444" },
    { id: 6, name: "Honda Activa", type: "Scooter", plate: "KA06LM1357", price: 450, seats: 2, fuel: "Petrol", transmission: "Automatic", rating: 4.3, maintenance: false, icon: "🛵", color: "#ec4899" },
    { id: 7, name: "Tata Nexon EV", type: "SUV", plate: "KA07NP2468", price: 3000, seats: 5, fuel: "Electric", transmission: "Automatic", rating: 4.5, maintenance: false, icon: "🚙", color: "#10b981" },
    { id: 8, name: "Mahindra Thar", type: "SUV", plate: "KA08QR3579", price: 3200, seats: 4, fuel: "Diesel", transmission: "Manual", rating: 4.9, maintenance: false, icon: "🚙", color: "#10b981" }
  ],

  contact: {
    email: "support@driveeasy.com",
    phone: "+91 98765 43210",
    address: "12 College Road, Bengaluru, Karnataka 560001",
    hours: "Mon to Sat, 9 AM to 6 PM"
  },

  faq: [
    { q: "What do I need to reserve a vehicle?", a: "A registered account with your phone number and driving licence number." },
    { q: "What happens if I return late?", a: "Each extra day is charged at 1.5 times the daily rate. The exact amount is shown before you confirm the return." },
    { q: "Can I cancel a reservation?", a: "Yes, any time before the vehicle is returned. Open My Reservations and press Cancel." }
  ]
};
