import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  mentor: mongoose.Types.ObjectId;
  mentee: mongoose.Types.ObjectId;
  scheduledAt: Date;
  notes?: string;
  feedback?: string;
}

const sessionSchema = new Schema<ISession>(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    notes: { type: String },
    feedback: { type: String }, // added later by mentor or mentee
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);
export default Session;
