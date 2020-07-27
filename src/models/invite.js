const crypto = require('crypto');
const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  targetRole: {
    type: String,
    required: [true, 'A função do convidado é necessária.'],
  },
  targetEmail: {
    type: String,
    required: [true, 'O endereço de email do convidado é necessário.'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  invitedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

class Invite {
  async createInviteToken() {
    const inviteToken = crypto
      .randomBytes(12)
      .toString('hex')
      .concat(Date.now().toString(16).slice(6, 11));

    this.token = crypto.createHash('sha256').update(inviteToken).digest('hex');
    await this.save();

    return inviteToken;
  }

  async expire() {
    this.isExpired = true;
    await this.save();
  }

  async addInvitedUser(userId) {
    this.invitedUser = userId;
    await this.save();
  }
}

inviteSchema.loadClass(Invite);
const inviteModel = mongoose.model('Invite', inviteSchema);

module.exports = inviteModel;
