module.exports = async (fastify) => {
  fastify.post('/end-upload', async (req) => {
    console.log(req.body);
    const uploadResponse = await new Promise((resolve, reject) => {
      fastify.s3.completeMultipartUpload({
        Bucket: process.env.S3_BUCKET,
        Key: req.body.params.fileName,
        UploadId: req.body.params.uploadId,
        MultipartUpload: {
          Parts: req.body.params.parts,
        },
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
