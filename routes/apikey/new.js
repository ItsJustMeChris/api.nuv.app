const crypto = require('crypto');


module.exports = async (fastify) => {
  const { ApiKey, SessionToken } = fastify.db.models;

  fastify.post('/new', async (req, res) => {
    const {
      body: {
        name = '',
        description = '',
        ip = '',
        token = '',
      },
    } = req;

    res.errorMessage = 'Faild to create API Key';

    const session = await SessionToken.findOne({ where: { token } });
    if (!session) return { status: 'error', message: res.errorMessage };

    const key = crypto.randomBytes(16).toString('hex');
    res.transaction = await fastify.db.transaction();

    const apiKey = ApiKey.create({
      key, name, ip, description,
    });

    await res.transaction.commit();

    session.user.addApiKey(apiKey);

    return {
      status: 'success',
      message: 'Created API Key',
      apiKey,
    };
  });
};
