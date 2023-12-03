import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
//npm install @aws-sdk/client-s3

// Replace these variables with your AWS credentials and S3 details
const awsAccessKeyId = '';
const awsSecretAccessKey = '';
const bucketName = '';
const region = 'us-east-2';

// Create an S3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
  region: region,
});

// Function to delete all objects in the bucket
async function deleteAllFiles() {
  try {
    // List all objects in the bucket
    const listObjectsParams = { Bucket: bucketName };
    const listObjectsCommand = new ListObjectsV2Command(listObjectsParams);
    const listObjectsResponse = await s3Client.send(listObjectsCommand);

    // Delete each object
    for (const object of listObjectsResponse.Contents || []) {
      const deleteParams = { Bucket: bucketName, Key: object.Key || '' };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand);
      console.log(`Deleted: ${object.Key}`);
    }

    console.log('All files deleted successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function to delete all files
deleteAllFiles();
