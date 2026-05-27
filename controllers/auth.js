const User = require("../models/user");
const auth = require("../util/auth");

const redirectTarget = (req) => {
  const target = req.body.returnTo || req.query.returnTo || "/";

  if (!target.startsWith("/") || target.startsWith("//")) {
    return "/";
  }

  return target;
};

const renderLogin = (res, data = {}) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: data.errorMessage,
    email: data.email || "",
    returnTo: data.returnTo || "/",
  });
};

exports.getLogin = (req, res, next) => {
  renderLogin(res, { returnTo: req.query.returnTo });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const returnTo = redirectTarget(req);

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user || !auth.verifyPassword(password, user.passwordHash)) {
        return renderLogin(res, {
          errorMessage: "Invalid email or password.",
          email,
          returnTo,
        });
      }

      auth.setAuthCookie(res, auth.createToken(user));
      res.redirect(returnTo);
    })
    .catch((error) => {
      console.log("Login error", error);
      next(error);
    });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Create Account",
    path: "/signup",
    errorMessage: null,
    name: "",
    email: "",
    returnTo: req.query.returnTo || "/",
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const returnTo = redirectTarget(req);

  if (!name || !email || !password || password.length < 6) {
    return res.render("auth/signup", {
      pageTitle: "Create Account",
      path: "/signup",
      errorMessage: "Please enter a name, email, and a password of at least 6 characters.",
      name,
      email,
      returnTo,
    });
  }

  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res.render("auth/signup", {
          pageTitle: "Create Account",
          path: "/signup",
          errorMessage: "An account with this email already exists.",
          name,
          email,
          returnTo,
        });
      }

      return User.create({
        name,
        email,
        passwordHash: auth.hashPassword(password),
        isAdmin: false,
      });
    })
    .then((user) => {
      if (!user || !user.createCart) {
        return;
      }

      return user.createCart().then(() => {
        auth.setAuthCookie(res, auth.createToken(user));
        res.redirect(returnTo);
      });
    })
    .catch((error) => {
      console.log("Signup error", error);
      next(error);
    });
};

exports.postLogout = (req, res, next) => {
  auth.clearAuthCookie(res);
  res.redirect("/");
};
