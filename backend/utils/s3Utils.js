const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
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

exports.generateSignedUrl = async (imgUrl) => {
    if (!imgUrl || typeof imgUrl !== 'string' || imgUrl.trim() === '') return imgUrl;
    
    if (!imgUrl.includes('amazonaws.com') && !imgUrl.startsWith('res-files')) {
        return imgUrl;
    }

    let key = imgUrl;
    if (imgUrl.startsWith('http')) {
        try {
            const url = new URL(imgUrl);
            const rawPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
            key = decodeURIComponent(rawPath);
        } catch (e) {
            console.error("URL parsing failed for:", imgUrl);
            return imgUrl;
        }
    }

    if (!key) return imgUrl;

    try {
        const s3 = getS3Client();
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (err) {
        console.error("Error generating signed URL for key:", key, err.message);
        return imgUrl;
    }
};
