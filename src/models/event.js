const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do evento é obrigatório.'],
      unique: 'Já existe um evento com este nome.',
    },
    type: {
      type: String,
      required: [true, 'O tipo do evento é obrigatório.'],
      enum: ['Minicurso', 'Palestra'],
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

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'speaker',
    select: '-__v -role -phone -email -createdAt -updatedAt',
  });

  next();
});

class Event {
  get endDate() {
    if (this.hoursDuration) {
      return new Date(
        this.startDate.getTime() + this.hoursDuration * 3600 * 1000
      );
    }

    return null;
  }
}

eventSchema.plugin(beautifyUnique);
eventSchema.loadClass(Event);

const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;
