const fs = require('fs');
const PDFDocument = require('pdfkit');

const outputPath = 'Project_Report_Aayush_Dangi_PrinterFriendly.pdf';
// Use A4 size and larger margins for printer-friendly output
const doc = new PDFDocument({ size: 'A4', margin: 72 });

// Helper functions
const addHeading = (text) => {
  doc.font('Helvetica-Bold').fontSize(18).fillColor('#0B3D91').text(text, { underline: false });
  doc.moveDown(0.5);
};

const addSubheading = (text) => {
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F4E79').text(text);
  doc.moveDown(0.3);
};

const addParagraph = (text) => {
  doc.font('Helvetica').fontSize(11).fillColor('#000000').text(text, { align: 'justify' });
  doc.moveDown(0.7);
};

const addList = (items) => {
  items.forEach((item) => {
    doc.font('Helvetica').fontSize(11).text(`• ${item}`, { paragraphGap: 2 });
  });
  doc.moveDown(0.7);
};

doc.pipe(fs.createWriteStream(outputPath));

// --- Printer-friendly Cover page (A4) ---
doc.rect(80, 90, doc.page.width - 160, 220).stroke('#000000');
doc.font('Times-Bold').fontSize(26).fillColor('#000000').text('PROJECT REPORT', { align: 'center' });
doc.moveDown(0.5);
doc.font('Times-Bold').fontSize(16).text('BookStore — E-Commerce Website', { align: 'center' });
doc.moveDown(2);

doc.font('Times-Roman').fontSize(12).text('College: Chandigarh University (Online)', { align: 'center' });
doc.moveDown(0.5);
doc.font('Times-Bold').fontSize(12).text('Name  : : ', { continued: true }).font('Times-Roman').text('Aayush Dangi', { align: 'center' });
doc.moveDown(0.2);
doc.font('Times-Bold').fontSize(12).text('Email  : ', { continued: true }).font('Times-Roman').text('aayushkamboj400@gmail.com', { align: 'center' });
doc.moveDown(0.2);
doc.font('Times-Bold').fontSize(12).text('Course : ', { continued: true }).font('Times-Roman').text('BCA-V2', { align: 'center' });
doc.moveDown(0.2);
doc.font('Times-Bold').fontSize(12).text('University ID : ', { continued: true }).font('Times-Roman').text('O23BCA110126', { align: 'center' });

doc.moveDown(2);
doc.font('Times-Italic').fontSize(11).text('Project Title: E-Commerce Website Development', { align: 'center' });

// Signature lines
doc.moveDown(6);
const leftSigX = 100;
const rightSigX = doc.page.width - 240;
doc.moveTo(leftSigX, doc.y).lineTo(leftSigX + 200, doc.y).stroke();
doc.text('Student Signature', leftSigX, doc.y + 5);
doc.moveTo(rightSigX, doc.y - 5).lineTo(rightSigX + 200, doc.y - 5).stroke();
doc.text('Guide Signature', rightSigX, doc.y + 5);

doc.addPage();

// --- Acknowledgement ---
addHeading('Acknowledgement');
addParagraph('Place your acknowledgement text here. Express gratitude to the project guide, faculty, and others who supported the work.');
doc.moveDown(4);
doc.text('Signature of Student: ____________________', { align: 'right' });

doc.addPage();

// --- Certificate (Annexure A) ---
addHeading('Certificate from Guide (Annexure A)');
addParagraph('This is to certify that this project entitled "E-Commerce Website Development" submitted in partial fulfillment of the degree of BCA to Chandigarh University (Online) done by Mr. Aayush Dangi, University ID O23BCA110126, is an authentic work carried out by him under my guidance. The matter embodied in this project work has not been submitted earlier for award of any degree or diploma to the best of my knowledge and belief.');
doc.moveDown(3);
doc.text('Signature of the Guide: ____________________', { align: 'right' });
doc.moveDown(1);
doc.text('Date: ____________________', { align: 'right' });

doc.addPage();

// --- Summary / Abstract (3 pages) ---
addHeading('Summary / Abstract');
addParagraph('Provide a concise 3-4 page summary of the project. Use this space to explain objective and implementation, methodology, hardware & software used, testing technologies, and contribution of the project.');
addSubheading('1. Project Title and Problem Statement');
addParagraph('Project: E-Commerce Website Development. Statement about the problem: Provide a platform to sell books online with cart, checkout, and order management.');
addSubheading('2. Why chosen');
addParagraph('Reason for choice: Practical relevance, web development learning, e-commerce domain familiarity.');
addSubheading('3. Objective and Scope');
addParagraph('Objective: Build a full-stack e-commerce site supporting customers and admin operations. Scope: Product listings, cart, checkout, PayPal integration, reviews, and admin controls.');
doc.addPage();
addSubheading('4. Methodology (summary)');
addParagraph('Methodology: Node.js + Express backend, EJS views, MySQL with Sequelize ORM. Development includes routing, controllers, middleware, and models.');
addSubheading('5. Hardware & Software');
addParagraph('Hardware: Development machine. Software: Node.js, MySQL, npm packages listed in package.json, PayPal sandbox.');
doc.addPage();
addSubheading('6. Testing & Contribution');
addParagraph('Testing: Manual functional testing, PayPal sandbox, CRUD operations, and form validation. Contribution: Demonstrates full-stack skills and an extensible e-commerce template.');

// --- Main Report (summary sections) ---
addHeading('BookStore E-Commerce Website');
addParagraph('This document describes the BookStore e-commerce web application developed as a BCA final year internship project by Aayush Dangi. The website is designed to demonstrate full-stack development skills by providing a complete shopping workflow, administrative capabilities, and secure user authentication.');

