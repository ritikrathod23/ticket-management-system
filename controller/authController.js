import express from "express"
import User from "../models/user-model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const validateRole = ['user', 'agent', 'admin']
        if(!validateRole.includes(role)){
            return res.status(400).json({ message: "Invalid role" });
        }

        //check  existing user
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).send("user already exist")

        bcrypt.genSalt(10, async (err, salt)=>{
            bcrypt.hash(password, salt, async function(err, hash) {
                const createAccount = await User.create({
                name,
                email,
                password: hash,
                isActive: true,
                role,
                })

                const token = jwt.sign({email: email, userid: User._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
                res
                .status(200).send({
                    message: "Account created successfully"
                })
            });
        })

        
        
    } catch (error) {
        console.log("Error in Signup controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }

}


const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email})
        if(!user) return res.status(500).send({message:"user not found"})
      
        bcrypt.compare(password, user.password , (err, isMatch) => {
            if(isMatch){
                const token = jwt.sign({email: email,role:user.role, userid: User._id}, process.env.SECRET_KEY)
                res.cookie("token", token)
                .status(200).send({user:{
                    _id : user.id,
                    name: user.name,
                    role: user.role
                }, message:"Login Success full"})
                } 
            else return res.status(500).send({message:"Invalid Password"})
        }) 
    } catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).sent({message: "Internal server error"})
    }
    
}

const authController = { register, login}
export default authController;