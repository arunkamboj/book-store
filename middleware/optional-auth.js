const User = require("../models/user");
const auth = require("../util/auth");

module.exports = (req, res, next) => {
  const cookies = auth.parseCookies(req.headers.cookie);
  const payload = auth.verifyToken(cookies[auth.TOKEN_COOKIE]);

  res.locals.isLoggedIn = false;
  res.locals.isAdmin = false;
  res.locals.currentUser = null;

  if (!payload) {
    req.user = null;
    return next();
  }

  User.findByPk(payload.sub)
    .then((user) => {
      if (!user) {
        auth.clearAuthCookie(res);
        req.user = null;
        return next();
      }

      req.user = user;
      res.locals.isLoggedIn = true;
      res.locals.isAdmin = !!user.isAdmin;
      res.locals.currentUser = user;

      return user.getCart().then((cart) => {
        if (cart) {
          return cart;
        }
        return user.createCart();
      });
    })
    .then(() => next())
    .catch((error) => {
      console.log("Auth middleware error", error);
      next(error);
    });
};
