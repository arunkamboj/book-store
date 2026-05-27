module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  if (!req.user) {
    return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
  }

  return res.status(403).render("404", {
    pageTitle: "Access denied",
    path: "/403",
  });
};
