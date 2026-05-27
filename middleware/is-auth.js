module.exports = (req, res, next) => {
  if (req.user) {
    return next();
  }

  return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
};
