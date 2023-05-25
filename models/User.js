const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        "Please add a valid email address",
      ],
    },
    thoughts: [thoughtsSchema],
    friends: [friendsSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.vurtual('friendCount')
.get(function () {
    return this.friends.length;
})

const User = model("user", userSchema);

module.exports = User;
