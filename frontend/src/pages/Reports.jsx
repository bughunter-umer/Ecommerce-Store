import React, { useEffect, useState } from "react";
import API from "../api";
import Chart from "../components/Chart";

export default function Reports() {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const r = await API.get("/reports/sales");
      setData(r.data);
    })();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white p-4 rounded shadow">
        {data ? <>
          <div className="mb-4">
            <strong>Total revenue: </strong>${data.totals.total_revenue || 0} • <strong>Orders:</strong> {data.totals.total_orders || 0}
          </div>
          <Chart data={data.series} />
        </> : <p>Loading...</p>}
      </div>
    </div>
  );
}
