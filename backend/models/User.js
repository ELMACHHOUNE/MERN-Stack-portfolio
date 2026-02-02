const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      default: [],
    },
    values: {
      type: [
        {
          icon: String,
          title: String,
          description: String,
        },
      ],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    happyClients: {
      type: Number,
      default: 0,
      min: 0,
    },
    theme: {
      primary: { type: String, default: "#4F46E5" },
      secondary: { type: String, default: "#9333EA" },
      headingH1: { type: String, default: "#111827" },
      headingH2: { type: String, default: "#1F2937" },
      textBody: { type: String, default: "#374151" },
      primaryHover: { type: String, default: "#4338CA" },
      accent: { type: String, default: "#10B981" },
      buttonBg: { type: String, default: "#4F46E5" },
      buttonText: { type: String, default: "#FFFFFF" },
      buttonHoverBg: { type: String, default: "#4338CA" },
      cardBg: { type: String, default: "#FFFFFF" },
      cardBorder: { type: String, default: "#E5E7EB" },
      sidebarBg: { type: String, default: "#FFFFFF" },
      sidebarText: { type: String, default: "#374151" },
      sidebarActiveBg: { type: String, default: "#E0E7FF" },
      sidebarActiveText: { type: String, default: "#4F46E5" },
      sidebarHoverBg: { type: String, default: "#F3F4F6" },
      sidebarHoverText: { type: String, default: "#4F46E5" },
    },
    socialLinks: {
      github: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      youtube: {
        type: String,
        default: "",
      },
      behance: {
        type: String,
        default: "",
      },
      gmail: {
        type: String,
        default: "",
      },
      whatsapp: {
        type: String,
        default: "",
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for profile image URL
userSchema.virtual("profileImageUrl").get(function () {
  if (!this.profileImage) return null;
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}${this.profileImage}`;
});

// Update the updatedAt timestamp before saving
userSchema.pre("save", function () {
  this.updatedAt = new Date();
});

// Encrypt password using bcrypt
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
