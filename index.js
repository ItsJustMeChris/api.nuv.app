const fastify = require('fastify')({ logger: true, level: process.env.NODE_ENV === 'production' ? 'error' : 'info' });
const Sequelize = require('sequelize');
const AWS = require('aws-sdk');

if (process.env.NODE_ENV !== 'production') {
  fastify.log.info('Production mode not detected, loading from .env');
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
  username: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
  host: process.env.DBHOST,
  dialect: 'postgres',
  operatorsAliases: false,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  endpoint: 's3.us-east-2.amazonaws.com',
  signatureVersion: 'v4',
});


fastify.register(require('fastify-cors'), { origin: '*' });
fastify.register(require('fastify-file-upload'));


/* Register Database Models */

sequelize
  .import('./models/File')
  .import('./models/SessionToken')
  .import('./models/ApiKey')
  .import('./models/User');

fastify.db = sequelize;
fastify.Sequelize = Sequelize;
fastify.s3 = s3;

/* Register Routes */

fastify.register(require('./routes/user/_build.js'), { prefix: '/v1/' });
fastify.register(require('./routes/file/_build.js'), { prefix: '/v1/' });

fastify.setErrorHandler((error, req, res) => {
  if (res.transaction) res.transaction.rollback();
  fastify.log.error(error);
  return res.type('application/json').code(500).send({ status: 'error', message: res.errorMessage || 'Server encountered an error.' });
});

const start = async () => {
  try {
    await fastify.ready();
    await sequelize.authenticate();
    await sequelize.sync();
    await fastify.listen(process.env.SERVERPORT);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
