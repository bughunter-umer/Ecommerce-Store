// src/pages/Customers.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../redux/customerSlice";
import API from "../../api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Customers() {
  const dispatch = useDispatch();
  const { items: customers = [], loading, error } = useSelector(
    (state) => state.customers
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Fetch customers
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Open modal
  const openModal = (customer = null) => {
    setEditing(customer);
    setOpen(true);
  };

  // Validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    address: Yup.string(),
    password: editing ? Yup.string() : Yup.string().required("Password is required"),
  });

  // Handle Add/Edit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = { ...values };
    if (editing && !payload.password) delete payload.password; // don't overwrite password if empty

    try {
      let res;
      if (editing) {
        res = await API.put(`/customers/${editing.id}`, payload);
      } else {
        res = await API.post("/customers", payload);
      }

      if (res.status === 200 || res.status === 201) {
        setOpen(false);
        setEditing(null);
        resetForm();
        dispatch(fetchCustomers());
      } else {
        alert(res.data.error || "Failed to save customer.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await API.delete(`/customers/${id}`);
      if (res.status === 200) {
        dispatch(fetchCustomers());
      } else {
        alert(res.data.error || "Failed to delete customer.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Customer Management
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Manage your customer database
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 sm:px-5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md text-sm sm:text-base"
          >
            Add Customer
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded text-sm sm:text-base">
            <p className="text-red-700">{error.error || "Error loading customers"}</p>
          </div>
        )}

        {/* Customer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {customers.length === 0 && !loading ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
              <h3 className="mt-2 text-lg sm:text-xl font-medium text-gray-900">
                No customers
              </h3>
              <p className="mt-1 text-gray-500 text-sm sm:text-base">
                Add your first customer to get started.
              </p>
            </div>
          ) : (
            customers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl text-gray-800">
                      {c.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{c.email}</p>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full self-start sm:self-auto">
                    ID: {c.id}
                  </div>
                </div>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">
                  {c.phone || "No phone provided"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  {c.address || "No address provided"}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm w-full sm:w-auto"
                    onClick={() => openModal(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm w-full sm:w-auto"
                    onClick={() => deleteCustomer(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {editing ? "Edit Customer" : "Add New Customer"}
            </h2>

            <Formik
              initialValues={{
                name: editing?.name || "",
                email: editing?.email || "",
                phone: editing?.phone || "",
                address: editing?.address || "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3">
                  <div>
                    <Field
                      name="name"
                      placeholder="Name"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-xs sm:text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      name="email"
                      placeholder="Email"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-xs sm:text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      name="phone"
                      placeholder="Phone"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-600 text-xs sm:text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      name="address"
                      placeholder="Address"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-600 text-xs sm:text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      name="password"
                      type="password"
                      placeholder={editing ? "Leave blank to keep current password" : "Password"}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-xs sm:text-sm mt-1" />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-5">
                    <button
                      type="button"
                      className="px-3 py-2 border rounded-lg text-sm sm:text-base"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm sm:text-base"
                      disabled={isSubmitting}
                    >
                      {editing ? "Update" : "Add"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
