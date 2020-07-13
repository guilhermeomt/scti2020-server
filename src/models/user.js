const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
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
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true, discriminatorKey: 'role' }
);

class User {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

userSchema.loadClass(User);
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
