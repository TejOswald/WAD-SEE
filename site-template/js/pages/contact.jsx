function ContactPage() {
  const me = Auth.current();
  const [form, setForm] = useState({ name: me ? me.name : "", email: me ? me.email : "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(0);
  const c = SITE.contact;

  function set(field) {
    return (e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); };
  }

  function submit(e) {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 2) err.name = "Enter your name.";
    if (!isValidEmail(form.email)) err.email = "Enter a valid email address.";
    if (form.subject.trim().length < 3) err.subject = "Add a short subject.";
    if (form.message.trim().length < 10) err.message = "Write at least 10 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    Messages.add(form);
    toast("Message sent. We'll reply soon.");
    setForm({ ...form, subject: "", message: "" });
  }

  return (
    <React.Fragment>
      <PageHeader title="Contact us" subtitle="Questions, feedback or ideas? Send us a message." />
      <section className="section">
        <div className="container contact-grid">
          <div>
            <div className="card info-card"><span>✉</span><div><strong>Email</strong><p className="muted">{c.email}</p></div></div>
            <div className="card info-card"><span>☎</span><div><strong>Phone</strong><p className="muted">{c.phone}</p></div></div>
            <div className="card info-card"><span>⌖</span><div><strong>Address</strong><p className="muted">{c.address}</p></div></div>
            <div className="card info-card"><span>◷</span><div><strong>Hours</strong><p className="muted">{c.hours}</p></div></div>
          </div>

          <form className="card form contact-form" onSubmit={submit} noValidate>
            <h3>Send a message</h3>
            <label>Name
              <input type="text" value={form.name} onChange={set("name")} />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>
            <label>Email
              <input type="email" value={form.email} onChange={set("email")} />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            <label>Subject
              <input type="text" value={form.subject} onChange={set("subject")} />
              {errors.subject && <span className="error">{errors.subject}</span>}
            </label>
            <label>Message
              <textarea rows="5" value={form.message} onChange={set("message")}></textarea>
              {errors.message && <span className="error">{errors.message}</span>}
            </label>
            <button className="btn btn-primary" type="submit">Send message</button>
          </form>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container narrow">
          <SectionTitle title="Frequently asked questions" />
          {SITE.faq.map((f, i) => (
            <div key={f.q} className={"faq " + (openFaq === i ? "open" : "")}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span>{f.q}</span><span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p className="muted">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}
