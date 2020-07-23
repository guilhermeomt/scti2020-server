const { Schema } = require('mongoose');

const socialSchema = new Schema(
  {
    website: String,
    linkedin: String,
    github: String,
    facebook: String,
    instagram: String,
    twitter: String,
    medium: String,
    youtube: String,
  },
  { _id: false }
);

module.exports = socialSchema;
