const { getuser } = require("../service/auth.js");

function authenticatedUser(req, res, next) {
  const token = req.cookies.tokenname;
  console.log(token);

  if (!token) return res.status(401).send("Access Denied");

  try {
    const user = getuser(token); // this will verify the token and return a promise with the user object or null if token is invalid
    req.user = user;
    console.log(
      "This is the middleware to check whether the user has a valid token or not.."
    );
    console.log(req.user);
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = {
  authenticatedUser: authenticatedUser,
};
