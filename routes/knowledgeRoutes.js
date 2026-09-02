const express =
    require("express");

const multer =
    require("multer");

const path =
    require("path");

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

function attachmentFileFilter(
    req,
    file,
    cb
) {

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();


    if (
        extension !== ".pdf"
    ) {

        return cb(
            new Error(
                "Materi artikel harus berformat PDF."
            )
        );

    }


    if (
        file.mimetype !==
            "application/pdf" &&

        file.mimetype !==
            "application/octet-stream"
    ) {

        return cb(
            new Error(
                "File yang diupload bukan PDF."
            )
        );

    }


    cb(
        null,
        true
    );

}


const uploadAttachment =
    multer({

        storage,

        fileFilter:
            attachmentFileFilter,

        limits: {

            fileSize:
                20 * 1024 * 1024

        }

    });

// ==========================================================
// PUBLIC
// ==========================================================


// Semua konten PUBLISHED
router.get(
    "/",
    knowledgeController.getAll
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
                                "Ukuran PDF maksimal 20 MB."

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