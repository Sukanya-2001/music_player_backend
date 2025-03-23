const User = require("../../schema/userRegister.schema");
const { encryption, is_match } = require("node-data-cryption");

const UserRegister = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: encryption(req.body.password, 16)
    });

    const user = await newUser.save();

    res
      .status(201) 
      .json({message: "User is created successfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports={ 
    UserRegister
}