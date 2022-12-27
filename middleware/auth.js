const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[1]
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = await jwt.verify(token, "fake-jwt-secret");
      if (!decode) {
        res.status(498).send({status: 409, message:"Session is Experied" });
        return;
      }

      next();
    } catch (error) {
      res.status(498).send({status: 409, message:"Session is Experied" });
    }
  }
};

module.exports = auth;
