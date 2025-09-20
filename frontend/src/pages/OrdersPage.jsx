import React from "react";
import UserOrders from "../components/UserOrders";
import UserLayout from "../components/Layout/UserLayout";

export default function OrdersPage() {
  return (
    <UserLayout>
      <UserOrders />
    </UserLayout>
  );
}
