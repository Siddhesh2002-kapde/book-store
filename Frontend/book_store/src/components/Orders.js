import React, { useState, useEffect, useContext } from "react";
import {
  Package,
  Calendar,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
  Edit2,
  X,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AuthContext } from "../context/Auth";

const OrderManagementUI = () => {
  const { data, setData } = useContext(AuthContext);
  const isAdmin = data?.user?.is_staff;
  const [expandedOrders, setExpandedOrders] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const token = localStorage.getItem("token");
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  const API_BASE_URL = "http://localhost:8000/api";
  const statusOptions = ["Pending", "Completed", "Cancelled"];

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!isAdmin) return;

    setUpdatingStatus(orderId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/orders/${orderId}/update_status/`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setEditingStatus(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!isAdmin) return;

    // if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return;

    setDeletingOrder(orderId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/orders/${orderId}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setDeletingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Completed: "bg-green-100 text-green-800 border-green-300",
      Cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Order Management
              </h1>
              <p className="text-slate-600">
                Manage and track all customer orders
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                title="Refresh Orders"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-blue-600 text-sm font-medium mb-1">
                Total Orders
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {orders.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <div className="text-yellow-600 text-sm font-medium mb-1">
                Pending
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {orders.filter((o) => o.status === "Pending").length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="text-green-600 text-sm font-medium mb-1">
                Delivered
              </div>
              <div className="text-2xl font-bold text-green-900">
                {orders.filter((o) => o.status === "Delivered").length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="text-purple-600 text-sm font-medium mb-1">
                Total Revenue
              </div>
              <div className="text-2xl font-bold text-purple-900">
                ₹
                {orders
                  .reduce((sum, o) => sum + parseFloat(o.total_price), 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.created_at)}
                        </span>
                        {isAdmin && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            User ID: {order.user}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <div className="text-sm text-slate-600">Total Amount</div>
                      <div className="text-2xl font-bold text-slate-800 flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />₹
                        {parseFloat(order.total_price).toLocaleString()}
                      </div>
                    </div>

                    {/* Status Badge/Editor */}
                    {isAdmin && editingStatus === order.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className="px-3 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingStatus(null)}
                          disabled={updatingStatus === order.id}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {updatingStatus === order.id
                            ? "Updating..."
                            : order.status}
                        </span>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setEditingStatus(order.id)}
                              disabled={
                                updatingStatus === order.id ||
                                deletingOrder === order.id
                              }
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Change Status"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={
                                updatingStatus === order.id ||
                                deletingOrder === order.id
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Order"
                            >
                              {deletingOrder === order.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {expandedOrders[order.id] ? (
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-2">
                  <Package className="w-4 h-4" />
                  <span>
                    {order.items.length} item(s) •{" "}
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    book(s) total
                  </span>
                </div>
              </div>

              {/* Order Items (Expandable) */}
              {expandedOrders[order.id] && (
                <div className="border-t border-slate-200 bg-slate-50">
                  <div className="p-6 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-slate-200"
                      >
                        <img
                          src={item.book.cover_image}
                          alt={item.book.title}
                          className="w-20 h-28 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="112" viewBox="0 0 80 112"%3E%3Crect fill="%23e2e8f0" width="80" height="112"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2364748b"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 mb-1">
                            {item.book.title}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            by {item.book.author}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {item.book.category_name}
                            </span>
                            <span className="text-slate-600">
                              ISBN: {item.book.isbn}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600 mb-1">
                            Quantity
                          </div>
                          <div className="text-xl font-bold text-slate-800 mb-2">
                            {item.quantity}
                          </div>
                          <div className="text-sm text-slate-600">Price</div>
                          <div className="text-lg font-bold text-blue-600">
                            ₹{parseFloat(item.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-slate-600">
              There are no orders to display at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementUI;
