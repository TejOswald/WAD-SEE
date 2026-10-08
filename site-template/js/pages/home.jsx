function useCountUp(target, start) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    const dur = 1400;
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start]);
  return n;
}

function Stat({ value, suffix, label, start }) {
  const n = useCountUp(value, start);
  return (
    <div className="stat">
      <strong>{n.toLocaleString("en-IN")}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

function StatsBar() {
  const ref = useRef(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setStart(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="stats" ref={ref}>
      <div className="container stats-grid">
        {SITE.stats.map((s) => <Stat key={s.label} {...s} start={start} />)}
      </div>
    </section>
  );
}

function Home() {
  const h = SITE.hero;
  const featured = Vehicles.all().slice(0, 3);

  function bookFeatured() {
    window.location.href = "vehicles.html";
  }

  function smoothTo(e, href) {
    if (href.charAt(0) === "#") {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <React.Fragment>
      <section className="hero" id="top">
        <div className="container hero-inner">
          <h1>{h.title}</h1>
          <p>{h.subtitle}</p>
          <div className="hero-actions">
            <a className="btn btn-accent" href={h.primaryCta.href} onClick={(e) => smoothTo(e, h.primaryCta.href)}>{h.primaryCta.label}</a>
            <a className="btn btn-ghost" href={h.secondaryCta.href} onClick={(e) => smoothTo(e, h.secondaryCta.href)}>{h.secondaryCta.label}</a>
          </div>
        </div>
      </section>

      <StatsBar />

      <section className="section" id="features">
        <div className="container">
          <SectionTitle title="Why use it" subtitle="Everything you need, nothing you don't." />
          <div className="grid grid-4">
            {SITE.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="card feature">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p className="muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="featured">
        <div className="container">
          <SectionTitle title="Popular vehicles" subtitle="A quick look at what customers rent most." />
          <div className="grid grid-3">
            {featured.map((vehicle) => (
              <Reveal key={vehicle.id}>
                <VehicleCard vehicle={vehicle} onAction={bookFeatured} />
              </Reveal>
            ))}
          </div>
          <div className="center mt">
            <a href="vehicles.html" className="btn btn-outline">View all {SITE.itemLabelPlural.toLowerCase()}</a>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <SectionTitle title="How it works" subtitle="Three steps from sign-up to confirmed." />
          <div className="steps">
            {SITE.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="step">
                  <span className="step-no">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="reviews">
        <div className="container">
          <SectionTitle title="What people say" />
          <div className="grid grid-3">
            {SITE.testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <blockquote className="card quote">
                  <p>"{t.text}"</p>
                  <footer><strong>{t.name}</strong> <span className="muted">{t.role}</span></footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container center">
          <h2>Ready to get started?</h2>
          <p>Create a free account and make your first reservation today.</p>
          <a href="login.html?mode=register" className="btn btn-accent">Create account</a>
        </div>
      </section>
    </React.Fragment>
  );
}
