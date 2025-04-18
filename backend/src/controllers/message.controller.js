import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsersInSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersInSidebar", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, receiver: receiverId },
                { sender: receiverId, receiver: loggedInUserId },
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;

        let imageURL;
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}