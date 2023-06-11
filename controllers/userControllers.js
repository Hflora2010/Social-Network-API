const { objectId } = require("mongoose").Types;
const { User, Thought, Reaction } = require("../models");

module.exports = {
    
    //GET all users
    async getUsers(req, res) {
        try {
            const users = await User.find().populate('thoughts');
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

        if(!user) {
            return res.status(404).json({ message: "no user exists with this id" });
        }

        res.json({ user });
       } catch (err) {
        console.log(err);
        return res.status(500).json(err);
       }
    },

    
}