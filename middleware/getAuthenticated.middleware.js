const jwt = require("jsonwebtoken");
const User = require("../schema/userRegister.schema");

const getAuthenticated = async (req, res, next) => {
  try {
    const decodeToken = jwt.verify(req.cookies.refreshToken, "someswar@2001");
    const user = await User.findOne({ email: decodeToken.email });
    req.id = user._id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = getAuthenticated;
