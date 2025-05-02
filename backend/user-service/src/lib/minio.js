import { Client } from 'minio';

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'admin123'
});

// Ensure bucket exists and is public
const ensureBucketExists = async () => {
    try {
        const bucketExists = await minioClient.bucketExists('profile-pictures');
        if (!bucketExists) {
            await minioClient.makeBucket('profile-pictures');
            console.log('Created profile-pictures bucket');
        }

        // Set bucket policy to public read
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: '*',
                    Action: ['s3:GetObject'],
                    Resource: ['arn:aws:s3:::profile-pictures/*']
                }
            ]
        };

        await minioClient.setBucketPolicy('profile-pictures', JSON.stringify(policy));
        console.log('Set bucket policy to public read');
    } catch (error) {
        console.error('Error ensuring bucket exists:', error);
    }
};

// Run the bucket check
ensureBucketExists();

export default minioClient; 