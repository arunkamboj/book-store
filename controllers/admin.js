const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: {},
  });
};

exports.getEditProduct = (req, res, next) => {
  // const editMode = req.query.edit;
  // if (!editMode){
  //   return res.redirect('/')
  // }
  const productId = req.params.productId;
  req.user.getProducts({ where: {id: productId} })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: true,
        product: product,
      });
    })
    .catch((error) => {
      console.log("Error in Admin Controller, getEditProduct: {}", error);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const stock = req.body.stock;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  req.user
    .createProduct({
      title: title,
      category: category || "Books",
      stock: stock || 0,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log("Product Created");
      res.redirect("/admin/product-list");
    })
    .catch((error) => {
      console.log("Error in Admin Controller, postAddProduct: {}", error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.findByPk(id)
    .then((product) => {
      product.title = req.body.title;
      product.category = req.body.category || "Books";
      product.stock = req.body.stock || 0;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      product.price = req.body.price;
      return product.save();
    })
    .then((result) => {
      console.log("Product updated successfully");
      res.redirect("/admin/product-list");
    })
    .catch((error) =>
      console.log("Error in Admin Controller, postEditProduct: {}", error)
    );
};

exports.getOrders = (req, res, next) => {
  Order.findAll({
    include: [
      { model: Product },
      { model: User },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((orders) => {
      res.render("admin/orders", {
        pageTitle: "Manage Orders",
        path: "/admin/orders",
        orders,
      });
    })
    .catch((error) =>
      console.log("Error in Admin Controller, getOrders: {}", error)
    );
};

exports.postUpdateOrderStatus = (req, res, next) => {
  Order.findByPk(req.body.orderId)
    .then((order) => {
      if (!order) {
        return res.redirect("/admin/orders");
      }

      order.status = req.body.status || order.status;
      return order.save();
    })
    .then(() => res.redirect("/admin/orders"))
    .catch((error) =>
      console.log("Error in Admin Controller, postUpdateOrderStatus: {}", error)
    );
};

exports.getUsers = (req, res, next) => {
  User.findAll({ order: [["createdAt", "DESC"]] })
    .then((users) => {
      res.render("admin/users", {
        pageTitle: "Manage Users",
        path: "/admin/users",
        users,
      });
    })
    .catch((error) =>
      console.log("Error in Admin Controller, getUsers: {}", error)
    );
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render("admin/product-list", {
        pageTitle: "Admin Products",
        path: "/admin/product-list",
        prods: products,
        hasProducts: products.length > 0,
      });
    })
    .catch((error) =>
      console.log("Error in Admin Controller, getProducts: {}", error)
    );
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
    .then((product) => {
      product.destroy();
    })
    .then((result) => {
      (result) => console.log("destroyed successfully", result);
      res.redirect("/admin/product-list");
    })
    .catch((error) =>
      console.log("Error in Admin Controller, deleteProduct: {}", error)
    );
};
