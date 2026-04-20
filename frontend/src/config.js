export const S3_BASE_URL = "https://madeena-res-bucket.s3.us-east-1.amazonaws.com/res-files";

export const getAssetUrl = (filename) => {
  if (!filename) return "";
  // If it's already a full URL, return it
  if (filename.startsWith("http")) return filename;

  // Encode filename to handle spaces and special characters
  const encodedFilename = filename.split('/').map(part => encodeURIComponent(part)).join('/');

  return `${S3_BASE_URL}/${encodedFilename}`;
};

