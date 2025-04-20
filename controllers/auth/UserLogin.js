const jwt = require("jsonwebtoken");
const User = require("../../schema/userRegister.schema");
const { is_match } = require("node-data-cryption");

const UserLogin = async (req, res) => {
  try {

    const result = await User.findOne({email:req.body.email});

    if (result) {
       
      console.log(req.body.password);

      const is_same = is_match(
        req.body.password,
        result.password[1],
        result.password[0]
      );

      console.log(is_same); 

      if (is_same) {
        const accessToken = jwt.sign(
          { email: req.body.email, role: result.role },
          "someswar@2001",
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { email: req.body.email, role: result.role },
          "someswar@2001",
          { expiresIn: "25d" }
        );

        res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: {
            name: result.name,
            role: result.role,
            phone_number: result.phone_number,
            email: result.email,
          },
          status:200,
          message: "Login successful",
        });
      } else {
        res.status(200).json({ message: "Invalid credentials",status:400 });
      }
    } else {
      return res.status(200).json({ message: "User not found",status:400 });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:err})
  }
};

module.exports = {
  UserLogin
};
