const { validationResult } = require('express-validator');
const Document = require('../models/document.model');
const Application = require('../models/application.model');
const { uploadFile, getSignedUrl, deleteFile } = require('../utils/gcsStorage');
const logger = require('../config/logger');

// ---------------------------------------------------------------------------
// Helper: return first validation error (if any)
// ---------------------------------------------------------------------------
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
};

// ===========================================================================
// POST /documents  — Upload a document to GCS and save metadata
// ===========================================================================
const upload = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    const { applicationId, docType } = req.body;

    // Verify the application exists and the user has access
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Students can only upload to their own application
    if (req.user.role === 'student' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only upload documents to your own application.' });
    }

    // Upload file buffer to GCS
    const { gcsKey } = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      `documents/${applicationId}`,
    );

    const document = await Document.create({
      applicationId,
      uploadedBy: req.user.id,
      docType,
      fileName: req.file.originalname,
      gcsKey,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    logger.info(`Document uploaded: ${document._id} (type=${docType}, app=${applicationId}) by user=${req.user.id}`);

    res.status(201).json({
      message: 'Document uploaded successfully.',
      document: {
        id: document._id,
        applicationId: document.applicationId,
        docType: document.docType,
        fileName: document.fileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        createdAt: document.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /documents/:id  — Get document metadata + signed download URL
// ===========================================================================
const getById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'username')
      .populate('verifiedBy', 'username');

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // Students can only view their own documents
    if (req.user.role === 'student' && document.uploadedBy._id.toString() !== req.user.id) {
      const application = await Application.findById(document.applicationId);
      if (!application || application.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }
    }

    // Generate a signed URL for secure download (15 min expiry)
    const downloadUrl = await getSignedUrl(document.gcsKey);

    res.json({
      document: {
        id: document._id,
        applicationId: document.applicationId,
        docType: document.docType,
        fileName: document.fileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        uploadedBy: document.uploadedBy,
        verifiedByAdmin: document.verifiedByAdmin,
        verifiedAt: document.verifiedAt,
        verifiedBy: document.verifiedBy,
        createdAt: document.createdAt,
        downloadUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// GET /documents/application/:applicationId  — List documents for an application
// ===========================================================================
const getByApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Students can only view their own application documents
    if (req.user.role === 'student' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const documents = await Document.find({ applicationId })
      .populate('uploadedBy', 'username')
      .populate('verifiedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// DELETE /documents/:id  — Delete document from GCS and DB
// ===========================================================================
const remove = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // Students can only delete their own unverified documents
    if (req.user.role === 'student') {
      if (document.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own documents.' });
      }
      if (document.verifiedByAdmin) {
        return res.status(400).json({ error: 'Cannot delete a verified document. Contact admin.' });
      }
    }

    // Delete from GCS
    try {
      await deleteFile(document.gcsKey);
    } catch (gcsErr) {
      logger.error(`GCS delete failed for ${document.gcsKey}:`, gcsErr);
      // Continue with DB deletion even if GCS fails (orphan cleanup can happen later)
    }

    await Document.findByIdAndDelete(req.params.id);

    logger.info(`Document deleted: ${req.params.id} by user=${req.user.id}`);

    res.json({ message: 'Document deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ===========================================================================
// PUT /documents/:id/verify  — Admin marks document as verified
// ===========================================================================
const verify = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (document.verifiedByAdmin) {
      return res.status(400).json({ error: 'Document is already verified.' });
    }

    document.verifiedByAdmin = true;
    document.verifiedAt = new Date();
    document.verifiedBy = req.user.id;
    await document.save();

    logger.info(`Document verified: ${req.params.id} by admin=${req.user.id}`);

    res.json({
      message: 'Document verified successfully.',
      document: {
        id: document._id,
        docType: document.docType,
        verifiedByAdmin: true,
        verifiedAt: document.verifiedAt,
        verifiedBy: req.user.id,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, getById, getByApplication, remove, verify };
