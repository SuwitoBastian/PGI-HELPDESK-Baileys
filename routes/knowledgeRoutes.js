const express =
    require("express");

const multer =
    require("multer");

const path =
    require("path");

const fs =
    require("fs");

const crypto =
    require("crypto");

const router =
    express.Router();

const knowledgeController =
    require("../controllers/knowledgeController");

const {
    requireAuth
} = require("../middleware/authMiddleware");


// ==========================================================
// MULTER CONFIGURATION
// ==========================================================

const storage =
    multer.diskStorage({

        destination:
            (req, file, cb) => {

                cb(
                    null,
                    path.join(
                        process.cwd(),
                        "public",
                        "uploads",
                        "knowledge"
                    )
                );

            },


        filename:
            (req, file, cb) => {

                const extension =
                    path.extname(
                        file.originalname
                    ).toLowerCase();


                const baseName =
                    path.basename(
                        file.originalname,
                        extension
                    )
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        );


                const timestamp =
                    Date.now();


                const random =
                    Math.round(
                        Math.random() *
                        1e9
                    );


                cb(
                    null,
                    `${baseName || "video"}-${timestamp}-${random}${extension}`
                );

            }

    });


// ==========================================================
// FILE FILTER
// ==========================================================

function videoFileFilter(
    req,
    file,
    cb
) {

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    const allowedExtensions = [
        ".mp4"
    ];


    if (
        !allowedExtensions.includes(
            extension
        )
    ) {

        return cb(
            new Error(
                "Format video harus MP4."
            )
        );

    }


    /*
        Jangan hanya mengandalkan extension.
        MIME type juga kita cek.
    */

    if (
        file.mimetype !==
            "video/mp4" &&

        file.mimetype !==
            "application/octet-stream"
    ) {

        return cb(
            new Error(
                "File yang diupload bukan video MP4."
            )
        );

    }


    cb(
        null,
        true
    );

}


// ==========================================================
// UPLOAD CONFIG
// ==========================================================

const uploadVideo =
    multer({

        storage,

        fileFilter:
            videoFileFilter,

        limits: {

            fileSize:
                50 * 1024 * 1024

        }

    });

// ==========================================================
// ARTICLE ATTACHMENT CONFIG
// ==========================================================

function attachmentFileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".pdf", ".exe", ".rar"];

    if (!allowedExtensions.includes(extension)) {
        return cb(
            new Error("Format file hanya PDF, EXE, atau RAR.")
        );
    }

    // MIME type dapat berbeda tergantung browser dan sistem operasi.
    // Ekstensi sudah dibatasi ke PDF, EXE, dan RAR.
    cb(null, true);
}

const uploadAttachment = multer({
    storage,

    fileFilter: attachmentFileFilter,

    limits: {
        fileSize: 300 * 1024 * 1024
    }
});


 // ==========================================================
 // CHUNKED ARTICLE ATTACHMENT UPLOAD
 // ==========================================================

const ATTACHMENT_CHUNK_SIZE = 10 * 1024 * 1024;
const ATTACHMENT_MAX_SIZE = 300 * 1024 * 1024;
const MAX_ATTACHMENT_CHUNKS = 30;

const attachmentChunkDir = path.join(
    process.cwd(),
    "tmp",
    "knowledge-attachment-chunks"
);

const uploadAttachmentChunk = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: ATTACHMENT_CHUNK_SIZE + 1024 * 1024,
        files: 1
    }
});

function isValidUploadId(uploadId) {
    return (
        typeof uploadId === "string" &&
        /^[a-zA-Z0-9-]{1,100}$/.test(uploadId)
    );
}

function getChunkDirectory(uploadId) {
    return path.join(attachmentChunkDir, uploadId);
}

function getUploadOwner(req) {
    return crypto
        .createHash("sha256")
        .update(req.sessionID)
        .digest("hex");
}

async function verifyUploadOwner(req, uploadId, totalChunks) {
    const manifestPath = path.join(
        getChunkDirectory(uploadId),
        "manifest.json"
    );

    let manifest;

    try {
        manifest = JSON.parse(
            await fs.promises.readFile(manifestPath, "utf8")
        );
    } catch {
        return false;
    }

    return (
        manifest.owner === getUploadOwner(req) &&
        (
            totalChunks == null ||
            manifest.totalChunks === totalChunks
        )
    );
}

async function removeChunkDirectory(uploadId) {
    if (!isValidUploadId(uploadId)) return;

    await fs.promises.rm(
        getChunkDirectory(uploadId),
        { recursive: true, force: true }
    );
}


