import Ticket from "../models/ticket-model.js";

//create ticket
const createTickets = async (req, res) => {
  const userId = req.user._id;
  const { title, description, status, priority, assignedTo } = req.body;

  // check if all fields are presents
  if (!title || !description || !status || !priority || !assignedTo) {
    return res.status(404).json({ message: "All fields are required" });
  }

  //valid Status. check is user has sent right status
  const validStatuses = ["open", "in-progress", "closed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const checkTickets = await Ticket.findOne({ title });
    if (checkTickets) {
      return res.status(404).json({ message: "ticket already exits" });
    }

    const ticket = new Ticket({
      title,
      description,
      status,
      priority,
      createdBy: userId,
      assignedTo,
    });

    const newTicket = await ticket.save();
    res.status(201).send({ message: "New Ticket Created", ticket: newTicket });
  } catch (error) {
    console.log("error in creating Ticket", error.message);
    res.status(500).send({ message: "can not create a new Ticket" });
  }
};

//get all tickets
const getAllTicket = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //Filtering
    const { status, priority, assignedTo } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const search = req.query.search || "";
    console.log("search :" ,search)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const totalTickets = await Ticket.countDocuments(filter);

    // count total documents
    const allTickets = await Ticket.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "allTickets",
      data: allTickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: page,  
      totalTickets,
    });

  } catch (error) {
    console.log("Error in getting all users", error);
    res.status(500).json({ message: "Interval Server Error" });
  }
};

//get logged-in user's tickets
const getUserTickets = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ message: "user is not valid" });
  }

  const userTickets = await Ticket.find({ createdBy: userId })
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role");

  res.status(200).json({ data: userTickets });
};

//get single ticket
const getTicket = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "id is not defined" });

  try {
    const ticket = await Ticket.findById(id);
    res.status(200).json({ data: ticket });
  } catch (error) {
    console.log("can not get ticket", error);
    res.status(500).json({ message: "can not get ticket" });
  }
};

//delete a ticket
const deleteTicket = async (req, res) => {
  const {role} = req.user;
  const { id } = req.params;
  const userId = req.user._id;

  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    // Find ticket created by the logged-in user
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized" });
    }

    const isOwner = ticket.createdBy.toString() === userId.toString();
    const isAgent = role === "agent";
    console.log(isAgent)

    if (!isOwner && !isAgent) {
      return res.status(403).json({ 
        message: "Unauthorized: Only ticket owners or agents can update tickets" 
      });
    }

    //delete ticket
    await Ticket.findByIdAndDelete(id);

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update a ticket
const updateTicket = async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  const { title, description, status, priority, assignedTo } = req.body;

  if (!title || !description || !status || !priority || !assignedTo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if status is valid
  const validStatuses = ["open", "in-progress", "closed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    // Check if ticket exists and belongs to the user
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isOwner = ticket.createdBy.toString() === userId.toString();
    const isAgent = role === "agent";
    console.log(isAgent)

    if (!isOwner && !isAgent) {
      return res.status(403).json({ 
        message: "Unauthorized: Only ticket owners or agents can update tickets" 
      });
    }
    // Update the ticket
    ticket.title = title;
    ticket.description = description;
    ticket.status = status;
    ticket.priority = priority;
    ticket.assignedTo = assignedTo;

    await ticket.save();

    res.status(200).json({ message: "Ticket updated successfully" });
  } catch (error) {
    console.error("Error updating ticket:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ticketController = {
  createTickets,
  getAllTicket,
  getTicket,
  deleteTicket,
  updateTicket,
  getUserTickets,
};

export default ticketController;
