const sendEmail = require("../../config/emailConfig");

const resetpassword = async (req, res) => {
  try {
    sendEmail();
    res.status(200).json({ message: "mail send successfully!!" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  resetpassword,
};
