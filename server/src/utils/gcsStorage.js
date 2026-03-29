const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

// ---------------------------------------------------------------------------
// Google Cloud Storage Configuration
// ---------------------------------------------------------------------------
// SETUP INSTRUCTIONS:
//   1. cd server && npm install @google-cloud/storage
//   2. Create a GCS bucket in Google Cloud Console
//   3. Create a Service Account with "Storage Object Admin" role
//   4. Download the JSON key file and place it somewhere secure
//   5. Set these env vars in server/.env:
//        GCS_PROJECT_ID=your_project_id
//        GCS_BUCKET_NAME=your_bucket_name
//        GCS_KEY_FILE=path/to/service-account-key.json   (optional if using ADC)
// ---------------------------------------------------------------------------

let storage;
let bucket;

/**
 * Initialise the GCS client lazily (on first use).
 * Returns null if GCS is not configured — callers should handle gracefully.
 */
const getbucket = () => {
  if (bucket) return bucket;

  const projectId = process.env.GCS_PROJECT_ID;
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    logger.warn('GCS_BUCKET_NAME is not set — file uploads will fail.');
    return null;
  }

  const opts = { projectId };

  // If a key file path is provided, use it; otherwise rely on ADC
  if (process.env.GCS_KEY_FILE) {
    opts.keyFilename = process.env.GCS_KEY_FILE;
  }

  storage = new Storage(opts);
  bucket = storage.bucket(bucketName);

  logger.info(`GCS initialised: bucket=${bucketName}, project=${projectId || 'default'}`);
  return bucket;
};

/**
 * Upload a file buffer to GCS.
 *
 * @param {Buffer} fileBuffer  - The file content (from multer memoryStorage)
 * @param {string} originalName - Original filename from the client
 * @param {string} mimeType    - MIME type (image/jpeg, application/pdf, etc.)
 * @param {string} folder      - Optional subfolder inside the bucket (e.g. "documents")
 * @returns {Promise<{ gcsKey: string, publicUrl: string }>}
 */
const uploadFile = async (fileBuffer, originalName, mimeType, folder = 'documents') => {
  const b = getbucket();
  if (!b) throw new Error('GCS is not configured. Set GCS_BUCKET_NAME in .env');

  const ext = path.extname(originalName);
  const gcsKey = `${folder}/${uuidv4()}${ext}`;

  const file = b.file(gcsKey);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
    resumable: false, // small files — no need for resumable upload
  });

  logger.info(`GCS upload: ${gcsKey} (${mimeType}, ${fileBuffer.length} bytes)`);

  return {
    gcsKey,
    publicUrl: `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${gcsKey}`,
  };
};

/**
 * Generate a signed URL for private file download (valid for `expiresInMs`).
 *
 * @param {string} gcsKey      - Object key in the bucket
 * @param {number} expiresInMs - URL validity in milliseconds (default 15 min)
 * @returns {Promise<string>}  - Signed download URL
 */
const getSignedUrl = async (gcsKey, expiresInMs = 15 * 60 * 1000) => {
  const b = getbucket();
  if (!b) throw new Error('GCS is not configured.');

  const [url] = await b.file(gcsKey).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMs,
  });

  return url;
};

/**
 * Delete a file from GCS.
 *
 * @param {string} gcsKey - Object key in the bucket
 */
const deleteFile = async (gcsKey) => {
  const b = getbucket();
  if (!b) throw new Error('GCS is not configured.');

  await b.file(gcsKey).delete();
  logger.info(`GCS delete: ${gcsKey}`);
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
