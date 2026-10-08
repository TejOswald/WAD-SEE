function LoginPage() {
  const [mode, setMode] = useState(getParam("mode") === "register" ? "register" : "login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", licence: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const user = Auth.current();

  function set(field) {
    return (e) => { setForm({ ...form, [field]: e.target.value }); setError(""); };
  }

  function goNext() {
    const next = getParam("next");
    window.location.href = next && /^[\w-]+\.html$/.test(next) ? next : Auth.isAdmin() ? "admin.html" : "index.html";
  }

  function submit(e) {
    e.preventDefault();
    if (mode === "register" && form.name.trim().length < 2) return setError("Enter your full name.");
    if (!isValidEmail(form.email)) return setError("Enter a valid email address.");
    if (mode === "register" && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) return setError("Enter a 10 digit phone number.");
    if (mode === "register" && form.licence.trim().length < 6) return setError("Enter your driving licence number.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "register" && form.password !== form.confirm) return setError("Passwords do not match.");

    const result = mode === "register" ? Auth.register(form) : Auth.login(form.email, form.password);
    if (!result.ok) return setError(result.error);
    toast(mode === "register" ? "Account created" : "Welcome back");
    setTimeout(goNext, 600);
  }

  if (user) {
    return (
      <section className="section auth-wrap">
        <div className="card auth-card center">
          <div className="feature-icon">✅</div>
          <h2>You're logged in</h2>
          <p className="muted">{user.name} ({user.email})</p>
          <a href={Auth.isAdmin() ? "admin.html" : "reservations.html"} className="btn btn-primary btn-block">{Auth.isAdmin() ? "Open admin dashboard" : "Go to my reservations"}</a>
          <button className="btn btn-outline btn-block mt-sm" onClick={() => { Auth.logout(); window.location.reload(); }}>Log out</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section auth-wrap">
      <div className="card auth-card">
        <div className="center"><Logo size={48} /></div>
        <h2 className="center">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Login</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Register</button>
        </div>
        <form className="form" onSubmit={submit} noValidate>
          {mode === "register" && (
            <label>Full name
              <input type="text" value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
            </label>
          )}
          <label>Email
            <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
          </label>
          {mode === "register" && (
            <label>Phone number
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="10 digit mobile number" autoComplete="tel" />
            </label>
          )}
          {mode === "register" && (
            <label>Driving licence number
              <input type="text" value={form.licence} onChange={set("licence")} placeholder="e.g. KA0120210001234" />
            </label>
          )}
          <label>Password
            <div className="pw">
              <input type={show ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} />
              <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </div>
          </label>
          {mode === "register" && (
            <label>Confirm password
              <input type={show ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" autoComplete="new-password" />
            </label>
          )}
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
        </form>
        <p className="muted center small">Accounts are saved in your browser only.</p>
        <p className="muted center small">Admin demo login: {SITE.admin.email} / {SITE.admin.password}</p>
      </div>
    </section>
  );
}
