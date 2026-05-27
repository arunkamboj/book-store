const path = require("path");
const shopController = require("../controllers/shop");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/collections", shopController.getCollections);

router.get("/product-list", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.post("/products/:productId/reviews", isAuth, shopController.postReview);

router.get("/profile", isAuth, shopController.getProfile);

router.post("/profile", isAuth, shopController.postProfile);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/cart-update-item", isAuth, shopController.postCartUpdateProduct);

router.get("/address", isAuth, shopController.getAddress);

router.post("/checkout", isAuth, shopController.postCheckout);

router.post("/paypal/create-order", isAuth, shopController.postPaypalCreateOrder);

router.post("/paypal/capture-order", isAuth, shopController.postPaypalCaptureOrder);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
