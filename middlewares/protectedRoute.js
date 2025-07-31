import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const protectedRoute = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'You must login first' });
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email: data.email }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectedRoute middleware:", err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectedRoute;
