module.exports = async (fastify) => {
  fastify.get('/upload-url/:uploadID/:partNumber/:fileName', async (req) => {
    const uploadURL = await new Promise((resolve, reject) => {
      fastify.s3.getSignedUrl({
        Bucket: process.env.S3_BUCKET,
        Key: req.params.uploadID,
        PartNumber: req.params.partNumber,
        UploadId: req.params.fileName,
      }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
    return uploadURL;
  });
};
