var mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * all commented fields are for future use
 * we can also add a field for soft-delete for future functionalities.
 */

var EventSchema = new mongoose.Schema({
  doneBy: { type: ObjectId, ref: "User" },
  room: { type: ObjectId, ref: "LiveClass" },
  type: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    default: 0,
    allowNull: false,
  }, // 0 for joining and 1 for leaving , 2, for starting, 3 for stopping, 4 class stopped when last teacher left
  isActive: {
    type: Boolean,
    default: true,
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

EventSchema.pre("update", function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

EventSchema.pre("save", function (next) {
  this.update({}, { $set: { createdAt: new Date() } });
  next();
});

module.exports = mongoose.model("Event", EventSchema);
