import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";

export default function Orders() {
  const orders = useSelector(s => s.orders.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="bg-white p-4 shadow rounded">
        <table className="text-left">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="py-2">Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="py-2">#{o.id}</td>
                <td>{o.customer_name || "Guest"}</td>
                <td>${o.total}</td>
                <td>{o.status}</td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
