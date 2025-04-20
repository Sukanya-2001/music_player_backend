const jwt = require("jsonwebtoken");
const User = require("../schema/userRegister.schema");

const getAuthenticated = async (req, res, next) => {
  try {
    console.log(req.cookies.refreshToken);
    const token = req.headers['x-access-token'] || req.headers['authorization'];


    console.log(token);
    
    const decodeToken = jwt.verify(token, "someswar@2001");
    const user = await User.findOne({ email: decodeToken.email });
    req.id = user._id;
    console.log(req.id);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = getAuthenticated;
