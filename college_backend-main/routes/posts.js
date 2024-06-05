const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Post, validatePost } = require("../models/post");
const { Reply, validateReply } = require("../models/replies");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { Tag } = require("../models/tag");


router.get("/user/:_id", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params._id }).populate("author", "name username");
    res.send(posts);
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/", async (req, res) => {
  let all_posts = await Post.find().populate("author", "name -_id");
  res.send(all_posts);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    
    await Reply.deleteMany({ post: post._id });
    await post.remove();

    res.status(200).send("Post and associated replies deleted successfully");
  } catch (error) {
    console.error("Error deleting post and replies:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id }).populate(
      "author",
      "name username"
    );
    const views = post[0].views;
    post[0].views = views + 1;
    const result = await post[0].save();
    res.send(post[0]);
  } catch (ex) {
    return res.send(ex.message);
  }
});

router.post("/create", auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const tags = req.body.tags;
  const tags_array = [];
  for (let i = 0; i < tags.length; i++) {
    const tag_in_db = await Tag.findById(tags[i]);
    if (!tag_in_db) return res.status(400).send("Invalid Tag");
    tags_array.push(tag_in_db);
  }
  const post = new Post({
    title: req.body.title,
    tags: tags_array,
    description: req.body.description,
    author: req.user._id,
    views: 1,
  });
  try {
    await post.save();
    res.send("Post succesfully created.");
  } catch (err) {
    console.log("error: ", err);
  }
});

router.put("/bookmark/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exists");
  if (post.author == req.user._id)
    return res.status(400).send("You can't bookmark your own post");
  const bookmarkArray = post.bookmarks;
  const index = bookmarkArray.indexOf(req.user._id);
  if (index === -1) {
    bookmarkArray.push(req.user._id);
  } else {
    bookmarkArray.splice(index, 1);
  }
  post.bookmarks = bookmarkArray;
  const result = await post.save();
  const bookmarkedPost = await Post.find({ _id: post._id }).populate(
    "author",
    "name username"
  );
  res.send(bookmarkedPost);
});

router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exists");
  if (post.author == req.user._id)
    return res.status(400).send("You can't upvote your own post");
  const upvoteArray = post.upvotes;
  const index = upvoteArray.indexOf(req.user._id);
  if (index === -1) {
    upvoteArray.push(req.user._id);
  } else {
    upvoteArray.splice(index, 1);
  }
  post.upvotes = upvoteArray;
  const result = await post.save();
  const post_new = await Post.find({ _id: post._id }).populate(
    "author",
    "name username"
  );
  res.send(post_new);
});

router.put("/report/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exist");
  if (post.author.equals(req.user._id))
    return res.status(400).send("You can't report your own post");

  const reportsArray = post.reports;
  const index = reportsArray.indexOf(req.user._id);
  if (index === -1) {
    reportsArray.push(req.user._id);
  } else {
    reportsArray.splice(index, 1);
  }

  post.reports = reportsArray;
  await post.save();

  const updatedPost = await Post.findById(post._id).populate("author", "name username");
  res.send(updatedPost);
});

module.exports = router;
