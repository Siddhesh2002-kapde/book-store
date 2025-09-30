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

  // Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token------------",token)
    axios
      .get("http://localhost:8000/api/books-store/categories/", {
        headers: {
          Authorization: `Bearer ${token}`, // or `Bearer ${token}` if using JWT
        },
      })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error fetching categories");
      })
      .finally(() => {
        setLoadingCategories(false);
      });
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

      const response = await axios.post(
        "http://localhost:8000/api/books-store/books/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // or `Bearer ${token}` for JWT
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
      if (error.response) {
        setMessage("Error: " + JSON.stringify(error.response.data));
      } else {
        setMessage("Error: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Add New Book</h2>
            <p className="text-blue-100 mt-2">
              Fill in the details to add a new Book to your catalog
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.includes("Error")
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
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

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Book Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter book title"
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Author <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Price <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter price"
                step="0.01"
                required
              />
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                ISBN <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter ISBN"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Describe your book..."
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Cover Image <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                name="cover_image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {formData.cover_image && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.cover_image.name}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Add Book"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          Make sure all required fields are filled out correctly
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
