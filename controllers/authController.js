const User = require('../models/User');
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken } = require('../middleware/jwtUtils');

// Register a new user
exports.register = async (request,response) => {
    const {username,password} = request.body;
    try {
      const saltRounds = Number(process.env.SALTROUNDS);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newser = new User({
        username,password:hashedPassword,createdAt:new Date()
      });
      await newser.save();
      return response.status(200).json({msg:"user added"})
    } catch (error) {
      console.log(error.message)
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return res.status(404).json({ message: 'Username do not exist' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(404).json({ message: 'Wrong password' });
      }
      const { _id, role } = user;
      const accessToken = await signAccessToken(_id,role);
      const refreshToken = await signRefreshToken(_id,role);
      return res.status(200).json({
        success: true,
        message: "Success",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred during login' });
    }
  };
