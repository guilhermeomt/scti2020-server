const mongoose = require('mongoose');
const User = require('./user');

// Inherits fields and methods from User
const speakerModel = User.discriminator(
  'Speaker',
  new mongoose.Schema({
    phone: {
      type: String,
      required: false,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website_url: String,
    facebook_url: String,
    instagram_url: String,
    twitter_url: String,
    youtube_url: String,
    github_url: String,
  })
);

module.exports = speakerModel;