addSubheading('Student and Project Details');
addList([
  'Name : : Aayush Dangi',
  'Email: aayushkamboj400@gmail.com',
  'Course: BCA-V2',
  'University ID: O23BCA110126',
  'College: Chandigarh University (Online)',
  'Project Title: E-Commerce Website Development',
]);

addSubheading('Project Overview');
addParagraph('BookStore is a full-stack e-commerce platform built using Node.js, Express.js, MySQL, Sequelize, and EJS templates. It allows users to register, browse product collections, add items to a shopping cart, enter shipping details, complete checkout via PayPal sandbox payment integration, and view order history. The application also includes an admin panel for product, user, and order management.');

addSubheading('Key Features');
addList([
  'User registration and JWT-based login with cookie authentication',
  'Admin protected panel for managing products, stock, and orders',
  'Product browsing with search, category filtering, and collection view',
  'Sorting, price filters, stock filters, and pagination in collections',
  'Product detail pages with customer reviews',
  'Shopping cart with quantity update and remove options',
  'Checkout process with delivery address collection',
  'PayPal sandbox payment integration for order completion',
  'Order history with tracking and status details',
  'Responsive and professional frontend using HTML, CSS, JavaScript, and EJS',
]);

addSubheading('Technology Stack');
addList([
  'Backend: Node.js, Express.js',
  'Frontend: HTML, CSS, JavaScript, EJS',
  'Database: MySQL',
  'ORM: Sequelize',
  'Payment Gateway: PayPal Sandbox',
  'Authentication: JWT token stored in cookies',
  'Logging: Morgan',
  'Security: Helmet (commented but available)',
]);

addSubheading('Database Design');
addParagraph('The application uses several database tables to support e-commerce functionality. The primary entities include Users, Products, Carts, Cart Items, Orders, Order Items, and Reviews, enabling secure user handling, product storage, shopping cart persistence, order tracking, and review submission.');

addSubheading('Functional Modules');
addParagraph('The application is divided into customer-facing and admin-facing modules, each supporting distinct responsibilities and workflows.');

addSubheading('Customer Module');
addList([
  'Register a new account and login securely',
  'Browse product collections and search for items',
  'Filter products by category, price, stock availability, and sort order',
  'View detailed product pages and submit reviews',
  'Add products to cart and manage cart quantities',
  'Enter delivery address information before checkout',
  'Complete checkout using PayPal sandbox',
  'View order history and payment details',
]);

addSubheading('Admin Module');
addList([
  'Login with admin credentials',
  'Add, edit, and delete products',
  'Manage product categories and stock levels',
  'View all customer orders',
  'Update order status',
  'View registered users and manage user access',
]);

addSubheading('Usage Instructions');
addParagraph('To run the project, install dependencies using npm install and start the application with npm start. The default server port is 5000. Open the browser and navigate to http://localhost:5000. Ensure the MySQL database is configured correctly in the .env file with schema, username, password, and PayPal sandbox credentials.');

addSubheading('Environment Configuration');
addList([
  'DB_SCHEMA_NAME',
  'DB_USER_NAME',
  'DB_USER_PASSWORD',
  'DB_HOST_URL',
  'PORT',
  'JWT_SECRET',
  'DEFAULT_ADMIN_NAME',
  'DEFAULT_ADMIN_EMAIL',
  'DEFAULT_ADMIN_PASSWORD',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_BASE_URL',
  'PAYPAL_CURRENCY',
  'DB_SYNC_ALTER',
]);

addSubheading('Default Admin Credentials');
addParagraph('Email: aayushkamboj400@gmail.com');
addParagraph('Password: admin123');

addSubheading('Project Objective');
addParagraph('The primary objective is to develop a fully functional online shopping system that demonstrates essential web development concepts including RESTful routing, dynamic rendering, database interaction, authentication, payment integration, and admin management. It aims to deliver a practical solution suitable for an internship or final year project in BCA.');

addSubheading('Conclusion');
addParagraph('BookStore successfully demonstrates the core features of an e-commerce platform, combining customer shopping workflows and administrative controls. The project showcases skills in full-stack development and provides a strong foundation for future enhancements such as additional payment gateways, analytics dashboards, coupon modules, and mobile app support.');

const footerText = 'Project submitted by Aayush Dangi | BCA-V2 | Chandigarh University (Online) | University ID: O23BCA110126';
doc.moveDown(1);
doc.font('Helvetica-Oblique').fontSize(9).fillColor('#444444').text(footerText, { align: 'center' });

// --- DFD Placeholder Page ---
doc.addPage();
addHeading('Data Flow Diagram (DFD) - Level 0');
// Draw a simple DFD with rectangles and arrows
const yStart = doc.y + 20;
// External Entity - Customer
doc.rect(90, yStart, 120, 40).stroke();
doc.text('Customer', 90 + 20, yStart + 12);
// Process - Shop App
doc.rect(260, yStart - 10, 150, 60).stroke();
doc.text('Shop App', 260 + 45, yStart + 10);
// Data Store - Database
doc.rect(460, yStart, 120, 40).stroke();
doc.text('Database', 460 + 30, yStart + 12);
// Arrows
doc.moveTo(210, yStart + 20).lineTo(260, yStart + 20).stroke();
doc.moveTo(410, yStart + 20).lineTo(460, yStart + 20).stroke();
// Labels
doc.text('Browse/Add to Cart', 200, yStart - 10);
doc.text('Products/Orders', 360, yStart - 10);

// Finish
doc.addPage();
doc.font('Helvetica-Oblique').fontSize(9).fillColor('#444444').text(footerText, { align: 'center' });
doc.end();
console.log(`Generated PDF: ${outputPath}`);
// End of document
