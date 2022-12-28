const mongoose = require("mongoose");
const posterModel = require('./poster')

//  Your code goes here

const ObjectID = mongoose.Schema.objectID;

const blogSchema = mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    author: String,
    date: String,
    time: String,
    // poster: {
    //   type: ObjectID,
    //   ref: "posters",
    // },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
