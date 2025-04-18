import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
    },
}, 
{
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
export default Message;