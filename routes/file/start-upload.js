// Consider generating ALL part URLs from here, vs multiple requests
// every start of a part, test performance differences

module.exports = async (fastify) => {
  fastify.get('/start-upload/:fileName', async (req) => {
    const uploadData = await new Promise((resolve, reject) => {
      fastify.s3.createMultipartUpload({
        Bucket: process.env.S3_BUCKET,
        Key: req.params.fileName,
      }, (err, multipart) => {
        if (err) {
          reject(err);
        } else {
          resolve(multipart);
        }
      });
    });
    return uploadData;
  });
};
