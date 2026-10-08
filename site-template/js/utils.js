// =====================================================================
//  utils.js  -  plain JavaScript: storage, accounts, vehicles,
//  reservations, returns and small helpers. No React in here.
// =====================================================================
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(SITE.storagePrefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(SITE.storagePrefix + key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(SITE.storagePrefix + key);
  }
};

// ---------- dates and money ----------
function todayStr() {
  return new Date().toLocaleDateString("en-CA");
}

function daysBetween(from, to) {
  return Math.round((new Date(to) - new Date(from)) / 86400000);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

function formatMoney(n) {
  return SITE.currency + Number(n).toLocaleString("en-IN");
}

// ---------- accounts ----------
const Auth = {
  users() {
    return Store.get("users", []);
  },
  current() {
    return Store.get("session", null);
  },
  isAdmin() {
    const me = Auth.current();
    return !!me && me.role === "admin";
  },
  register({ name, email, phone, licence, password }) {
    const users = Auth.users();
    const clean = email.trim().toLowerCase();
    if (users.some((u) => u.email === clean)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const user = { name: name.trim(), email: clean, phone: phone.trim(), licence: licence.trim().toUpperCase(), password: password, role: "customer" };
    Store.set("users", [...users, user]);
    Store.set("session", { name: user.name, email: user.email, role: user.role });
    return { ok: true };
  },
  login(email, password) {
    const clean = email.trim().toLowerCase();
    const user = Auth.users().find((u) => u.email === clean && u.password === password);
    if (!user) return { ok: false, error: "Email or password is incorrect." };
    Store.set("session", { name: user.name, email: user.email, role: user.role });
    return { ok: true };
  },
  logout() {
    Store.remove("session");
  }
};

const Customers = {
  all() {
    return Auth.users().filter((u) => u.role !== "admin");
  },
  remove(email) {
    Store.set("users", Auth.users().filter((u) => u.email !== email));
  }
};

// ---------- vehicles ----------
const Vehicles = {
  all() {
    return Store.get("vehicles", []);
  },
  find(id) {
    return Vehicles.all().find((v) => v.id === id);
  },
  add(data) {
    const list = Vehicles.all();
    const id = list.reduce((max, v) => Math.max(max, v.id), 0) + 1;
    const style = SITE.typeStyle[data.type] || { icon: "🚗", color: "#64748b" };
    const vehicle = { ...data, id: id, icon: style.icon, color: style.color, rating: 4.5, maintenance: false };
    Store.set("vehicles", [...list, vehicle]);
    return vehicle;
  },
  update(id, patch) {
    const style = patch.type ? SITE.typeStyle[patch.type] : null;
    const extra = style ? { icon: style.icon, color: style.color } : {};
    Store.set("vehicles", Vehicles.all().map((v) => (v.id === id ? { ...v, ...patch, ...extra } : v)));
  },
  remove(id) {
    Store.set("vehicles", Vehicles.all().filter((v) => v.id !== id));
  },
  statusNow(v) {
    if (v.maintenance) return "Maintenance";
    const today = todayStr();
    const out = Reservations.all().some((r) => r.vehicleId === v.id && r.status === "Reserved" && r.from <= today);
    return out ? "Rented" : "Available";
  },
  isFree(vehicleId, from, to) {
    return !Reservations.all().some((r) => r.vehicleId === vehicleId && r.status === "Reserved" && from <= r.to && to >= r.from);
  },
  hasOpenReservation(id) {
    return Reservations.all().some((r) => r.vehicleId === id && r.status === "Reserved");
  }
};

// ---------- reservations and returns ----------
const Reservations = {
  all() {
    return Store.get("reservations", []);
  },
  mine() {
    const me = Auth.current();
    return me ? Reservations.all().filter((r) => r.userEmail === me.email) : [];
  },
  create({ vehicle, from, to }) {
    const me = Auth.current();
    const user = Auth.users().find((u) => u.email === me.email);
    if (!from || !to) return { ok: false, error: "Choose both pickup and return dates." };
    if (from < todayStr()) return { ok: false, error: "Pickup date cannot be in the past." };
    if (to < from) return { ok: false, error: "Return date must be on or after the pickup date." };
    if (vehicle.maintenance) return { ok: false, error: "This vehicle is under maintenance." };
    if (!Vehicles.isFree(vehicle.id, from, to)) {
      return { ok: false, error: "This vehicle is already reserved for some of those dates. Try other dates." };
    }
    const days = Math.max(1, daysBetween(from, to));
    const reservation = {
      id: Date.now(),
      userEmail: me.email,
      customerName: me.name,
      phone: user && user.phone ? user.phone : "",
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      plate: vehicle.plate,
      icon: vehicle.icon,
      color: vehicle.color,
      from: from,
      to: to,
      days: days,
      rate: vehicle.price,
      total: days * vehicle.price,
      status: "Reserved",
      createdAt: new Date().toISOString()
    };
    Store.set("reservations", [...Reservations.all(), reservation]);
    return { ok: true, reservation: reservation };
  },
  cancel(id) {
    Store.set("reservations", Reservations.all().map((r) => (r.id === id && r.status === "Reserved" ? { ...r, status: "Cancelled" } : r)));
  },
  previewReturn(r, returnedOn, conditionLabel) {
    const lateDays = Math.max(0, daysBetween(r.to, returnedOn));
    const lateFee = Math.round(lateDays * r.rate * SITE.fees.lateMultiplier);
    const found = SITE.fees.damage.find((d) => d.label === conditionLabel);
    const damageFee = found ? found.fee : 0;
    return { lateDays: lateDays, lateFee: lateFee, damageFee: damageFee, finalTotal: r.total + lateFee + damageFee };
  },
  processReturn(id, conditionLabel) {
    const returnedOn = todayStr();
    Store.set(
      "reservations",
      Reservations.all().map((r) => {
        if (r.id !== id || r.status !== "Reserved") return r;
        const bill = Reservations.previewReturn(r, returnedOn, conditionLabel);
        return { ...r, ...bill, status: "Returned", returnedOn: returnedOn, condition: conditionLabel };
      })
    );
  }
};

const Messages = {
  add(msg) {
    Store.set("messages", [...Store.get("messages", []), { ...msg, at: new Date().toISOString() }]);
  }
};

// ---------- first-run data ----------
function seedData() {
  if (!Store.get("users", null)) {
    Store.set("users", [{ name: SITE.admin.name, email: SITE.admin.email, password: SITE.admin.password, role: "admin" }]);
  }
  if (!Store.get("vehicles", null)) {
    Store.set("vehicles", SITE.vehicles);
  }
}

function resetDemoData() {
  ["users", "vehicles", "reservations", "messages", "session"].forEach((k) => Store.remove(k));
  seedData();
}

seedData();

// ---------- small helpers ----------
function toast(message, type) {
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: message, type: type || "success" } }));
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function currentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function visibleNav() {
  return SITE.nav.filter((l) => !l.adminOnly || Auth.isAdmin());
}
