const { objectId } = require("mongoose").Types;
const { User, Thought, Reaction } = require("../models");

module.exports = {
  //GET all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate("thoughts");
      const userResponse = {
        users,
      };
      return res.json(userResponse);
    } catch (err) {
      console.log(err);
      return res.json(500).json(err);
    }
  },

  //GET user by id
  async getOneUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        //excluding __v field from results
        .select("-__v")
        //getting a javascript document instead of a mongoose document
        .lean();

      if (!user) {
        return res.status(404).json({ message: "no user exists with this id" });
      }

      res.json({ user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //CREATE new user
  async createUser(req, res) {
    try {
      //destructuring properties
      const { username, email } = req.body;
      const user = await User.create({ username, email });

      res.status(201).json({ user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //UPDATE user
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "user not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //DELETE user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "this user does not exist" });
      }
      res.json({ message: "user has been deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //ADD friend to user friendlist
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      //find the user by id and update the friends array to add the friend
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } }, //add friendId to friends array
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "user not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //REMOVE friend from user friendlist
  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      //find the user by id and update the friends array to remove the friend
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } }, //remove friendId from friends array
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "user not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
