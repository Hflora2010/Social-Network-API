const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomName, getRandomThought } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing users
  await User.deleteMany({});

  // Drop existing thoughts
  await Thought.deleteMany({});

  // Create empty array to hold the users
  const users = [];

  // Loop 20 times -- add users to the users array
  for (let i = 0; i < 20; i++) {
    const username = getRandomName().replace(" ", "").toLocaleLowerCase();
    const email = username + "@gmail.com";

    const userThought = await Thought.create({
      thoughtText: getRandomThought(),
      username,
    });

    users.push({
        username,
        email,
        thoughts: [userThought._id]
    });
  }
  await User.collection.insertMany(users);

  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
