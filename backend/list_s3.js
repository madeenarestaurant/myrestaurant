const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function listObjects() {
    const bucket = process.env.AWS_BUCKET_NAME;
    const folder = process.env.AWS_BUCKET_FOLDER 

    console.log(`Listing objects in ${bucket}/${folder}...`);

    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${folder}/`,
    });

    try {
        const response = await s3.send(command);
        if (response.Contents) {
            response.Contents.forEach(obj => {
                console.log(obj.Key);
            });
        } else {
            console.log("No objects found.");
        }
    } catch (err) {
        console.error("Error listing objects:", err);
    }
}

listObjects();
