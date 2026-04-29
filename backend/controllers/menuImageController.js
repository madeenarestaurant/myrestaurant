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

/**
 * Lists all objects in the S3 bucket under the res-files folder,
 * generates signed URLs for each, and returns a map:
 * { "PIZZA": "https://signed-url...", "BURGER": "...", ... }
 *
 * The key used in the map is the base filename stripped of:
 *  - folder prefix (res-files/)
 *  - timestamp prefix (e.g., "1714567890123-")
 *  - file extension (.jpeg, .jpg, .png, .webp)
 * all converted to UPPERCASE for easy matching.
 */
exports.getMenuImages = async (req, res) => {
    try {
        const s3 = getS3Client();
        const bucket = process.env.AWS_BUCKET_NAME;
        const folder = process.env.AWS_BUCKET_FOLDER || 'res-files';

        const imageMap = {};
        let continuationToken = undefined;

        // Paginate through all objects
        do {
            const listCommand = new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: `${folder}/`,
                ContinuationToken: continuationToken,
            });

            const listResponse = await s3.send(listCommand);
            const objects = listResponse.Contents || [];

            // Generate signed URLs in parallel
            await Promise.all(objects.map(async (obj) => {
                const key = obj.Key;

                // Skip folder-level entries
                if (key.endsWith('/')) return;

                // Extract the base filename without folder prefix
                let filename = key.replace(`${folder}/`, '');

                // Strip optional timestamp prefix: digits followed by "-"
                filename = filename.replace(/^\d+-/, '');

                // Strip file extension
                const nameWithoutExt = filename.replace(/\.(jpeg|jpg|png|webp)$/i, '');

                // Normalise to uppercase for matching (menu items use uppercase keys)
                const mapKey = nameWithoutExt.toUpperCase();

                // Generate a signed URL (expires in 4 hours)
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
