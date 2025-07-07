import mongoose, { Document, Schema } from "mongoose";

export interface AvailabilityDocument extends Document {
  mentor: mongoose.Types.ObjectId;
  day: string;
  startTime: string;
  endTime: string;
}

const availabilitySchema = new Schema<AvailabilityDocument>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

const Availability = mongoose.model<AvailabilityDocument>(
  "Availability",
  availabilitySchema
);

export default Availability;
