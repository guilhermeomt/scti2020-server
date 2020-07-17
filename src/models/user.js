const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator').default;

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
      unique: true,
      validate: [
        {
          validator(val) {
            return isEmail(val);
          },
          message: 'O email inserido é inválido.',
        },
        {
          async validator(val) {
            const user = await mongoose.model('User').findOne({ email: val });
            return !user;
          },
          message: 'Este email já está cadastrado. Tente outro.',
        },
      ],
    },
    password: {
      type: String,
      required: [true, 'Informe sua senha.'],
      minlength: [8, 'A senha deve ter no mínimo 8 caracteres.'],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
      immutable: true,
    },
    passwordChangedAt: Date,
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
}

userSchema.loadClass(User);
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
