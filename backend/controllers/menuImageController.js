const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const getS3Client = () => {
    return new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
};


exports.getMenuImages = async (req, res) => {
    try {
        const s3 = getS3Client();
        const bucket = process.env.AWS_BUCKET_NAME;
        const folder = process.env.AWS_BUCKET_FOLDER || 'res-files';

        const imageMap = {};
        let continuationToken = undefined;

        do {
            const listCommand = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: `${folder}/`,
                ContinuationToken: continuationToken,
            });

            const listResponse = await s3.send(listCommand);
            const objects = listResponse.Contents || [];

            await Promise.all(objects.map(async (obj) => {
                const key = obj.Key;

                if (key.endsWith('/')) return;

                let filename = key.replace(`${folder}/`, '');

                filename = filename.replace(/^\d+-/, '');

                const nameWithoutExt = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '');

                const mapKey = nameWithoutExt.toUpperCase();

                const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
                const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 14400 });

                imageMap[mapKey] = signedUrl;
            }));

            continuationToken = listResponse.IsTruncated ? listResponse.NextContinuationToken : undefined;
        } while (continuationToken);

        res.json(imageMap);
    } catch (err) {
        console.error('Error fetching menu images from S3:', err.message);
        res.status(500).json({ message: 'Failed to fetch menu images', error: err.message });
    }
};
