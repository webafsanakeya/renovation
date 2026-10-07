import mongoose, { Schema, InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export type MessageType = InferSchemaType<typeof messageSchema>;

export const Message = (mongoose.models.Message ||
  mongoose.model("Message", messageSchema)) as mongoose.Model<MessageType>;