import mongoose, { Document, Schema } from "mongoose";

export type RequestStatus = "pending" | "accepted" | "rejected";

export interface IMentorshipRequest extends Document {
  mentee: mongoose.Types.ObjectId;
  mentor: mongoose.Types.ObjectId;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const mentorshipRequestSchema = new Schema<IMentorshipRequest>(
  {
    mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MentorshipRequest = mongoose.model<IMentorshipRequest>(
  "MentorshipRequest",
  mentorshipRequestSchema
);

export default MentorshipRequest;
