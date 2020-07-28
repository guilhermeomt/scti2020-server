const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator').default;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Informe o seu nome.'],
    },
    lastName: {
      type: String,
      required: [true, 'Informe o seu sobrenome.'],
    },
    phone: {
      type: String,
      required: [true, 'Informe o seu número de telefone.'],
    },
    email: {
      type: String,
      required: [true, 'Informe o seu email.'],
      index: {
        sparse: true,
        unique: true,
      },
      validate: {
        validator(val) {
          return isEmail(val);
        },
        message: 'O email inserido é inválido.',
      },
    },
    password: {
      type: String,
      required: [true, 'Informe sua senha.'],
      minlength: [8, 'A senha deve ter no mínimo 8 caracteres.'],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
      immutable: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual('enrolledAt', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'enrollments',
});

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

class User {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  async isCorrectPassword(receivedPassword, userPassword) {
    return bcrypt.compare(receivedPassword, userPassword);
  }

  changedPasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
}

// Plugin that turns unique property on schema fields a validation error
userSchema.plugin(uniqueValidator, {
  message:
    'Este email já está cadastrado. Tente outro ou entre em contato com os administradores.',
});
userSchema.loadClass(User);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
// Require Speaker so User can know that Speaker is a discriminator
require('./speaker');
