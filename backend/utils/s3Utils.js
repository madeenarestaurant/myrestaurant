const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Function to get S3 client (ensures env vars are loaded)
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
 * Converts a static S3 URL or Key into a Temporarily Signed URL
 * @param {string} imgUrl - The image URL or Key stored in the DB
 * @returns {Promise<string>} - The signed URL
 */
exports.generateSignedUrl = async (imgUrl) => {
    if (!imgUrl || typeof imgUrl !== 'string' || imgUrl.trim() === '') return imgUrl;
    
    // If it's not an S3 URL, return it as is
    if (!imgUrl.includes('amazonaws.com') && !imgUrl.startsWith('res-files')) {
        return imgUrl;
    }

    let key = imgUrl;
    if (imgUrl.startsWith('http')) {
        try {
            const url = new URL(imgUrl);
            // remove leading slash if present and decode to get the raw key
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

        // URL expires in 1 hour
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (err) {
        console.error("Error generating signed URL for key:", key, err.message);
        return imgUrl; // Fallback to original URL
    }
};
