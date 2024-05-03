function check(req, res, next) {
  const APIKEY = req.query.APIKEY;
  if (!APIKEY || APIKEY !== "manish") {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
}
module.exports = check;
