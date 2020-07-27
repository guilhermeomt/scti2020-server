const filterBodyFields = (body, ...notAllowedFields) => {
  const filteredBody = {};
  notAllowedFields.push('createdAt', 'updatedAt', '__v');

  Object.keys(body).forEach((el) => {
    if (!notAllowedFields.includes(el)) {
      filteredBody[el] = body[el];
    }
  });
  return filteredBody;
};

module.exports = filterBodyFields;
