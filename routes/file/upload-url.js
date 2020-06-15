module.exports = async (fastify) => {
  fastify.get('/upload-url', async (req) => {
    const uploadURL = await new Promise((resolve, reject) => {
      fastify.s3.getSignedUrl('uploadPart', {
        Bucket: process.env.S3_BUCKET,
        Key: req.query.fileName,
        PartNumber: req.query.partNumber,
        UploadId: req.query.uploadId,
      }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
    return { status: 'success', url: uploadURL };
  });
};
