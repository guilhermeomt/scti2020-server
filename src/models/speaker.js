const { Schema } = require('mongoose');
const User = require('./user');
const socialSchema = require('./schemas/social');

const speakerSchema = new Schema({
  phone: {
    type: String,
    required: false,
  },
  jobTitle: {
    type: String,
  },
  social: socialSchema,
  bio: {
    type: String,
    required: true,
  },
});

// Inherits fields and methods from User
const speakerModel = User.discriminator('Speaker', speakerSchema);

module.exports = speakerModel;
