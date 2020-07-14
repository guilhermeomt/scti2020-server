const mongoose = require('mongoose');
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
          validator(val) {
            return mongoose
              .model('User')
              .findOne({ email: val })
              .then((user) => !user);
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
