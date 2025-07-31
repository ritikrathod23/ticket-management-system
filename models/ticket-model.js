import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "resolved", "closed"],
        default: "open",
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
		ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
		ref: "User",
        required: true,
    },
},{timestamps : true});


const Ticket = mongoose.model("ticket", ticketSchema);

export default Ticket;

