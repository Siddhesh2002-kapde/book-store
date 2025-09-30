# Online Bookstore

An **e-commerce platform** for buying and selling books across multiple categories (Fiction, Non-Fiction, Academic), built with Django REST Framework for the backend and React.js (or HTML/CSS/JS) for the frontend.  

---

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup Instructions](#setup-instructions)  
- [API Endpoints](#api-endpoints)  
- [Database Models](#database-models)  
- [Security](#security)  
- [Responsive Design](#responsive-design)  
- [Documentation](#documentation)  
- [License](#license)  

---

## Features

### User Authentication
- **Signup:** Users can create accounts with email, password, and optional fields (name, phone).  
- **Login:** Secure login with email and password.  
- **Forgot Password:** Email-based password reset with a secure token.  
- **Logout:** Clear session and redirect to homepage.  

### Product Management (CRUD)
- **Add Products:** Admins can add books with title, author, price, description, ISBN, image, and category.  
- **Update Products:** Admins can edit book details.  
- **Delete Products:** Admins can remove books from inventory.  
- **List/View Products:** Users can view all books and filter by category or price.  

### Cart Management (CRUD)
- **Add to Cart:** Users can add books to their cart.  
- **Update Cart:** Modify item quantities.  
- **Remove from Cart:** Delete items from cart.  
- **View Cart:** Display items with total price.  

### Order Management (CRUD)
- **Place Orders:** Users can place orders from their cart.  
- **View Orders:** Users can see their order history; admins can view all orders.  
- **Update Orders:** Admins can update order status (pending, shipped, delivered).  
- **Delete Orders:** Admins can cancel or remove orders.  

### Responsive Design
- Mobile-friendly layout compatible across devices.  

### API Integration
- Full RESTful APIs using Django REST Framework.  

---

## Tech Stack
- **Frontend:** React.js (or HTML, CSS, JS, Bootstrap)  
- **Backend:** Django + Django REST Framework  
- **Database:** PostgreSQL (or MySQL)  
- **Authentication:** JWT / Token-based  
- **Documentation:** Swagger / Postman  

---

## Setup Instructions

### Backend
1. Clone the repository:
```bash
git clone <repo-url>
cd backend
