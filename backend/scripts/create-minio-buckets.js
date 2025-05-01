import { Client } from 'minio';

const minioClient = new Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'admin123'
});

async function createBuckets() {
    try {
        // Create messages bucket
        await minioClient.makeBucket('messages', 'us-east-1');
        console.log('Messages bucket created successfully');

        // Create profiles bucket
        await minioClient.makeBucket('profiles', 'us-east-1');
        console.log('Profiles bucket created successfully');

        // Set bucket policies to allow public read access
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject', 's3:GetObjectVersion'],
                    Resource: ['arn:aws:s3:::messages/*', 'arn:aws:s3:::profiles/*']
                },
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:ListBucket', 's3:ListBucketVersions'],
                    Resource: ['arn:aws:s3:::messages', 'arn:aws:s3:::profiles']
                }
            ]
        };

        await minioClient.setBucketPolicy('messages', JSON.stringify(policy));
        await minioClient.setBucketPolicy('profiles', JSON.stringify(policy));
        console.log('Bucket policies set successfully');
    } catch (error) {
        console.error('Error creating buckets:', error);
    }
}

createBuckets(); 