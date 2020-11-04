var mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * all commented fields are for future use
 * we can also add a field for soft-delete for future functionalities.
 */

var LiveClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: { type: ObjectId, ref: "User" },
  // for a reason they are stored diffrently
  participantsStudents: [{ type: ObjectId, ref: "User" }],
  participantsTeachers: [{ type: ObjectId, ref: "User" }],
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  }, // true when class is started and false when class is not active
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

LiveClassSchema.pre("update", function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

LiveClassSchema.pre("save", function (next) {
  this.update({}, { $set: { createdAt: new Date() } });
  next();
});

module.exports = mongoose.model("LiveClass", LiveClassSchema);
