import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import { fetchOrders } from '../redux/orderSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const products = useSelector(s => s.products.items);
  const orders = useSelector(s => s.orders.items);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Products: <strong>{products.length}</strong></div>
        <div className="p-4 border rounded">Orders: <strong>{orders.length}</strong></div>
        <div className="p-4 border rounded">Revenue (calc): <strong>
          ${orders.reduce((s,o)=>s + Number(o.total || 0), 0).toFixed(2)}
        </strong></div>
      </div>
    </div>
  );
}
