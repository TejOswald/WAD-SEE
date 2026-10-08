function VehicleForm({ initial, onSave }) {
  const [f, setF] = useState(initial || { name: "", type: SITE.categories[0], plate: "", price: "", seats: "", fuel: SITE.fuels[0], transmission: SITE.transmissions[0] });
  const [error, setError] = useState("");

  function set(field) {
    return (e) => { setF({ ...f, [field]: e.target.value }); setError(""); };
  }

  function submit(e) {
    e.preventDefault();
    if (f.name.trim().length < 3) return setError("Enter the vehicle name.");
    if (f.plate.trim().length < 4) return setError("Enter the registration number.");
    if (!(Number(f.price) > 0)) return setError("Price per day must be more than 0.");
    if (!(Number(f.seats) >= 1 && Number(f.seats) <= 12)) return setError("Seats must be between 1 and 12.");
    onSave({ ...f, name: f.name.trim(), plate: f.plate.trim().toUpperCase(), price: Number(f.price), seats: Number(f.seats) });
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <label>Vehicle name
        <input type="text" value={f.name} onChange={set("name")} placeholder="e.g. Maruti Swift" />
      </label>
      <label>Type
        <select value={f.type} onChange={set("type")}>
          {SITE.categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Registration number
        <input type="text" value={f.plate} onChange={set("plate")} placeholder="KA01AB1234" />
      </label>
      <div className="form-two">
        <label>Price per day
          <input type="number" min="1" value={f.price} onChange={set("price")} />
        </label>
        <label>Seats
          <input type="number" min="1" max="12" value={f.seats} onChange={set("seats")} />
        </label>
      </div>
      <div className="form-two">
        <label>Fuel
          <select value={f.fuel} onChange={set("fuel")}>{SITE.fuels.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
        <label>Transmission
          <select value={f.transmission} onChange={set("transmission")}>{SITE.transmissions.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary btn-block" type="submit">{initial ? "Save changes" : "Add vehicle"}</button>
    </form>
  );
}

function AdminPage() {
  const [tab, setTab] = useState("Vehicles");
  const [vehicleModal, setVehicleModal] = useState(null);
  const [returning, setReturning] = useState(null);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const vehicles = Vehicles.all();
  const customers = Customers.all();
  const reservations = Reservations.all().sort((a, b) => b.id - a.id);
  const returned = reservations.filter((r) => r.status === "Returned");

  const availableNow = vehicles.filter((v) => Vehicles.statusNow(v) === "Available").length;
  const activeRentals = reservations.filter((r) => r.status === "Reserved").length;
  const revenue = returned.reduce((sum, r) => sum + r.finalTotal, 0);

  function saveVehicle(data) {
    if (vehicleModal && vehicleModal.id) {
      Vehicles.update(vehicleModal.id, data);
      toast("Vehicle updated");
    } else {
      Vehicles.add(data);
      toast("Vehicle added");
    }
    setVehicleModal(null);
    refresh();
  }

  function deleteVehicle(v) {
    if (Vehicles.hasOpenReservation(v.id)) return toast("This vehicle has an open reservation", "error");
    if (!window.confirm("Delete " + v.name + "?")) return;
    Vehicles.remove(v.id);
    toast("Vehicle deleted", "error");
    refresh();
  }

  function toggleMaintenance(v) {
    Vehicles.update(v.id, { maintenance: !v.maintenance });
    refresh();
  }

  function removeCustomer(c) {
    const open = reservations.some((r) => r.userEmail === c.email && r.status === "Reserved");
    if (open) return toast("This customer has an open reservation", "error");
    if (!window.confirm("Remove " + c.name + "?")) return;
    Customers.remove(c.email);
    toast("Customer removed", "error");
    refresh();
  }

  function cancelReservation(r) {
    if (!window.confirm("Cancel this reservation?")) return;
    Reservations.cancel(r.id);
    toast("Reservation cancelled", "error");
    refresh();
  }

  function resetData() {
    if (!window.confirm("This deletes all vehicles, customers and reservations you added and restores the starting data. Continue?")) return;
    resetDemoData();
    window.location.href = "login.html";
  }

  return (
    <React.Fragment>
      <PageHeader title="Admin dashboard" subtitle="Manage vehicles, customers, reservations and returns." />
      <section className="section">
        <div className="container">
          <div className="admin-stats">
            <div className="card"><span className="muted">Vehicles</span><strong>{vehicles.length}</strong></div>
            <div className="card"><span className="muted">Available now</span><strong>{availableNow}</strong></div>
            <div className="card"><span className="muted">Active rentals</span><strong>{activeRentals}</strong></div>
            <div className="card"><span className="muted">Customers</span><strong>{customers.length}</strong></div>
            <div className="card"><span className="muted">Revenue</span><strong>{formatMoney(revenue)}</strong></div>
          </div>

          <div className="admin-tabs">
            {["Vehicles", "Customers", "Reservations", "Returns"].map((t) => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          {tab === "Vehicles" && (
            <React.Fragment>
              <div className="admin-bar">
                <h3>Fleet ({vehicles.length})</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setVehicleModal({})}>+ Add vehicle</button>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Vehicle</th><th>Reg. no.</th><th>Type</th><th>Price/day</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {vehicles.map((v) => {
                      const status = Vehicles.statusNow(v);
                      return (
                        <tr key={v.id}>
                          <td>{v.icon} {v.name}</td>
                          <td>{v.plate}</td>
                          <td>{v.type}</td>
                          <td>{formatMoney(v.price)}</td>
                          <td><span className={"status-text status-" + status.toLowerCase()}>{status}</span></td>
                          <td>
                            <div className="row-actions">
                              <button className="btn btn-outline btn-sm" onClick={() => setVehicleModal(v)}>Edit</button>
                              <button className="btn btn-outline btn-sm" onClick={() => toggleMaintenance(v)}>{v.maintenance ? "End maintenance" : "Maintenance"}</button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteVehicle(v)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          )}

          {tab === "Customers" && (
            <React.Fragment>
              <div className="admin-bar"><h3>Customers ({customers.length})</h3></div>
              {customers.length === 0 ? (
                <EmptyState title="No customers yet" text="Customers appear here after they register." />
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Licence no.</th><th>Reservations</th><th>Billed</th><th>Action</th></tr></thead>
                    <tbody>
                      {customers.map((c) => {
                        const mine = reservations.filter((r) => r.userEmail === c.email);
                        const billed = mine.filter((r) => r.status === "Returned").reduce((s, r) => s + r.finalTotal, 0);
                        return (
                          <tr key={c.email}>
                            <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.licence}</td>
                            <td>{mine.length}</td><td>{formatMoney(billed)}</td>
                            <td><button className="btn btn-danger btn-sm" onClick={() => removeCustomer(c)}>Remove</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </React.Fragment>
          )}

          {tab === "Reservations" && (
            <React.Fragment>
              <div className="admin-bar"><h3>All reservations ({reservations.length})</h3></div>
              {reservations.length === 0 ? (
                <EmptyState title="No reservations yet" text="Customer reservations will be listed here." />
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Ref</th><th>Customer</th><th>Vehicle</th><th>Pickup</th><th>Return by</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {reservations.map((r) => (
                        <tr key={r.id}>
                          <td>#{String(r.id).slice(-6)}</td>
                          <td>{r.customerName}<br /><small className="muted">{r.phone}</small></td>
                          <td>{r.vehicleName}<br /><small className="muted">{r.plate}</small></td>
                          <td>{formatDate(r.from)}</td>
                          <td>{formatDate(r.to)}</td>
                          <td>{formatMoney(r.status === "Returned" ? r.finalTotal : r.total)}</td>
                          <td><span className={"badge badge-" + r.status.toLowerCase()}>{r.status}</span></td>
                          <td>
                            {r.status === "Reserved" && (
                              <div className="row-actions">
                                <button className="btn btn-primary btn-sm" onClick={() => setReturning(r)}>Process return</button>
                                <button className="btn btn-outline btn-sm" onClick={() => cancelReservation(r)}>Cancel</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </React.Fragment>
          )}

          {tab === "Returns" && (
            <React.Fragment>
              <div className="admin-bar"><h3>Returned vehicles ({returned.length})</h3><strong>Revenue {formatMoney(revenue)}</strong></div>
              {returned.length === 0 ? (
                <EmptyState title="No returns yet" text="Completed returns and their final bills show up here." />
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Customer</th><th>Vehicle</th><th>Due</th><th>Returned</th><th>Condition</th><th>Late fee</th><th>Damage fee</th><th>Final total</th></tr></thead>
                    <tbody>
                      {returned.map((r) => (
                        <tr key={r.id}>
                          <td>{r.customerName}</td>
                          <td>{r.vehicleName}</td>
                          <td>{formatDate(r.to)}</td>
                          <td>{formatDate(r.returnedOn)}</td>
                          <td>{r.condition}</td>
                          <td>{formatMoney(r.lateFee)}</td>
                          <td>{formatMoney(r.damageFee)}</td>
                          <td><strong>{formatMoney(r.finalTotal)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </React.Fragment>
          )}

          <div className="center mt">
            <button className="btn btn-outline btn-sm" onClick={resetData}>Reset demo data</button>
          </div>
        </div>
      </section>

      <Modal open={!!vehicleModal} onClose={() => setVehicleModal(null)} title={vehicleModal && vehicleModal.id ? "Edit vehicle" : "Add vehicle"}>
        {vehicleModal && <VehicleForm initial={vehicleModal.id ? vehicleModal : null} onSave={saveVehicle} />}
      </Modal>

      <Modal open={!!returning} onClose={() => setReturning(null)} title="Process return">
        {returning && <ReturnForm reservation={returning} onDone={() => { setReturning(null); refresh(); }} />}
      </Modal>
    </React.Fragment>
  );
}
