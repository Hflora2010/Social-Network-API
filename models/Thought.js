const { Schema, model } = require("mongoose");

const reactionSchema = require("./Reaction");

const moment = require("moment");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function (timestamp) {
                return moment(timestamp).format("MMMM Do YYYY HH:mm:ss a")
            }
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
        {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;

