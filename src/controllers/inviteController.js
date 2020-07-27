const Invite = require('../models/invite');
const sendEmail = require('../utils/mailer');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

exports.createInvite = catchAsync(async (req, res, next) => {
  const { role: targetRole, email: targetEmail } = req.body;

  const inviteObj = { targetRole, targetEmail, createdBy: req.user._id };
  const invite = await Invite.create(inviteObj);

  const token = await invite.createInviteToken();

  const inviteURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/invite/signup/${token}`;

  const text = `Você foi convidado para a SCTI 2020! Faça uma requisição HTTP POST (por enquanto!) com os seus dados para o endereço:\n\n${inviteURL} \n\nEste email é automático. Caso o link acima esteja quebrado, entre em contato com algum adminstrador do evento.`;

  try {
    await sendEmail({
      email: targetEmail,
      subject: 'SCTI 2020: Seu convite de inscrição!',
      text,
    });
    return res.status(200).json({
      status: 'success',
      message: 'Email de convite enviado com sucesso!',
    });
  } catch (err) {
    await Invite.remove(invite);

    return next(
      new ErrorResponse(
        'Não foi possível enviar o email. Tente novamente mais tarde!',
        500
      )
    );
  }
});
