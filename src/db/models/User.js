var mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * all commented fields are for future use
 * to reduce the complexity i have used any authentication mechanism which can be implemented later
 */

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  // password: {
  //   type: String,
  //   required: true,
  // },
  contact: {
    type: Number,
    required: true,
    match: [
      /^[1-9][0-9]{9}$/,
      "The value of path {PATH} ({VALUE}) is not a valid mobile number.",
    ],
  },
  imageUrl: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  type: {
    type: Number,
    enum: [0, 1],
    default: 1,
    allowNull: false,
  }, // 0 for teacher and 1 for students
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("update", function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

UserSchema.pre("save", function (next) {
  this.update({}, { $set: { createdAt: new Date() } });
  next();
});

module.exports = mongoose.model("User", UserSchema);
