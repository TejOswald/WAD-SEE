function ReservationForm({ vehicle, onDone }) {
  const today = todayStr();
  const me = Auth.users().find((u) => u.email === Auth.current().email);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [error, setError] = useState("");

  const days = from && to && to >= from ? Math.max(1, daysBetween(from, to)) : 0;

  function submit(e) {
    e.preventDefault();
    const result = Reservations.create({ vehicle: vehicle, from: from, to: to });
    if (!result.ok) { setError(result.error); return; }
    toast(vehicle.name + " reserved for " + days + " day" + (days > 1 ? "s" : ""));
    onDone();
  }

  return (
    <form onSubmit={submit} className="form" noValidate>
      <p className="muted">{vehicle.type} · {vehicle.seats} seats · {vehicle.fuel} · {vehicle.transmission} · {vehicle.plate}</p>
      {me && me.phone && (
        <div className="customer-box">
          <strong>{me.name}</strong>
          <span>{me.phone} · Licence {me.licence}</span>
        </div>
      )}
      <label>Pickup date
        <input type="date" value={from} min={today} onChange={(e) => { setFrom(e.target.value); setError(""); }} />
      </label>
      <label>Return date
        <input type="date" value={to} min={from || today} onChange={(e) => { setTo(e.target.value); setError(""); }} />
      </label>
      <div className="total-row">
        <span>{days} day{days === 1 ? "" : "s"} × {formatMoney(vehicle.price)}</span>
        <strong>{formatMoney(days * vehicle.price)}</strong>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary btn-block" type="submit">Confirm reservation</button>
    </form>
  );
}

function Vehicles_() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("default");
  const [onlyFree, setOnlyFree] = useState(false);
  const [selected, setSelected] = useState(null);
  const [, setTick] = useState(0);

  let list = Vehicles.all().filter((v) => {
    const matchText = (v.name + " " + v.type + " " + v.fuel).toLowerCase().includes(query.toLowerCase());
    const matchType = type === "All" || v.type === type;
    const matchFree = !onlyFree || Vehicles.statusNow(v) === "Available";
    return matchText && matchType && matchFree;
  });
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  function onAction(vehicle) {
    if (!Auth.current()) {
      toast("Please log in to reserve a vehicle", "error");
      setTimeout(() => { window.location.href = "login.html?next=vehicles.html"; }, 900);
      return;
    }
    setSelected(vehicle);
  }

  return (
    <React.Fragment>
      <PageHeader title="Our vehicles" subtitle="Search the fleet, pick your dates and reserve." />
      <section className="section">
        <div className="container">
          <div className="toolbar">
            <input className="search" type="search" placeholder="Search by name, type or fuel..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          <div className="chips">
            {["All", ...SITE.categories].map((c) => (
              <button key={c} className={"chip-btn " + (type === c ? "active" : "")} onClick={() => setType(c)}>{c}</button>
            ))}
            <label className="free-toggle">
              <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
              Available now only
            </label>
          </div>

          {list.length === 0 ? (
            <EmptyState title="No vehicles found" text="Try a different search word, type or turn off the availability filter." />
          ) : (
            <div className="grid grid-3">
              {list.map((v) => <VehicleCard key={v.id} vehicle={v} onAction={onAction} />)}
            </div>
          )}
        </div>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.name + " · " + formatMoney(selected.price) + "/day" : ""}>
        {selected && <ReservationForm vehicle={selected} onDone={() => { setSelected(null); setTick((t) => t + 1); }} />}
      </Modal>
    </React.Fragment>
  );
}
