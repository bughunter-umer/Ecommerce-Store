import React, { useEffect, useState } from "react";
import API from "../api";

export default function Customers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await API.get("/customers");
    setList(r.data);
  }

  async function submit(e) {
    e.preventDefault();
    await API.post("/customers", form);
    setForm({ name: "", email: "", phone: "", address: "" });
    load();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Customers</h2>
      <div className="grid grid-cols-1 ">
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={submit} className="space-y-2">
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded" />
            <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
            <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="w-full p-2 border rounded" />
            <textarea value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} placeholder="Address" className="w-full p-2 border rounded" />
            <button className="w-full py-2 bg-slate-800 text-white rounded">Add Customer</button>
          </form>
        </div>

        <div className="col-span-2 bg-white p-4 rounded shadow">
          <ul className="divide-y">
            {list.map(c => (
              <li key={c.id} className="py-2 flex justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-slate-500">{c.email} • {c.phone}</div>
                </div>
                <div className="text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
