import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    isbn: "",
    description: "",
    category: "",
    cover_image: null,
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/books-store/categories/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => setMessage("Error fetching categories"))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover_image") {
      setFormData({ ...formData, cover_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) payload.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/books-store/books/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // match your backend
          },
        }
      );
      setMessage("Book added successfully!");
      setFormData({
        title: "",
        author: "",
        price: "",
        isbn: "",
        description: "",
        category: "",
        cover_image: null,
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error.response ? JSON.stringify(error.response.data) : error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-16 px-6 flex justify-center">
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-12 py-12 text-center">
          <h2 className="text-4xl font-extrabold text-white">Add New Book</h2>
          <p className="text-gray-300 mt-3 text-lg">
            Fill in the details to add a new book to your catalog
          </p>
        </div>

        {/* Form */}
        <div className="p-12 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.includes("Error")
                  ? "bg-red-800 border-red-700 text-red-300"
                  : "bg-green-800 border-green-700 text-green-300"
              } shadow-sm`}
            >
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-3 ${
                    message.includes("Error") ? "bg-red-400" : "bg-green-400"
                  }`}
                ></div>
                {message}
              </div>
            </div>
          )}

          {/* Input fields */}
          {[
            {
              label: "Book Title",
              name: "title",
              type: "text",
              placeholder: "Enter book title",
            },
            {
              label: "Author",
              name: "author",
              type: "text",
              placeholder: "Enter author name",
            },
            {
              label: "Price",
              name: "price",
              type: "number",
              placeholder: "Enter price",
              step: "0.01",
            },
            {
              label: "ISBN",
              name: "isbn",
              type: "text",
              placeholder: "Enter ISBN",
            },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="block text-sm font-semibold text-gray-200">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                step={field.step}
                required
                className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          ))}

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your book..."
              required
              className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 bg-gray-800 text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 bg-gray-800 text-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="cover_image"
              onChange={handleChange}
              accept="image/*"
              required
              className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-600"
            />
            {formData.cover_image && (
              <p className="text-sm text-gray-300 mt-2">
                Selected: {formData.cover_image.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full bg-gradient-to-r from-purple-700 to-pink-600 text-white py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Add Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
