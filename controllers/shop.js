const https = require("https");
const Sequelize = require("sequelize");
const Product = require("../models/product");
const Review = require("../models/review");
const User = require("../models/user");

const ERROR_PREFIX = "In shop controller, ";
const Op = Sequelize.Op;
const PRODUCTS_PER_PAGE = 8;

const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

const formatAmount = (amount) => Number(amount || 0).toFixed(2);

const getCartProducts = (req) => {
  return req.user.getCart().then((cart) => {
    return cart.getProducts().then((products) => ({ cart, products }));
  });
};

const getCartTotal = (products) => {
  return products.reduce((total, product) => {
    return total + Number(product.price) * Number(product.cartItem.quantity);
  }, 0);
};

const getProductFilter = (query) => {
  const where = {};

  if (query.q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.q}%` } },
      { description: { [Op.like]: `%${query.q}%` } },
      { category: { [Op.like]: `%${query.q}%` } },
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};

    if (query.minPrice) {
      where.price[Op.gte] = Number(query.minPrice);
    }
    if (query.maxPrice) {
      where.price[Op.lte] = Number(query.maxPrice);
    }
  }

  if (query.stock === "in") {
    where.stock = { [Op.gt]: 0 };
  }

  return where;
};

const getProductSort = (sort) => {
  switch (sort) {
    case "price-low":
      return [["price", "ASC"]];
    case "price-high":
      return [["price", "DESC"]];
    case "name":
      return [["title", "ASC"]];
    case "stock":
      return [["stock", "DESC"]];
    case "newest":
    default:
      return [["createdAt", "DESC"]];
  }
};

const getProductCategories = () => {
  return Product.findAll({
    attributes: ["category"],
    group: ["category"],
    order: [["category", "ASC"]],
  }).then((products) => products.map((product) => product.category).filter(Boolean));
};

const getPaginationUrl = (query, page) => {
  const params = new URLSearchParams();

  Object.keys(query).forEach((key) => {
    if (key !== "page" && query[key]) {
      params.set(key, query[key]);
    }
  });
  params.set("page", page);

  return `/collections?${params.toString()}`;
};

const renderCollection = (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = PRODUCTS_PER_PAGE;
  const offset = (page - 1) * limit;
  const where = getProductFilter(req.query);

  Promise.all([
    Product.findAndCountAll({
      where,
      order: getProductSort(req.query.sort),
      limit,
      offset,
    }),
    getProductCategories(),
  ])
    .then(([result, categories]) => {
      const totalPages = Math.max(1, Math.ceil(result.count / limit));

      res.render("shop/collection", {
        prods: result.rows,
        pageTitle: "Collections",
        path: "/collections",
        hasProducts: result.rows.length > 0,
        categories,
        selectedCategory: req.query.category || "",
        searchTerm: req.query.q || "",
        selectedSort: req.query.sort || "newest",
        selectedStock: req.query.stock || "",
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || "",
        currentPage: page,
        totalPages,
        totalProducts: result.count,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPageUrl: getPaginationUrl(req.query, page + 1),
        previousPageUrl: getPaginationUrl(req.query, page - 1),
        pageUrls: Array.from({ length: totalPages }, (_, index) => ({
          number: index + 1,
          url: getPaginationUrl(req.query, index + 1),
        })),
      });
    })
    .catch((error) => {
      console.log("In shop controller, renderCollection: {}", error);
    });
};

const buildAddress = (body) => ({
  customerName: body.customerName,
  addressLine1: body.addressLine1,
  addressLine2: body.addressLine2 || "",
  city: body.city,
  state: body.state,
  postalCode: body.postalCode,
  country: body.country || "US",
  phone: body.phone || "",
});

const hasAddress = (address) => {
  return Boolean(
    address.customerName &&
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country
  );
};

const renderAddress = (res, products, errorMessage) => {
  res.render("shop/address", {
    pageTitle: "Shipping Address",
    path: "/address",
    products,
    total: getCartTotal(products),
    errorMessage,
    address: {},
  });
};

const paypalRequest = (method, urlPath, body, accessToken) => {
  const data = body ? JSON.stringify(body) : "";
  const url = new URL(urlPath, paypalBaseUrl);

  const options = {
    method,
    hostname: url.hostname,
    path: `${url.pathname}${url.search}`,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let responseBody = "";

      response.on("data", (chunk) => {
        responseBody += chunk;
      });

      response.on("end", () => {
        const parsedBody = responseBody ? JSON.parse(responseBody) : {};

        if (response.statusCode >= 400) {
          const error = new Error(parsedBody.message || "PayPal request failed");
          error.details = parsedBody;
          return reject(error);
        }

        resolve(parsedBody);
      });
    });

    request.on("error", reject);
    request.write(data);
    request.end();
  });
};

const getPaypalAccessToken = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Promise.reject(
      new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in .env")
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const data = "grant_type=client_credentials";
  const url = new URL("/v1/oauth2/token", paypalBaseUrl);

  const options = {
    method: "POST",
    hostname: url.hostname,
    path: url.pathname,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let responseBody = "";

      response.on("data", (chunk) => {
        responseBody += chunk;
      });

      response.on("end", () => {
        const parsedBody = responseBody ? JSON.parse(responseBody) : {};

        if (response.statusCode >= 400) {
          const error = new Error(parsedBody.error_description || "PayPal auth failed");
          error.details = parsedBody;
          return reject(error);
        }

        resolve(parsedBody.access_token);
      });
    });

    request.on("error", reject);
    request.write(data);
    request.end();
  });
};

exports.getProducts = (req, res, next) => {
  res.redirect(`/collections${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`);
};

exports.getCollections = (req, res, next) => {
  renderCollection(req, res);
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId, {
    include: [{ model: Review, include: [User] }],
    order: [[Review, "createdAt", "DESC"]],
  })
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        reviews: product.reviews || [],
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => console.log("{} getProduct, {}", ERROR_PREFIX, error));
};

exports.getIndex = (req, res, next) => {
  Promise.all([
    Product.findAll({ where: getProductFilter(req.query) }),
    getProductCategories(),
  ])
    .then(([products, categories]) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        categories,
        selectedCategory: req.query.category || "",
        searchTerm: req.query.q || "",
      });
    })
    .catch((error) => {
      console.log("In shop controller, fetchAll: {}", error);
    });
};

exports.getCart = (req, res, next) => {
  getCartProducts(req)
    .then(({ products }) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/shop/cart",
        products,
        total: getCartTotal(products),
      });
    })
    .catch((error) => {
      console.log("Error in shop controller, getCart {}", error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      if (!product || product.stock < newQuantity) {
        return Promise.reject(new Error("Requested quantity is not available."));
      }

      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

exports.postCartUpdateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const quantity = Math.max(1, Number(req.body.quantity || 1));

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return;
      }

      if (quantity > product.stock) {
        product.cartItem.quantity = product.stock;
      } else {
        product.cartItem.quantity = quantity;
      }

      return product.cartItem.save();
    })
    .then(() => res.redirect("/cart"))
    .catch((error) => console.log(error));
};

exports.getProfile = (req, res, next) => {
  res.render("shop/profile", {
    pageTitle: "Profile",
    path: "/profile",
    user: req.user,
  });
};

exports.postProfile = (req, res, next) => {
  req.user
    .update({
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2 || "",
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country || "US",
      phone: req.body.phone || "",
    })
    .then(() => res.redirect("/profile"))
    .catch((error) => console.log(error));
};

exports.postReview = (req, res, next) => {
  const productId = req.params.productId;
  const rating = Math.min(5, Math.max(1, Number(req.body.rating || 5)));
  const comment = req.body.comment;

  if (!comment) {
    return res.redirect(`/products/${productId}`);
  }

  Review.create({
    productId,
    userId: req.user.id,
    rating,
    comment,
  })
    .then(() => res.redirect(`/products/${productId}`))
    .catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};

exports.getAddress = (req, res, next) => {
  getCartProducts(req)
    .then(({ products }) => {
      if (products.length === 0) {
        return res.redirect("/cart");
      }

      res.render("shop/address", {
        pageTitle: "Shipping Address",
        path: "/address",
        products,
        total: getCartTotal(products),
        errorMessage: null,
        address: {
          customerName: req.user.name,
          addressLine1: req.user.addressLine1,
          addressLine2: req.user.addressLine2,
          city: req.user.city,
          state: req.user.state,
          postalCode: req.user.postalCode,
          country: req.user.country || "US",
          phone: req.user.phone,
        },
      });
    })
    .catch((error) => console.log(error));
};

exports.postCheckout = (req, res, next) => {
  const address = buildAddress(req.body);

  getCartProducts(req)
    .then(({ products }) => {
      if (products.length === 0) {
        return res.redirect("/cart");
      }

      if (!hasAddress(address)) {
        return res.render("shop/address", {
          pageTitle: "Shipping Address",
          path: "/address",
          products,
          total: getCartTotal(products),
          errorMessage: "Please fill in all required address fields.",
          address,
        });
      }

      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
        products,
        total: getCartTotal(products),
        address,
        paypalClientId: process.env.PAYPAL_CLIENT_ID || "",
        paypalCurrency: process.env.PAYPAL_CURRENCY || "USD",
      });
    })
    .catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"], order: [["createdAt", "DESC"]] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postPaypalCreateOrder = (req, res, next) => {
  const address = buildAddress(req.body);

  if (!hasAddress(address)) {
    return res.status(422).json({ message: "A complete shipping address is required." });
  }

  getCartProducts(req)
    .then(({ products }) => {
      if (products.length === 0) {
        return res.status(422).json({ message: "Your cart is empty." });
      }
      const unavailable = products.find((product) => product.cartItem.quantity > product.stock);
      if (unavailable) {
        return res.status(422).json({ message: `${unavailable.title} is not available in the requested quantity.` });
      }

      const total = getCartTotal(products);

      return getPaypalAccessToken().then((accessToken) => {
        return paypalRequest(
          "POST",
          "/v2/checkout/orders",
          {
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: process.env.PAYPAL_CURRENCY || "USD",
                  value: formatAmount(total),
                },
              },
            ],
          },
          accessToken
        );
      });
    })
    .then((paypalOrder) => {
      res.json({ id: paypalOrder.id });
    })
    .catch((error) => {
      console.log("PayPal create order error", error);
      res.status(500).json({ message: error.message || "Unable to create PayPal order." });
    });
};

exports.postPaypalCaptureOrder = (req, res, next) => {
  const paypalOrderId = req.body.orderID;
  const address = buildAddress(req.body);
  let fetchedCart;
  let fetchedProducts;
  let capturedOrder;

  if (!paypalOrderId || !hasAddress(address)) {
    return res.status(422).json({ message: "Missing PayPal order or address details." });
  }

  getCartProducts(req)
    .then(({ cart, products }) => {
      if (products.length === 0) {
        return res.status(422).json({ message: "Your cart is empty." });
      }
      const unavailable = products.find((product) => product.cartItem.quantity > product.stock);
      if (unavailable) {
        return res.status(422).json({ message: `${unavailable.title} is not available in the requested quantity.` });
      }

      fetchedCart = cart;
      fetchedProducts = products;

      return getPaypalAccessToken();
    })
    .then((accessToken) => {
      return paypalRequest(
        "POST",
        `/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        accessToken
      );
    })
    .then((paypalCapture) => {
      capturedOrder = paypalCapture;
      const payerEmail = paypalCapture.payer && paypalCapture.payer.email_address;
      const total = getCartTotal(fetchedProducts);

      return req.user.createOrder({
        ...address,
        totalAmount: total,
        status: "PAID",
        paymentId: paypalCapture.id,
        paymentStatus: paypalCapture.status,
        payerEmail,
      });
    })
    .then((order) => {
      return order.addProducts(
        fetchedProducts.map((product) => {
          product.orderItem = {
            quantity: product.cartItem.quantity,
            price: product.price,
          };
          return product;
        })
      );
    })
    .then(() => {
      return Promise.all(
        fetchedProducts.map((product) => {
          product.stock = Math.max(0, product.stock - product.cartItem.quantity);
          return product.save();
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.json({ status: capturedOrder.status, redirectUrl: "/orders" });
    })
    .catch((error) => {
      console.log("PayPal capture order error", error);
      res.status(500).json({ message: error.message || "Unable to capture PayPal order." });
    });
};

exports.postOrder = (req, res, next) => {
  res.redirect("/address");
};
