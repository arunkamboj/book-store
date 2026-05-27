# BookStore E-Commerce Website

BookStore is a full-stack e-commerce web application developed as a BCA major project. The system provides an online shopping experience where customers can register, browse products, add items to a cart, enter a delivery address, pay through PayPal sandbox, and track their orders.

The project also includes an admin panel for managing products, stock, users, and order status.

## Project Details

**Project Title:** E-Commerce Website Development  
**Student Name:** Aayush  
**Course:** BCA  
**Database:** MySQL  
**Backend:** Node.js, Express.js  
**Frontend:** HTML, CSS, JavaScript, EJS  

## Main Features

- User registration and JWT-based login
- Admin login and protected admin panel
- Product listing with search and category filtering
- Collection page with sorting, price filters, stock filter, and pagination
- Product details page with customer reviews
- Shopping cart with quantity update and remove option
- Address page before checkout
- PayPal sandbox payment integration
- Order history and order tracking
- Admin product add, edit, delete, stock management
- Admin order management with status update
- Admin user management
- Professional home page with slider, featured products, categories, header, and footer

## User Modules

### Customer

- Register a new account
- Login and logout securely
- Browse and search products
- Browse collections with category, price, stock, sorting, and pagination
- Add products to cart
- Update product quantity in cart
- Save profile and address details
- Checkout using PayPal sandbox
- View order history and payment details
- Add reviews on products

### Admin

- Login with admin account
- Add new products
- Edit product details
- Delete products
- Manage product category and stock
- View all orders
- Update order status
- View registered users

## Technology Stack

- **Node.js** for backend runtime
- **Express.js** for routing and server logic
- **EJS** for dynamic page rendering
- **MySQL** for database storage
- **Sequelize** as ORM
- **HTML, CSS, JavaScript** for frontend UI
- **PayPal Sandbox** for payment gateway testing
- **JWT Cookie Authentication** for secure login sessions

## Database Tables

The project uses these main database entities:

- Users
- Products
- Carts
- Cart Items
- Orders
- Order Items
- Reviews

## Environment Variables

Create a `.env` file in the project root:

```env
DB_SCHEMA_NAME=your_database_name
DB_USER_NAME=your_database_user
DB_USER_PASSWORD=your_database_password
DB_HOST_URL=localhost
PORT=5000

JWT_SECRET=replace_with_a_long_random_secret
DEFAULT_ADMIN_NAME=aayush
DEFAULT_ADMIN_EMAIL=aayushkamboj400@gmail.com
DEFAULT_ADMIN_PASSWORD=admin123

PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CURRENCY=USD

DB_SYNC_ALTER=true
```

Use `DB_SYNC_ALTER=true` once after adding new database fields. After the database is updated, set it to `false` or remove it.

## Default Admin Login

```text
Email: aayushkamboj400@gmail.com
Password: admin123
```

Change the password in `.env` before final deployment.

## How to Run

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npm start
```

Open the website:

```text
http://localhost:5000
```

If port 5000 is already busy, run:

```powershell
$env:PORT='5001'; npm start
```

## Testing Checklist

- Register a new customer account
- Login as customer
- Search and filter products
- Add products to cart
- Update cart quantity
- Fill address form
- Complete PayPal sandbox checkout
- Confirm order appears in order history
- Login as admin
- Add/edit/delete products
- Update product stock
- Manage orders
- View users

## Project Objective

The objective of this project is to build a practical online shopping system that demonstrates product management, customer authentication, cart handling, checkout, payment gateway integration, and order management using modern web development technologies.

## Future Enhancements

- Multiple payment gateways
- Product recommendation system
- Advanced analytics dashboard
- Coupon and discount module
- Delivery tracking module
- Mobile application support

## Conclusion

BookStore successfully demonstrates the working of an e-commerce platform with customer and admin functionality. It covers the main requirements of an online shopping website, including product browsing, authentication, cart, checkout, payment, reviews, and order management.
