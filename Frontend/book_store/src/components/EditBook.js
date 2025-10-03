import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditBook({ onSuccess, onCancel }) {
  const { id: bookId } = useParams();
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
  const [currentCoverImage, setCurrentCoverImage] = useState("");
  const [message, setMessage] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBook, setLoadingBook] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories and book data
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch categories
    fetch("http://localhost:8000/api/books-store/categories/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setMessage("Error fetching categories"))
      .finally(() => setLoadingCategories(false));

    // Fetch book data
    fetch(`http://localhost:8000/api/books-store/books/${bookId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((book) => {
        setFormData({
          title: book.title,
          author: book.author,
          price: book.price,
          isbn: book.isbn,
          description: book.description,
          category: book.category.id || book.category,
          cover_image: null,
        });
        setCurrentCoverImage(book.cover_image);
      })
      .catch(() => setMessage("Error fetching book details"))
      .finally(() => setLoadingBook(false));
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover_image") setFormData({ ...formData, cover_image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "cover_image" && formData[key]) payload.append(key, formData[key]);
      else if (key !== "cover_image" && formData[key]) payload.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/books-store/books/${bookId}/`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: payload }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Book updated successfully!");
        if (onSuccess) setTimeout(() => onSuccess(data), 1500);
      } else {
        const errorData = await response.json();
        setMessage("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBook || loadingCategories) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 px-6 flex justify-center">
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-12 py-12 text-center">
          <h2 className="text-4xl font-extrabold text-white">Edit Book</h2>
          <p className="text-gray-300 mt-3 text-lg">Update the book details in your catalog</p>
        </div>

        {/* Form */}
        <div className="p-12 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.includes("Error") ? "bg-red-800 border-red-700 text-red-300" : "bg-green-800 border-green-700 text-green-300"
              } shadow-sm`}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${message.includes("Error") ? "bg-red-400" : "bg-green-400"}`}></div>
                {message}
              </div>
            </div>
          )}

          {/* Input fields */}
          {[
            { label: "Book Title", name: "title", type: "text", placeholder: "Enter book title" },
            { label: "Author", name: "author", type: "text", placeholder: "Enter author name" },
            { label: "Price", name: "price", type: "number", placeholder: "Enter price", step: "0.01" },
            { label: "ISBN", name: "isbn", type: "text", placeholder: "Enter ISBN" },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="block text-sm font-semibold text-gray-200">{field.label} <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-gray-200">Description <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-gray-200">Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 bg-gray-800 text-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          {/* Current Cover Image */}
          {currentCoverImage && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Current Cover Image</label>
              <div className="border border-gray-700 rounded-lg p-4">
                <img src={currentCoverImage} alt="Current cover" className="h-48 w-auto object-cover rounded-lg mx-auto" />
              </div>
            </div>
          )}

          {/* New Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">
              Update Cover Image
              <span className="text-gray-400 font-normal ml-2 text-xs">(optional - leave empty to keep current)</span>
            </label>
            <input
              type="file"
              name="cover_image"
              onChange={handleChange}
              accept="image/*"
              className="w-full px-5 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-700 file:text-white hover:file:bg-purple-600"
            />
            {formData.cover_image && <p className="text-sm text-gray-300 mt-2">New image selected: {formData.cover_image.name}</p>}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-700 text-gray-200 py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 bg-gradient-to-r from-purple-700 to-pink-600 text-white py-3 px-6 rounded-full font-bold shadow-xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Updating..." : "Update Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBook;
