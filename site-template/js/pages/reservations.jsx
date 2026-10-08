function ReservationsPage() {
  const [tab, setTab] = useState("All");
  const [returning, setReturning] = useState(null);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const all = Reservations.mine().sort((a, b) => b.id - a.id);
  const list = tab === "All" ? all : all.filter((r) => r.status === tab);
  const today = todayStr();
  const user = Auth.current();

  const activeCount = all.filter((r) => r.status === "Reserved").length;
  const billed = all.filter((r) => r.status === "Returned").reduce((sum, r) => sum + r.finalTotal, 0);

  function cancel(r) {
    if (!window.confirm("Cancel the reservation for " + r.vehicleName + "?")) return;
    Reservations.cancel(r.id);
    toast("Reservation cancelled", "error");
    refresh();
  }

  return (
    <React.Fragment>
      <PageHeader title="My reservations" subtitle={"Signed in as " + user.email} />
      <section className="section">
        <div className="container">
          <div className="summary">
            <div><span className="muted">Total reservations</span><strong>{all.length}</strong></div>
            <div><span className="muted">Active now</span><strong>{activeCount}</strong></div>
            <div><span className="muted">Billed so far</span><strong>{formatMoney(billed)}</strong></div>
          </div>

          <div className="chips">
            {["All", "Reserved", "Returned", "Cancelled"].map((t) => (
              <button key={t} className={"chip-btn " + (tab === t ? "active" : "")} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {list.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              text="Reservations you make will show up here."
              href="vehicles.html"
              cta="Browse vehicles"
            />
          ) : (
            <div className="booking-list">
              {list.map((r) => (
                <div className="card booking" key={r.id}>
                  <div className="booking-icon" style={{ background: r.color }}>{r.icon}</div>
                  <div className="booking-info">
                    <h3>{r.vehicleName} <small>{r.plate}</small></h3>
                    <p className="muted">{formatDate(r.from)} to {formatDate(r.to)} · {r.days} day{r.days > 1 ? "s" : ""} · Ref #{String(r.id).slice(-6)}</p>
                    {r.status === "Returned" && (
                      <p className="muted small">Returned {formatDate(r.returnedOn)} · {r.condition} · late fee {formatMoney(r.lateFee)} · damage fee {formatMoney(r.damageFee)}</p>
                    )}
                  </div>
                  <div className="booking-side">
                    <span className={"badge badge-" + r.status.toLowerCase()}>{r.status}</span>
                    <strong>{formatMoney(r.status === "Returned" ? r.finalTotal : r.total)}</strong>
                    {r.status === "Reserved" && (
                      <div className="row-actions">
                        <button className="btn btn-primary btn-sm" disabled={r.from > today} title={r.from > today ? "Available from the pickup date" : ""} onClick={() => setReturning(r)}>Return</button>
                        <button className="btn btn-outline btn-sm" onClick={() => cancel(r)}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal open={!!returning} onClose={() => setReturning(null)} title="Return vehicle">
        {returning && <ReturnForm reservation={returning} onDone={() => { setReturning(null); refresh(); }} />}
      </Modal>
    </React.Fragment>
  );
}
