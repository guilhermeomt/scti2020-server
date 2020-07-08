const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

class User {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

schema.loadClass(User);
module.exports = mongoose.model('User', schema);
