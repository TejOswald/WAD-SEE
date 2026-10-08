// =====================================================================
//  components.jsx  -  shared React components used on every page
//  Navbar, Footer, Logo, Toaster, Modal, Reveal, VehicleCard, ReturnForm, Layout
//  mountPage(Page, options) is how each page starts itself.
// =====================================================================
const { useState, useEffect, useRef } = React;

function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#1f6feb" />
      <path d="M12 28V12h9a5 5 0 0 1 0 10h-9" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="28" r="3" fill="#ff8a3d" />
    </svg>
  );
}

function Navbar({ heroPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = Auth.current();
  const page = currentPage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !heroPage || open;

  function logout() {
    Auth.logout();
    window.location.href = "index.html";
  }

  return (
    <header className={"navbar " + (solid ? "navbar-solid" : "")}>
      <div className="container nav-inner">
        <a href="index.html" className="brand">
          <Logo />
          <span>{SITE.name}</span>
        </a>

        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>

        <nav className={"nav-links " + (open ? "open" : "")}>
          {visibleNav().map((link) => (
            <a key={link.href} href={link.href} className={page === link.href ? "active" : ""}>
              {link.label}
            </a>
          ))}
          {user ? (
            <div className="nav-user">
              <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="nav-user-name">{user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </div>
          ) : (
            <a href="login.html" className="btn btn-primary btn-sm">Login</a>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const c = SITE.contact;
  return (
    <footer className="footer" id="contact-footer">
      <div className="container footer-grid">
        <div>
          <a href="index.html" className="brand brand-light">
            <Logo />
            <span>{SITE.name}</span>
          </a>
          <p className="footer-text">{SITE.tagline}</p>
          <div className="socials">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="GitHub">GH</a>
          </div>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>
            {visibleNav().map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="login.html">Login</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact us</h4>
          <ul>
            <li>✉ <a href={"mailto:" + c.email}>{c.email}</a></li>
            <li>☎ <a href={"tel:" + c.phone.replace(/\s/g, "")}>{c.phone}</a></li>
            <li>⌖ {c.address}</li>
            <li>◷ {c.hours}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}

function Toaster() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    function onToast(e) {
      const t = { id: Date.now() + Math.random(), message: e.detail.message, type: e.detail.type };
      setToasts((list) => [...list, t]);
      setTimeout(() => setToasts((list) => list.filter((x) => x.id !== t.id)), 3200);
    }
    window.addEventListener("app-toast", onToast);
    return () => window.removeEventListener("app-toast", onToast);
  }, []);
  return (
    <div className="toaster">
      {toasts.map((t) => (
        <div key={t.id} className={"toast toast-" + t.type}>{t.message}</div>
      ))}
    </div>
  );
}

function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={"to-top " + (show ? "show" : "")}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setSeen(true); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setSeen(true); obs.disconnect(); }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={"reveal " + (seen ? "in" : "")} style={{ transitionDelay: delay + "ms" }}>
      {children}
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, onAction }) {
  const status = Vehicles.statusNow(vehicle);
  return (
    <article className="card vehicle-card">
      <div className="vehicle-thumb" style={{ background: vehicle.color }}>
        <span>{vehicle.icon}</span>
        <em className="chip">{vehicle.type}</em>
        <em className={"status status-" + status.toLowerCase()}>{status}</em>
      </div>
      <div className="card-body">
        <div className="item-row">
          <h3>{vehicle.name}</h3>
          <span className="rating">★ {vehicle.rating}</span>
        </div>
        <ul className="specs">
          <li>👥 {vehicle.seats} seats</li>
          <li>⛽ {vehicle.fuel}</li>
          <li>⚙ {vehicle.transmission}</li>
        </ul>
        <div className="item-row item-foot">
          <strong className="price">{formatMoney(vehicle.price)}<small>/day</small></strong>
          <button className="btn btn-primary btn-sm" disabled={vehicle.maintenance} onClick={() => onAction(vehicle)}>
            {vehicle.maintenance ? "Unavailable" : SITE.actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

function ReturnForm({ reservation, onDone }) {
  const [condition, setCondition] = useState(SITE.fees.damage[0].label);
  const today = todayStr();
  const bill = Reservations.previewReturn(reservation, today, condition);

  function confirmReturn() {
    Reservations.processReturn(reservation.id, condition);
    toast("Vehicle returned. Final bill " + formatMoney(bill.finalTotal));
    onDone();
  }

  return (
    <div className="form">
      <p className="muted">{reservation.vehicleName} · {reservation.plate} · due {formatDate(reservation.to)}</p>
      <label>Return date
        <input type="text" value={formatDate(today)} readOnly />
      </label>
      <label>Vehicle condition
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          {SITE.fees.damage.map((d) => <option key={d.label} value={d.label}>{d.label}</option>)}
        </select>
      </label>
      <div className="bill">
        <div><span>Rental ({reservation.days} day{reservation.days > 1 ? "s" : ""})</span><span>{formatMoney(reservation.total)}</span></div>
        <div><span>Late fee ({bill.lateDays} day{bill.lateDays === 1 ? "" : "s"} late)</span><span>{formatMoney(bill.lateFee)}</span></div>
        <div><span>Damage fee</span><span>{formatMoney(bill.damageFee)}</span></div>
        <div className="bill-total"><span>Final total</span><strong>{formatMoney(bill.finalTotal)}</strong></div>
      </div>
      <button className="btn btn-primary btn-block" onClick={confirmReturn}>Confirm return</button>
    </div>
  );
}

function EmptyState({ title, text, href, cta }) {
  return (
    <div className="empty">
      <div className="empty-icon">📭</div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {href && <a href={href} className="btn btn-primary">{cta}</a>}
    </div>
  );
}

function Layout({ children, heroPage }) {
  return (
    <React.Fragment>
      <Navbar heroPage={heroPage} />
      <main>{children}</main>
      <Footer />
      <Toaster />
      <ScrollTopButton />
    </React.Fragment>
  );
}

function mountPage(Page, options) {
  const opts = options || {};
  if (opts.title) document.title = opts.title + " | " + SITE.name;
  if (opts.requireLogin && !Auth.current()) {
    window.location.replace("login.html?next=" + encodeURIComponent(currentPage()));
    return;
  }
  if (opts.requireAdmin && !Auth.isAdmin()) {
    window.location.replace("index.html");
    return;
  }
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <Layout heroPage={opts.heroPage}>
      <Page />
    </Layout>
  );
}
