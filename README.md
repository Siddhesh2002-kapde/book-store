# Bookstore Project

A full-stack **Bookstore web application** built with **Django REST Framework** (backend) and **React.js** (frontend). This project includes features like browsing books, user authentication, and an interactive API documentation using **Swagger**.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)

  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [API Documentation](#api-documentation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* Browse books by categories and authors.
* User authentication (register, login, password reset).
* Add, update, delete books (Admin only).
* Shopping cart functionality (optional).
* Interactive API documentation with **Swagger**.
* Fully responsive frontend built with **React.js**.

---

## Tech Stack

**Backend:**

* Python 3.x
* Django 4.x
* Django REST Framework
* Django REST Framework Simple JWT (for authentication)
* drf-yasg (Swagger API documentation)

**Frontend:**

* React.js
* React Router DOM
* Axios / Fetch API
* Tailwind CSS / Bootstrap (optional)

**Database:**

* PostgreSQL / SQLite

---

## Project Structure

```
backend/
├── bookstore/          # Django project folder
├── books/              # App for book management
├── users/              # App for user authentication
├── manage.py
├── requirements.txt
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # React pages
│   ├── context/        # Context API for state management
│   ├── App.js
│   └── index.js
```

---

## Installation

### Backend Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Create and activate virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Apply migrations:

```bash
python manage.py migrate
```

5. Create superuser (for admin access):

```bash
python manage.py createsuperuser
```

6. Run the development server:

```bash
python manage.py runserver
```

---

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start React development server:

```bash
npm start
```

Your frontend will run on `http://localhost:3000` and backend on `http://localhost:8000`.

---

## API Documentation

Swagger is enabled for the backend. After running the Django server, you can access the API docs at:

```
http://localhost:8000/swagger/
```

Here, you can see all available endpoints, send requests, and check responses interactively.

---

## Usage

* Browse books, add to cart, and manage orders (if implemented).
* Admin can manage books, categories, and users via Django admin panel:

```
http://localhost:8000/admin/
```

* API can be tested using Swagger or tools like Postman.

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit: `git commit -m "Description of changes"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License.
