const User = require("../../schema/userRegister.schema");

const UserProfile = async (req, res) => {
  try {
    const result = await User.findById(req.id);

    res.status(200).json({
      result,
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  UserProfile,
};
