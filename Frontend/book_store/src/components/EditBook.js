import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditBook({ onSuccess, onCancel }) {
  const { id: bookId } = useParams();
//   console.log(data);a
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error fetching categories");
      })
      .finally(() => {
        setLoadingCategories(false);
      });

    // Fetch book data
    fetch(`http://localhost:8000/api/books-store/books/${bookId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      .catch((err) => {
        console.error(err);
        setMessage("Error fetching book details");
      })
      .finally(() => {
        setLoadingBook(false);
      });
  }, [bookId]);

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

    // Only append fields that have values
    Object.keys(formData).forEach((key) => {
      if (key === "cover_image" && formData[key]) {
        // Only append cover_image if a new file was selected
        payload.append(key, formData[key]);
      } else if (key !== "cover_image" && formData[key]) {
        payload.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/books-store/books/${bookId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Book updated successfully!");

        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(data);
          }, 1500);
        }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Edit Book</h2>
            <p className="text-blue-100 mt-2">
              Update the book details in your catalog
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
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Cover Image */}
            {currentCoverImage && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Cover Image
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <img
                    src={currentCoverImage}
                    alt="Current cover"
                    className="h-48 w-auto object-cover rounded-lg mx-auto"
                  />
                </div>
              </div>
            )}

            {/* New Cover Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Update Cover Image
                <span className="text-gray-500 font-normal ml-2 text-xs">
                  (optional - leave empty to keep current image)
                </span>
              </label>
              <input
                type="file"
                name="cover_image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.cover_image && (
                <p className="text-sm text-gray-600 mt-2">
                  New image selected: {formData.cover_image.name}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Book"}
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

export default EditBook;
