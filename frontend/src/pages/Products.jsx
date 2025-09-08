import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error.error || 'Error'}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="border rounded p-3 shadow-sm">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm">{p.description}</p>
            <div className="mt-2">
              <strong>Price:</strong> ${Number(p.price).toFixed(2)}
            </div>
            <div><strong>Stock:</strong> {p.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
