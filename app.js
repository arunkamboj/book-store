require('dotenv').config();
const path = require("path");
const fs = require('fs');

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const Review = require("./models/review");
// const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const optionalAuth = require("./middleware/optional-auth");
const auth = require("./util/auth");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || "aayush";
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || "aayushkamboj400@gmail.com";
const demoProducts = [
  {
    title: "Mastering Node.js",
    category: "Programming",
    price: 899,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    description: "A practical guide for learning backend development with Node.js.",
  },
  {
    title: "Data Structures Handbook",
    category: "Academic",
    price: 649,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
    description: "Clear explanations of core data structures for computer science students.",
  },
  {
    title: "Modern Web Design",
    category: "Design",
    price: 749,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    description: "Frontend design concepts, layouts, and user interface patterns.",
  },
  {
    title: "Business Communication",
    category: "Business",
    price: 499,
    stock: 16,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    description: "Improve writing, presentations, and professional communication skills.",
  },
  {
    title: "The Fiction Shelf",
    category: "Fiction",
    price: 399,
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    description: "A reader-friendly fiction title for leisure and creative inspiration.",
  },
  {
    title: "Exam Stationery Kit",
    category: "Stationery",
    price: 199,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80",
    description: "Notebook, pens, sticky notes, and essential stationery for students.",
  },
  {
    title: "Database Systems",
    category: "Academic",
    price: 799,
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    description: "Learn SQL, normalization, indexing, and relational database design.",
  },
  {
    title: "JavaScript Essentials",
    category: "Programming",
    price: 599,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    description: "A beginner-friendly book for browser scripting and dynamic web apps.",
  },
];

const seedDemoCatalog = (user) => {
  return Product.findAll().then((products) => {
    const categoryCycle = ["Programming", "Academic", "Design", "Business", "Fiction", "Stationery"];
    const updates = products.map((product, index) => {
      const shouldUpdateCategory = !product.category || product.category === "Books";
      const changes = {};

      if (shouldUpdateCategory) {
        changes.category = categoryCycle[index % categoryCycle.length];
      }
      if (!product.stock || product.stock < 1) {
        changes.stock = 10 + index;
      }

      if (Object.keys(changes).length === 0) {
        return Promise.resolve(product);
      }

      return product.update(changes);
    });

    return Promise.all(updates).then(() => {
      const existingTitles = new Set(products.map((product) => product.title));
      const missingProducts = demoProducts.filter((product) => !existingTitles.has(product.title));

      if (products.length >= 8 || missingProducts.length === 0) {
        return null;
      }

      return Promise.all(missingProducts.map((product) => user.createProduct(product)));
    });
  });
};

// app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(optionalAuth);

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// One direction is enough
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

Review.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(Product);
Product.hasMany(Review);

// One direction is enough
User.hasOne(Cart);
Cart.belongsTo(User);

// One direction is enough
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// One direction is enough
Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem})

sequelize
  // .sync({ force: true })
  .sync({ alter: process.env.DB_SYNC_ALTER === "true" })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: defaultAdminName,
        email: defaultAdminEmail,
        passwordHash: auth.hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || "admin123"),
        isAdmin: true,
      });
    }
    const updates = {};
    if (user.isAdmin && user.name !== defaultAdminName) {
      updates.name = defaultAdminName;
    }
    if (user.isAdmin && user.email !== defaultAdminEmail) {
      updates.email = defaultAdminEmail;
    }
    if (!user.isAdmin && process.env.AUTO_ADMIN_USER !== "false") {
      updates.isAdmin = true;
    }
    if (!user.passwordHash) {
      updates.passwordHash = auth.hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || "admin123");
    }
    if (Object.keys(updates).length > 0) {
      return user.update(updates);
    }
    return user;
  })
  .then((user) => {
    return seedDemoCatalog(user).then(() => user.getCart().then((cart) => {
      if (cart) {
        return cart;
      }
      return user.createCart();
    }));
  })
  .then(cart => { 
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => console.log("APP error, {}", error));
