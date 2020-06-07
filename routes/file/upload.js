const fs = require('fs');
const path = require('path');

const fileExists = async (file) => !!(await fs.promises.stat(file).catch(() => false));
const randName = () => Math.random().toString(36).substring(7);

module.exports = async (fastify) => {
  const { SessionToken, File, ApiKey } = fastify.db.models;

  fastify.post('/upload', async (req, res) => {
    const {
      raw: {
        files: {
          file,
        },
      },
      body: {
        randomizeName,
        name,
        isPrivate,
        token = '',
        key = '',
      },
    } = req;

    const session = await SessionToken.findOne({ where: { token } });
    const api = await ApiKey.findOne({ where: { key } });

    const fileName = (!session && !api) || randomizeName ? randName() : name;

    const extension = path.extname(file.name);
    const compiledName = path.extname(`${name}`) === '' ? `${fileName}${extension}` : name;

    res.errorMessage = 'Failed to upload file';

    const userId = (session && session.user.id) || (api && api.user.id) || 'anonymous';

    res.transaction = await fastify.db.transaction();
    if (!await fileExists(path.join('public', 'files', userId))) {
      await fs.promises.mkdir(path.join('public', 'files', userId));
    }

    if (path.join('public', 'files', userId, compiledName).indexOf(path.join('public', 'files', userId)) !== -1 && !await fileExists(path.join('public', 'files', userId, compiledName))) {
      await fs.promises.writeFile(path.join('public', 'files', userId, compiledName), file.data);

      const fileEntry = await File.create({
        name: compiledName,
        size: file.size,
        uploadDate: new Date(),
        md5: file.md5,
        private: isPrivate || false,
      });

      await res.transaction.commit();

      if (session) session.user.addFile(fileEntry);
      if (api) api.usser.addFile(fileEntry);

      return {
        status: 'success',
        message: 'File uploaded',
        fileEntry,
        url: `http://${req.hostname}/public/files/${userId}/${compiledName}`,
      };
    }
    res.transaction.rollback();
    return { status: 'error', message: res.errorMessage };
  });
};
