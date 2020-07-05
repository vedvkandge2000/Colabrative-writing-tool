const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
      type: String,
      createIndexes: true
    },
    creator: {
      type: mongoose.Schema.ObjectId,
       ref: 'userSchema',
       createIndexes: true
     },
     creatorName: {
       type: String,
       createIndexes: true
     },
     contributor:[{
       type: mongoose.Schema.ObjectId,
       createIndexes: true
     }]
  },{
    timestamps: true
  });

const Post = mongoose.model("Post",postSchema);
module.exports = Post;