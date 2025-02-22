# forCompHUB
 
CompHUB E-commerce Backend
This repository contains the backend code for the CompHUB e-commerce platform. It is built using Node.js and Express.js, and uses MongoDB as the database.

Functionality
The CompHUB backend provides the following functionality:

User Authentication and Authorization:

Users can register with a username, email, and password.
Users can log in and log out.
JWT (JSON Web Tokens) are used for secure authentication.
Different user roles (admin, user) are supported.
Product Management:

Products are categorized (e.g., monitors, mice, keyboards).
Admins can perform CRUD operations on products:
Create new products with details like name, price, image, and specifications.
Read/view product details.
Update existing product information.
Delete products.
Shopping Cart:

Users can add products to their cart.
Users can update product quantities in their cart.
Users can remove products from their cart.
The cart persists across sessions for logged-in users.
Order Management:

Users can place orders from their cart.
Order details are stored, including user, items, total, and status.
Users can view their order history.
Admin Dashboard:

Admins have access to a dedicated dashboard.
Admins can manage users (CRUD operations).
Admins can manage products (as described above).
Admins can view and manage orders.
Purpose
The main purpose of this project is to provide a robust and scalable backend system for the CompHUB e-commerce platform. It handles user data, product information, and order processing securely and efficiently. The backend aims to:

Provide a seamless shopping experience for users.
Enable efficient management of products and orders for administrators.
Ensure data security and integrity.
Be easily maintainable and extensible for future growth.