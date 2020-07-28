const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do evento é obrigatório.'],
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'O tipo do evento é obrigatório.'],
      enum: ['Minicurso', 'Palestra', 'Especial'],
    },
    description: {
      type: String,
      required: [true, 'A descrição do evento é obrigatória.'],
    },
    startDate: {
      type: Date,
      required: [true, 'A data de ínicio do evento é obrigatória.'],
    },
    hoursDuration: Number,
    speaker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Speaker',
    },
    enrollments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    url: String,
    local: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    id: false,
  }
);

class Event {
  get endDate() {
    if (this.hoursDuration) {
      return new Date(
        this.startDate.getTime() + this.hoursDuration * 3600 * 1000
      );
    }

    return null;
  }

  isFull() {
    return this.enrollments.length === 30;
  }

  isEnrolled(userId) {
    return this.enrollments.includes(userId);
  }

  async enroll(userId) {
    this.enrollments.addToSet(userId);
    await this.save();

    return this;
  }

  async disenroll(userId) {
    const index = this.enrollments.findIndex((el) => el.toString() === userId);
    if (index > -1) {
      this.enrollments.splice(index, 1);
    }
    await this.save();

    return this;
  }
}

eventSchema.plugin(uniqueValidator, {
  message: 'Já existe um evento com este nome.',
});
eventSchema.loadClass(Event);

const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;
