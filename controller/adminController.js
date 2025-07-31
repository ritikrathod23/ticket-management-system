import User from "../models/user-model.js";


const getUsers = async (req, res) =>{

    try {
        const allUser = await User.find()
        res.status(200).json(allUser)
        
    } catch (error) {
        console.log("can not get users", error)
        res.status(500).json({message: "can not get users"})
    }
}


const changeUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const validRoles = ["user", "agent", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: `User role updated to '${role}' successfully.` });

  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ message: `User is now ${user.isActive ? "active" : "inactive"}.` });

  } catch (error) {
    console.error("Error toggling user status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const adminController = {getUsers, changeUserRole, toggleUserStatus}

export default adminController;