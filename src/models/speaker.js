const { Schema } = require('mongoose');
const User = require('./user');
const socialSchema = require('./schemas/social');

const speakerSchema = new Schema({
  email: {
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
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
    required: [true, 'Informe sua biografia.'],
  },
});

// Inherits fields and methods from User
const speakerModel = User.discriminator('Speaker', speakerSchema);

module.exports = speakerModel;
