/* eslint-disable global-require */
module.exports = async (fastify) => {
  fastify.register(require('./upload'), { prefix: '/file' });
  fastify.register(require('./start-upload'), { prefix: '/file' });
  fastify.register(require('./upload-url'), { prefix: '/file' });
  fastify.register(require('./end-upload'), { prefix: '/file' });
};
