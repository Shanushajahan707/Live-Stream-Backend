import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  googleId?: number;
  username: string;
  email: string;
  password: string;
  role: string;
  dateofbirth?: Date;
  isblocked: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema({
  googleId: { type: Number },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, default: "user" },
  dateofbirth: { type: Date, default: new Date("01/01/2000") },
  isblocked: { type: Boolean },
});

export const UserModel = mongoose.model<UserDocument>("user", UserSchema);
