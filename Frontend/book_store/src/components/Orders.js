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
import Particles from "react-tsparticles";
import { AuthContext } from "../context/Auth";

const OrderManagementUI = () => {
  const { data } = useContext(AuthContext);
  const isAdmin = data?.user?.is_staff;
  const [expandedOrders, setExpandedOrders] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:8000/api";
  const statusOptions = ["Pending", "Completed", "Cancelled"];

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

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
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setEditingStatus(null);
    } catch (err) {
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!isAdmin) return;
    setDeletingOrder(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/${orderId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete order");
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      alert("Failed to delete order. Please try again.");
    } finally {
      setDeletingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-600/20 text-yellow-400 border-yellow-500",
      Completed: "bg-green-600/20 text-green-400 border-green-500",
      Cancelled: "bg-red-600/20 text-red-400 border-red-500",
    };
    return colors[status] || "bg-gray-600/20 text-gray-300 border-gray-500";
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
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <div className="min-h-screen relative top-15 overflow-x-hidden bg-gray-950 text-white">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          particles: {
            number: { value: 60 },
            color: { value: ["#60a5fa", "#c084fc", "#f472b6"] },
            size: { value: 2 },
            move: { speed: 1, outMode: "out" },
            opacity: { value: 0.4 },
          },
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Order Management
          </h1>
          <p className="text-gray-300">Manage and track all customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-gray-300 text-sm mb-1">Total Orders</div>
            <div className="text-white text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-4 text-center">
            <div className="text-yellow-400 text-sm mb-1">Pending</div>
            <div className="text-yellow-200 text-2xl font-bold">
              {orders.filter((o) => o.status === "Pending").length}
            </div>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-4 text-center">
            <div className="text-green-400 text-sm mb-1">Delivered</div>
            <div className="text-green-200 text-2xl font-bold">
              {orders.filter((o) => o.status === "Completed").length}
            </div>
          </div>
          <div className="bg-purple-900/20 border border-purple-700 rounded-xl p-4 text-center">
            <div className="text-purple-400 text-sm mb-1">Total Revenue</div>
            <div className="text-purple-200 text-2xl font-bold">
              ₹{orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 && !loading ? (
            <div className="text-center text-gray-400">
              <Package className="mx-auto w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
              <p>There are no orders to display at the moment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800/40 border border-gray-700 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-900/30 rounded-full p-3">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {formatDate(order.created_at)}
                        </span>
                        {isAdmin && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" /> User ID: {order.user}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <div className="text-sm text-gray-300">Total Amount</div>
                      <div className="text-2xl font-bold text-white flex items-center gap-1">
                        ₹{parseFloat(order.total_price).toLocaleString()}
                      </div>
                    </div>

                    {isAdmin && editingStatus === order.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          className="px-3 py-2 border-2 border-gray-600 bg-gray-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-white"
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
                          className="p-2 text-white hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(order.status)}`}
                        >
                          {updatingStatus === order.id ? "Updating..." : order.status}
                        </span>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setEditingStatus(order.id)}
                              disabled={updatingStatus === order.id || deletingOrder === order.id}
                              className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                              title="Change Status"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={updatingStatus === order.id || deletingOrder === order.id}
                              className="p-2 text-red-500 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
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
                      className="p-2 hover:bg-gray-700/30 rounded-lg transition-colors"
                    >
                      {expandedOrders[order.id] ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-6 pb-4 flex items-center gap-2 text-sm text-gray-300 bg-gray-900/20 rounded-b-2xl">
                  <Package className="w-4 h-4" />
                  <span>
                    {order.items.length} item(s) • {order.items.reduce((sum, item) => sum + item.quantity, 0)} book(s) total
                  </span>
                </div>

                {/* Expanded Items */}
                {expandedOrders[order.id] && (
                  <div className="border-t border-gray-700 bg-gray-900/20 p-6 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800/50 rounded-xl p-4 flex gap-4 shadow-md border border-gray-700"
                      >
                        <img
                          src={item.book.cover_image}
                          alt={item.book.title}
                          className="w-20 h-28 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="112" viewBox="0 0 80 112"%3E%3Crect fill="%234b5563" width="80" height="112"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%238b9299"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1">{item.book.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">by {item.book.author}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full font-medium">
                              {item.book.category_name}
                            </span>
                            <span className="text-gray-300">ISBN: {item.book.isbn}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300 mb-1">Quantity</div>
                          <div className="text-xl font-bold text-white mb-2">{item.quantity}</div>
                          <div className="text-sm text-gray-300">Price</div>
                          <div className="text-lg font-bold text-blue-400">₹{parseFloat(item.price).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagementUI;
