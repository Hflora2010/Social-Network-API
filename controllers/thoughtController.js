const { User, Thought, Reaction } = require("../models");

const moment = require("moment");

module.exports = {
  //GET all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      const userResponse = {
        thoughts,
      };
      return res.json(userResponse);
    } catch (err) {
      console.log(err);
      return res.json(500).json(err);
    }
  },

  //GET one thought
  async getOneThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        //excluding __v field from results
        .select("-__v")
        //getting a javascript document instead of a mongoose document
        .lean();

      if (!thought) {
        return res.status(404).json({ message: "no user exists with this id" });
      }

      res.json({ thought });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //CREATE new thought
  async createThought(req, res) {
    try {
      //destructuring properties
      const { thoughtText, username } = req.body;
      const thought = await Thought.create({
        thoughtText,
        username,
      });

      const updatedUser = await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        await Thought.findByIdAndRemove(thought._id);
        return res.status(404).json({ message: "user not found" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //UPDATE a thought
  async updateThought(req, res) {
    try {
      const { thoughtId } = req.params;
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: "thought not found" });
      }

      res.json(updatedThought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //DELETE a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "this thought does not exist" });
      }
      res.json({ message: "thought has been deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },




  

  //CREATE new reaction
  async createReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;
      const { thoughtId } = req.params;

      const reaction = await Reaction.create({
        reactionBody,
        username,
        createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
      });

      //find thought by thoughtid and update reaction array to add new reaction
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $addToSet: { reactions: reaction } }, //add new reaction to reactions array
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        await Reaction.findByIdAndRemove(reaction._id);
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(reaction);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },


  //DELETE reaction
  async removeReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;

      // find thought by thoughtId and update the reaction array to remove the reaction
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId } } }, //remove the reaction with the reactionId from reactions array
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: "thought not found" });
      }

      res.json({ message: "Reaction deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