const CHUNK_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CHUNK_CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;

async function cleanupStaleAttachmentChunks() {
    try {
        const now = Date.now();

        let entries;

        try {
            entries = await fs.promises.readdir(
                attachmentChunkDir,
                { withFileTypes: true }
            );
        } catch (err) {
            if (err.code === "ENOENT") return;
            throw err;
        }

        for (const entry of entries) {
            // Hanya proses folder, bukan file lain.
            if (!entry.isDirectory()) continue;

            const folderPath = path.join(
                attachmentChunkDir,
                entry.name
            );

            try {
                const stat = await fs.promises.stat(folderPath);
                const age = now - stat.mtimeMs;

                if (age > CHUNK_MAX_AGE_MS) {
                    await fs.promises.rm(folderPath, {
                        recursive: true,
                        force: true
                    });

                    console.log(
                        `[Knowledge Upload] Folder sementara kedaluwarsa dibersihkan: ${entry.name}`
                    );
                }
            } catch (err) {
                console.error(
                    `[Knowledge Upload] Gagal membersihkan ${entry.name}:`,
                    err.message
                );
            }
        }
    } catch (err) {
        console.error(
            "[Knowledge Upload] Pembersihan folder sementara gagal:",
            err.message
        );
    }
}

// Bersihkan saat aplikasi berjalan dan ulangi setiap 6 jam.
cleanupStaleAttachmentChunks();

const chunkCleanupTimer = setInterval(
    cleanupStaleAttachmentChunks,
    CHUNK_CLEANUP_INTERVAL_MS
);

// Jangan sampai timer menghambat proses Node.js berhenti.
if (typeof chunkCleanupTimer.unref === "function") {
    chunkCleanupTimer.unref();
}


