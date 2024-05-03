function dummy(req, res, next) {
  console.log("dummy middleware that runs for all routes");
  next();
}

module.exports = {
  dummy: dummy,
};
