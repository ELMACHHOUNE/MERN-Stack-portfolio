const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    logo: {
      type: String, // can be URL or /uploads/clients/<file>
      required: [true, "Client logo is required"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

clientSchema.index({ order: 1 });

module.exports = mongoose.model("Client", clientSchema);
