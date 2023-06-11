const router = require('express').Router();

const {
getThoughts,
getOneThought,
createThought,
updateThought,
deleteThought,
createReaction,
removeReaction,
} = require("../../controllers/thoughtController");

router.route("/").get(getThoughts).post(createThought);

router.route("/:thoughtId").get(getOneThought).put(updateThought).delete(deleteThought);

router.route("/:thoghtId/reactions").put(createReaction);

router.route("/thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;