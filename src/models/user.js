const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator').default;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

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
      unique: 'Este email já está cadastrado. Tente outro.',
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
  { timestamps: true, discriminatorKey: 'role' }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
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
userSchema.plugin(beautifyUnique);
userSchema.loadClass(User);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