function safeAttachmentFilename(originalName) {
    const extension = path.extname(originalName).toLowerCase();

    const baseName = path
        .basename(originalName, path.extname(originalName))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    return `${baseName || "materi"}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
}

// ----------------------------------------------------------
// TERIMA SATU POTONGAN FILE
// ----------------------------------------------------------

router.post(
    "/upload-attachment/chunk/:uploadId/:chunkIndex/:totalChunks",
    requireAuth,
    (req, res, next) => {
        uploadAttachmentChunk.single("chunk")(req, res, err => {
            if (err) {
                const message =
                    err.code === "LIMIT_FILE_SIZE"
                        ? "DEBUG: MULTER_LIMIT_FILE_SIZE"
                        : err.message || "Gagal menerima potongan file.";

                return res.status(400).json({
                    ok: false,
                    message
                });
            }

            next();
        });
    },
    async (req, res) => {
        const {
            uploadId,
            chunkIndex: indexRaw,
            totalChunks: totalRaw
        } = req.params;

        const index = Number(indexRaw);
        const totalChunks = Number(totalRaw);

        if (!isValidUploadId(uploadId)) {
            return res.status(400).json({
                ok: false,
                message: "ID upload tidak valid."
            });
        }

        if (
            !req.file ||
            !Number.isInteger(totalChunks) ||
            totalChunks < 1 ||
            totalChunks > MAX_ATTACHMENT_CHUNKS ||
            !Number.isInteger(index) ||
            index < 0 ||
            index >= totalChunks
        ) {
            return res.status(400).json({
                ok: false,
                message: "Data potongan upload tidak valid."
            });
        }

        if (req.file.size > ATTACHMENT_CHUNK_SIZE) {
            return res.status(400).json({
                ok: false,
                message: "Ukuran potongan maksimal 10 MB."
            });
        }

        try {
            const chunkDir = getChunkDirectory(uploadId);

            await fs.promises.mkdir(chunkDir, {
                recursive: true
            });

            const manifestPath = path.join(
                chunkDir,
                "manifest.json"
            );

            const manifest = {
                owner: getUploadOwner(req),
                totalChunks
            };

            try {
                await fs.promises.writeFile(
                    manifestPath,
                    JSON.stringify(manifest),
                    { flag: "wx" }
                );
            } catch (err) {
                if (err.code !== "EEXIST") {
                    throw err;
                }

                const isOwner = await verifyUploadOwner(
                    req,
                    uploadId,
                    totalChunks
                );

                if (!isOwner) {
                    return res.status(403).json({
                        ok: false,
                        message: "Upload ini bukan milik sesi kamu."
                    });
                }
            }

            await fs.promises.writeFile(
                path.join(chunkDir, `${index}.part`),
                req.file.buffer
            );

            return res.json({
                ok: true,
                data: {
                    chunkIndex: index,
                    totalChunks
                }
            });
        } catch (err) {
            console.error("Attachment chunk error:", err);

            return res.status(500).json({
                ok: false,
                message: "Gagal menyimpan potongan file."
            });
        }
    }
);

// ----------------------------------------------------------
// GABUNGKAN POTONGAN MENJADI FILE UTUH
// ----------------------------------------------------------

router.post(
    "/upload-attachment/complete",
    requireAuth,
    async (req, res) => {

        const {
            uploadId,
            originalName,
            totalChunks: totalRaw
        } = req.body || {};

        if (!isValidUploadId(uploadId)) {
            return res.status(400).json({
                ok: false,
                message: "ID upload tidak valid."
            });
        }

        const totalChunks = Number(totalRaw);

        if (
            !Number.isInteger(totalChunks) ||
            totalChunks < 1 ||
            totalChunks > MAX_ATTACHMENT_CHUNKS
        ) {
            return res.status(400).json({
                ok: false,
                message: "Jumlah potongan tidak valid."
            });
        }

        const isOwner = await verifyUploadOwner(
            req,
            uploadId,
            totalChunks
        );

        if (!isOwner) {
            return res.status(403).json({
                ok: false,
                message: "Upload tidak ditemukan atau bukan milik sesi kamu."
            });
        }

        if (
            typeof originalName !== "string" ||
            !originalName.trim() ||
            originalName.length > 255
        ) {
            return res.status(400).json({
                ok: false,
                message: "Nama file tidak valid."
            });
        }

        const extension = path.extname(originalName).toLowerCase();

        if (![".pdf", ".exe", ".rar"].includes(extension)) {
            return res.status(400).json({
                ok: false,
                message: "Format file hanya PDF, EXE, atau RAR."
            });
        }


        const chunkDir = getChunkDirectory(uploadId);
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "knowledge"
        );

        const filename = safeAttachmentFilename(
            path.basename(originalName)
        );

        const outputPath = path.join(uploadDir, filename);

        let totalSize = 0;
        let outputCreated = false;

        try {
            // Pastikan semua potongan tersedia dan ukuran total aman.
            for (let index = 0; index < totalChunks; index += 1) {
                const chunkPath = path.join(
                    chunkDir,
                    `${index}.part`
                );

                let stat;

                try {
                    stat = await fs.promises.stat(chunkPath);
                } catch {
                    return res.status(400).json({
                        ok: false,
                        message: `Potongan ${index + 1} dari ${totalChunks} belum diterima.`
                    });
                }

                if (!stat.isFile() || stat.size <= 0) {
                    return res.status(400).json({
                        ok: false,
                        message: `Potongan ${index + 1} tidak valid.`
                    });
                }

                // Setiap potongan selain potongan terakhir harus 10 MB.
                if (
                    index < totalChunks - 1 &&
                    stat.size !== ATTACHMENT_CHUNK_SIZE
                ) {
                    return res.status(400).json({
                        ok: false,
                        message: `Ukuran potongan ${index + 1} tidak sesuai.`
                    });
                }

                if (stat.size > ATTACHMENT_CHUNK_SIZE) {
                    return res.status(400).json({
                        ok: false,
                        message: `Potongan ${index + 1} terlalu besar.`
                    });
                }

                totalSize += stat.size;

                if (totalSize > ATTACHMENT_MAX_SIZE) {
                    await removeChunkDirectory(uploadId);

                    return res.status(400).json({
                        ok: false,
                        message: "Ukuran materi maksimal 300 MB."
                    });
                }
            }

            if (totalSize <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: "File kosong tidak dapat diupload."
                });
            }

            await fs.promises.mkdir(uploadDir, {
                recursive: true
            });

            // "wx" mencegah file yang sudah ada tertimpa.
            await fs.promises.writeFile(
                outputPath,
                Buffer.alloc(0),
                { flag: "wx" }
            );

            outputCreated = true;

            // Gabungkan satu potongan pada satu waktu.
            for (let index = 0; index < totalChunks; index += 1) {
                const chunkPath = path.join(
                    chunkDir,
                    `${index}.part`
                );

                const chunk = await fs.promises.readFile(chunkPath);

                await fs.promises.appendFile(outputPath, chunk);
            }

            // Pastikan ukuran file hasil gabungan sesuai.
            const finalStat = await fs.promises.stat(outputPath);

            if (finalStat.size !== totalSize) {
                throw new Error("Ukuran file hasil gabungan tidak sesuai.");
            }

            await removeChunkDirectory(uploadId);

            return res.status(201).json({
                ok: true,
                data: {
                    filename,
                    originalName: path.basename(originalName),
                    size: totalSize,
                    url: `/uploads/knowledge/${filename}`
                }
            });
        } catch (err) {
            console.error("Attachment merge error:", err);

            if (outputCreated) {
                await fs.promises.unlink(outputPath).catch(() => {});
            }

            return res.status(500).json({
                ok: false,
                message: "Gagal menggabungkan potongan file di server."
            });
        }
    }
);

// ----------------------------------------------------------
// BATALKAN UPLOAD DAN HAPUS POTONGAN SEMENTARA
// ----------------------------------------------------------

router.post(
    "/upload-attachment/cancel",
    requireAuth,
    async (req, res) => {
        const { uploadId } = req.body || {};

        if (!isValidUploadId(uploadId)) {
            return res.status(400).json({
                ok: false,
                message: "ID upload tidak valid."
            });
        }

        const isOwner = await verifyUploadOwner(
            req,
            uploadId,
            null
        );

        if (!isOwner) {
            return res.status(403).json({
                ok: false,
                message: "Upload tidak ditemukan atau bukan milik sesi kamu."
            });
        }

        try {
            await removeChunkDirectory(uploadId);

            return res.json({
                ok: true,
                message: "Potongan upload dibersihkan."
            });
        } catch (err) {
            console.error("Attachment cleanup error:", err);

            return res.status(500).json({
                ok: false,
                message: "Gagal membersihkan potongan upload."
            });
        }
    }
);


// ==========================================================
// PUBLIC
// ==========================================================


// Semua konten PUBLISHED
router.get(
    "/",
    knowledgeController.getAll
);

// ==========================================================
// TIKTOK RESOLVER
// ==========================================================

router.get(
    "/tiktok-resolve",
    knowledgeController.resolveTikTok
);

// Konten berdasarkan slug
router.get(
    "/article/:slug",
    knowledgeController.getBySlug
);


// ==========================================================
// MASTER
// ==========================================================


// Detail berdasarkan ID
router.get(
    "/admin/:id",
    requireAuth,
    knowledgeController.getById
);


// ==========================================================
// CREATE ARTICLE / VIDEO URL
// ==========================================================

router.post(
    "/",
    requireAuth,
    knowledgeController.create
);


// ==========================================================
// UPLOAD VIDEO
// ==========================================================

router.post(
    "/upload-video",

    requireAuth,

    (req, res, next) => {

        uploadVideo.single(
            "video"
        )(req, res, err => {

            if (err) {

                console.error(
                    "Knowledge video upload error:",
                    err
                );


                if (
                    err.code ===
                    "LIMIT_FILE_SIZE"
                ) {

                    return res
                        .status(400)
                        .json({

                            ok: false,

                            message:
                                "Ukuran video maksimal 50 MB."

                        });

                }


                return res
                    .status(400)
                    .json({

                        ok: false,

                        message:
                            err.message ||
                            "Gagal upload video."

                    });

            }


            next();

        });

    },

    knowledgeController.uploadVideo
);

// ==========================================================
// UPLOAD ARTICLE ATTACHMENT
// ==========================================================

router.post(
    "/upload-attachment",

    requireAuth,

    (req, res, next) => {

        uploadAttachment.single(
            "attachment"
        )(req, res, err => {

            if (err) {

                console.error(
                    "Knowledge attachment upload error:",
                    err
                );


                if (
                    err.code ===
                    "LIMIT_FILE_SIZE"
                ) {

                    return res
                        .status(400)
                        .json({

                            ok: false,

                            message:
                                "Ukuran file maksimal 300 MB."

                        });

                }


                return res
                    .status(400)
                    .json({

                        ok: false,

                        message:
                            err.message ||
                            "Gagal upload materi artikel."

                    });

            }


            next();

        });

    },

    knowledgeController.uploadAttachment
);


// ==========================================================
// UPDATE
// ==========================================================

router.put(
    "/:id",
    requireAuth,
    knowledgeController.update
);


// ==========================================================
// DELETE
// ==========================================================

router.delete(
    "/:id",
    requireAuth,
    knowledgeController.remove
);


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    router;
