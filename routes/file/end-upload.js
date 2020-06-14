module.exports = async (fastify) => {
  fastify.post('/end-upload', async (req) => {
    const uploadResponse = await new Promise((resolve, reject) => {
      fastify.s3.completeMultipartUpload({
        Bucket: process.env.S3_BUCKET,
        Key: req.params.fileName,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return uploadResponse;
  });
};
