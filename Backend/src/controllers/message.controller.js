import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";

// GET /conversation/:userId
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId }
    ]
  }).sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(200, messages, "Conversation fetched")
  );
});

// GET /recent
const getRecentConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const recent = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", userId] },
            "$receiver",
            "$sender"
          ]
        },
        lastMessage: { $first: "$$ROOT" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ]);

  return res.status(200).json(
    new ApiResponse(200, recent, "Recent conversations fetched")
  );
});

// PATCH /mark-read/:userId
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  await Message.updateMany(
    {
      sender: userId,
      receiver: currentUserId,
      isRead: false
    },
    { $set: { isRead: true } }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "Messages marked as read")
  );
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Only sender can delete their own message
  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this message");
  }

  await Message.findByIdAndDelete(messageId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Message deleted successfully")
  );
});

export {
  getMessages,
  getRecentConversations,
  markMessagesAsRead,
  deleteMessage
};
