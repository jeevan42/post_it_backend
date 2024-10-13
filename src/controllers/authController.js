const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user)
            return res
                .status(400)
                .json({ message: "User already exists", code: 400 });

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({
            data: { token: token, id: user._id },
            message: "Your account created successfully",
            code: 200,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", code: 500 });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ message: "Invalid credentials", code: 400 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ message: "Invalid credentials", code: 400 });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ data: { token: token, id: user._id }, code: 200 });
    } catch (error) {
        res.status(500).json({ message: "Server error", code: 500 });
    }
};
