import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["aadhar_front", "aadhar_back", "pan_card", "cancelled_check"],
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
    required: true,
  },
});

const userExecutiveSchema = new mongoose.Schema(
  {
    // Basic Information
    userType: {
      type: String,
      enum: ["Promoter", "Retailer", "Dealer", "Distributor", "Executive"],
      required: true,
      default: "Promoter",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    relationshipStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },

    // Contact Information
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    // Document Information
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"],
    },

    // Location Information
    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Pin code must be 6 digits"],
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // System Information
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    pointPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 100,
    },
    referCode: {
      type: String,
      required: false,
      trim: true,
    },
    dealerCode: {
      type: String,
      required: false,
      trim: true,
    },

    // Points and Referrals
    totalEarnedPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    availablePoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    referPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    redeemAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserExecutive",
      default: null,
    },
    referredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserExecutive",
      },
    ],
    totalReferredUsers: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status and Verification
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    unverifyReason: {
      type: String,
      default: "",
    },

    // Documents
    documents: [documentSchema],

    // Metadata
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
userExecutiveSchema.index({ mobile: 1 });
userExecutiveSchema.index({ aadharNumber: 1 });
userExecutiveSchema.index({ panNumber: 1 });
userExecutiveSchema.index({ userType: 1 });
userExecutiveSchema.index({ isVerified: 1 });
userExecutiveSchema.index({ status: 1 });
userExecutiveSchema.index({ createdAt: -1 });

// Virtual for full name display
userExecutiveSchema.virtual("displayName").get(function () {
  return this.name;
});

// Virtual for age calculation
userExecutiveSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Pre-save middleware to update referral counts
userExecutiveSchema.pre("save", async function (next) {
  if (this.isNew && this.referredBy) {
    try {
      await mongoose.model("UserExecutive").findByIdAndUpdate(this.referredBy, {
        $inc: { totalReferredUsers: 1 },
        $push: { referredUsers: this._id },
      });
    } catch (error) {
      console.error("Error updating referral count:", error);
    }
  }
  next();
});

// Method to add points
userExecutiveSchema.methods.addPoints = function (points, type = "earned") {
  if (type === "earned") {
    this.totalEarnedPoints += points;
    this.availablePoints += points;
  } else if (type === "refer") {
    this.referPoints += points;
    this.availablePoints += points;
  }
  return this.save();
};

// Method to deduct points
userExecutiveSchema.methods.deductPoints = function (points) {
  if (this.availablePoints >= points) {
    this.availablePoints -= points;
    this.redeemAmount += points;
    return this.save();
  } else {
    throw new Error("Insufficient points");
  }
};

// Method to verify user
userExecutiveSchema.methods.verify = function (verifiedBy) {
  this.isVerified = true;
  this.verificationDate = new Date();
  this.verifiedBy = verifiedBy;
  this.unverifyReason = "";
  return this.save();
};

// Method to unverify user
userExecutiveSchema.methods.unverify = function (reason, verifiedBy) {
  this.isVerified = false;
  this.verificationDate = null;
  this.verifiedBy = verifiedBy;
  this.unverifyReason = reason;
  return this.save();
};

// Static method to get user statistics
userExecutiveSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] },
        },
        unverifiedUsers: {
          $sum: { $cond: [{ $eq: ["$isVerified", false] }, 1, 0] },
        },
        activeUsers: {
          $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
        },
        executives: {
          $sum: { $cond: [{ $eq: ["$userType", "Executive"] }, 1, 0] },
        },
        totalPoints: { $sum: "$totalEarnedPoints" },
        totalAvailablePoints: { $sum: "$availablePoints" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      activeUsers: 0,
      executives: 0,
      totalPoints: 0,
      totalAvailablePoints: 0,
    }
  );
};

export default mongoose.model("UserExecutive", userExecutiveSchema);
