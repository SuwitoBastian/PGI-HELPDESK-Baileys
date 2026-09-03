const fs =
    require("fs");

const path =
    require("path");

const knowledgeRepository =
    require("../services/knowledgeRepository");


// ==========================================================
// VIDEO / ATTACHMENT UPLOAD DIRECTORY
// ==========================================================

const uploadDir =
    path.join(
        process.cwd(),
        "public",
        "uploads",
        "knowledge"
    );


// Pastikan folder tersedia
if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );

}


// ==========================================================
// DELETE LOCAL KNOWLEDGE FILE
// ==========================================================

function deleteKnowledgeFile(fileUrl) {

    if (!fileUrl) {
        return;
    }


    // Hanya hapus file lokal.
    // YouTube / external URL tidak disentuh.
    if (
        !fileUrl.startsWith(
            "/uploads/knowledge/"
        )
    ) {

        return;

    }


    const filename =
        path.basename(
            fileUrl
        );


    const filePath =
        path.join(
            uploadDir,
            filename
        );


    try {

        if (
            fs.existsSync(
                filePath
            )
        ) {

            fs.unlinkSync(
                filePath
            );

        }

    } catch (err) {

        console.error(
            "Gagal menghapus file Knowledge Base:",
            err
        );

    }

}


// ==========================================================
// DELETE LOCAL VIDEO FILE
// ==========================================================

function deleteVideoFile(videoUrl) {

    deleteKnowledgeFile(
        videoUrl
    );

}


// ==========================================================
// DELETE LOCAL ATTACHMENT FILE
// ==========================================================

function deleteAttachmentFile(
    attachmentUrl
) {

    deleteKnowledgeFile(
        attachmentUrl
    );

}


// ==========================================================
// GET ALL KNOWLEDGE
// PUBLIC
// ==========================================================

function getAll(req, res) {

    try {

        const {
            status,
            category,
            search
        } = req.query;


        /*
            PUBLIC:
            Kalau tidak diberikan status,
            default PUBLISHED.

            MASTER:
            Frontend Master bisa meminta
            ?status=ALL / DRAFT / PUBLISHED.
        */

        const contents =
            knowledgeRepository.getAll({

                status:
                    status === "ALL"
                        ? undefined
                        : status || "PUBLISHED",

                category,

                search

            });


        return res.json({

            ok: true,

            data: contents

        });

    } catch (err) {

        console.error(
            "Knowledge GET ALL error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal mengambil Knowledge Base."

        });

    }

}


// ==========================================================
// GET BY SLUG
// PUBLIC
// ==========================================================

function getBySlug(req, res) {

    try {

        const content =
            knowledgeRepository.getBySlug(
                req.params.slug
            );


        if (
            !content ||
            content.status !== "PUBLISHED"
        ) {

            return res.status(404).json({

                ok: false,

                message:
                    "Konten tidak ditemukan."

            });

        }


        /*
            Views tetap dipertahankan
            untuk kompatibilitas database.

            Tidak ditampilkan di UI.
        */

        knowledgeRepository.incrementViews(
            content.id
        );


        return res.json({

            ok: true,

            data: content

        });

    } catch (err) {

        console.error(
            "Knowledge GET BY SLUG error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal mengambil konten."

        });

    }

}


// ==========================================================
// GET BY ID
// MASTER
// ==========================================================

function getById(req, res) {

    try {

        const content =
            knowledgeRepository.getById(
                req.params.id
            );


        if (!content) {

            return res.status(404).json({

                ok: false,

                message:
                    "Konten tidak ditemukan."

            });

        }


        return res.json({

            ok: true,

            data: content

        });

    } catch (err) {

        console.error(
            "Knowledge GET BY ID error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal mengambil konten."

        });

    }

}


// ==========================================================
// CREATE
// MASTER
// ==========================================================

function create(req, res) {

    try {

        const {

            title,

            slug,

            category,

            content,

            keywords,

            status,

            type,

            videoUrl,

            attachmentUrl,

            attachmentName

        } = req.body;


        const contentType =
            type === "VIDEO"
                ? "VIDEO"
                : "ARTICLE";


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
            !title ||
            !slug ||
            !category
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Title, slug, dan category wajib diisi."

            });

        }


        // Artikel wajib memiliki content
        if (
            contentType === "ARTICLE" &&
            !content
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Content artikel wajib diisi."

            });

        }


        // Video harus punya URL
        if (
            contentType === "VIDEO" &&
            !videoUrl
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Video URL wajib diisi."

            });

        }


        const item =
            knowledgeRepository.create({

                title:
                    title.trim(),

                slug:
                    slug.trim(),

                category:
                    category.trim(),

                /*
                    content database NOT NULL.
                    Untuk video kita tetap isi string.
                */

                content:
                    content ||
                    "",

                keywords:
                    keywords ||
                    null,

                status:
                    status === "PUBLISHED"
                        ? "PUBLISHED"
                        : "DRAFT",

                type:
                    contentType,

                videoUrl:
                    videoUrl ||
                    null,

                attachmentUrl:
                    contentType === "ARTICLE"
                        ? attachmentUrl ||
                          null
                        : null,

                attachmentName:
                    contentType === "ARTICLE"
                        ? attachmentName ||
                          null
                        : null,

                createdBy:
                    req.session.user.id

            });


        return res.status(201).json({

            ok: true,

            data: item

        });

    } catch (err) {

        console.error(
            "Knowledge CREATE error:",
            err
        );


        if (
            err.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                ok: false,

                message:
                    "Slug konten sudah digunakan."

            });

        }


        return res.status(500).json({

            ok: false,

            message:
                "Gagal membuat konten."

        });

    }

}


// ==========================================================
// UPLOAD VIDEO
// ==========================================================

function uploadVideo(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({

                ok: false,

                message:
                    "File video wajib dipilih."

            });

        }


        const relativeUrl =
            `/uploads/knowledge/${req.file.filename}`;


        return res.status(201).json({

            ok: true,

            data: {

                filename:
                    req.file.filename,

                originalName:
                    req.file.originalname,

                size:
                    req.file.size,

                url:
                    relativeUrl

            }

        });

    } catch (err) {

        console.error(
            "Knowledge VIDEO UPLOAD error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal upload video."

        });

    }

}


// ==========================================================
// UPLOAD ARTICLE ATTACHMENT
// ==========================================================

function uploadAttachment(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({

                ok: false,

                message:
                    "File materi artikel wajib dipilih."

            });

        }


        const relativeUrl =
            `/uploads/knowledge/${req.file.filename}`;


        return res.status(201).json({

            ok: true,

            data: {

                filename:
                    req.file.filename,

                originalName:
                    req.file.originalname,

                size:
                    req.file.size,

                url:
                    relativeUrl

            }

        });

    } catch (err) {

        console.error(
            "Knowledge ATTACHMENT UPLOAD error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal upload materi artikel."

        });

    }

}


// ==========================================================
// UPDATE
// MASTER
// ==========================================================

function update(req, res) {

    try {

        const existing =
            knowledgeRepository.getById(
                req.params.id
            );


        if (!existing) {

            return res.status(404).json({

                ok: false,

                message:
                    "Konten tidak ditemukan."

            });

        }


        const {

            title,

            slug,

            category,

            content,

            keywords,

            status,

            type,

            videoUrl,

            attachmentUrl,

            attachmentName

        } = req.body;


        const contentType =
            type === "VIDEO"
                ? "VIDEO"
                : "ARTICLE";


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
            !title ||
            !slug ||
            !category
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Title, slug, dan category wajib diisi."

            });

        }


        if (
            contentType === "ARTICLE" &&
            !content
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Content artikel wajib diisi."

            });

        }


        if (
            contentType === "VIDEO" &&
            !videoUrl
        ) {

            return res.status(400).json({

                ok: false,

                message:
                    "Video URL wajib diisi."

            });

        }


        const item =
            knowledgeRepository.update(

                req.params.id,

                {

                    title:
                        title.trim(),

                    slug:
                        slug.trim(),

                    category:
                        category.trim(),

                    content:
                        content ||
                        "",

                    keywords:
                        keywords ||
                        null,

                    status:
                        status === "PUBLISHED"
                            ? "PUBLISHED"
                            : "DRAFT",

                    type:
                        contentType,

                    videoUrl:
                        contentType === "VIDEO"
                            ? videoUrl ||
                              null
                            : null,

                    attachmentUrl:
                        contentType === "ARTICLE"
                            ? attachmentUrl ||
                              null
                            : null,

                    attachmentName:
                        contentType === "ARTICLE"
                            ? attachmentName ||
                              null
                            : null

                }

            );


        /*
            Kalau video lama diganti
            dengan video baru, file lama
            kita hapus.

            Hanya file lokal.
        */

        if (
            existing.video_url &&
            existing.video_url !== videoUrl &&
            contentType === "VIDEO"
        ) {

            deleteVideoFile(
                existing.video_url
            );

        }


        /*
            Kalau konten berubah dari VIDEO
            menjadi ARTICLE, video lama
            juga dihapus.
        */

        if (
            existing.type === "VIDEO" &&
            contentType === "ARTICLE"
        ) {

            deleteVideoFile(
                existing.video_url
            );

        }


        /*
            Kalau attachment artikel lama
            diganti dengan attachment baru,
            hapus file lama.

            Hanya file lokal.
        */

        if (
            existing.attachment_url &&
            existing.attachment_url !== attachmentUrl &&
            contentType === "ARTICLE"
        ) {

            deleteAttachmentFile(
                existing.attachment_url
            );

        }


        /*
            Kalau konten berubah dari ARTICLE
            menjadi VIDEO, attachment lama
            juga dihapus.
        */

        if (
            existing.attachment_url &&
            contentType === "VIDEO"
        ) {

            deleteAttachmentFile(
                existing.attachment_url
            );

        }


        return res.json({

            ok: true,

            data: item

        });

    } catch (err) {

        console.error(
            "Knowledge UPDATE error:",
            err
        );


        if (
            err.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                ok: false,

                message:
                    "Slug konten sudah digunakan."

            });

        }


        return res.status(500).json({

            ok: false,

            message:
                "Gagal mengubah konten."

        });

    }

}


// ==========================================================
// DELETE
// MASTER
// ==========================================================

function remove(req, res) {

    try {

        const existing =
            knowledgeRepository.getById(
                req.params.id
            );


        if (!existing) {

            return res.status(404).json({

                ok: false,

                message:
                    "Konten tidak ditemukan."

            });

        }


        const deleted =
            knowledgeRepository.remove(
                req.params.id
            );


        if (!deleted) {

            return res.status(404).json({

                ok: false,

                message:
                    "Konten tidak ditemukan."

            });

        }


        /*
            Hapus file video lokal
            setelah record database berhasil
            dihapus.
        */

        if (
            existing.video_url
        ) {

            deleteVideoFile(
                existing.video_url
            );

        }


        /*
            Hapus attachment artikel lokal
            setelah record database berhasil
            dihapus.
        */

        if (
            existing.attachment_url
        ) {

            deleteAttachmentFile(
                existing.attachment_url
            );

        }


        return res.json({

            ok: true,

            message:
                "Konten berhasil dihapus."

        });

    } catch (err) {

        console.error(
            "Knowledge DELETE error:",
            err
        );


        return res.status(500).json({

            ok: false,

            message:
                "Gagal menghapus konten."

        });

    }

}


// ==========================================================
// TIKTOK RESOLVER
// ==========================================================

async function resolveTikTok(req, res) {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                ok: false,
                message: "URL TikTok wajib diisi."
            });
        }

        const { resolveTikTokUrl } =
            require("../utils/tiktok");

        const result =
            await resolveTikTokUrl(url);

        if (!result) {
            return res.status(400).json({
                ok: false,
                message:
                    "URL TikTok tidak dapat diproses."
            });
        }

        return res.json({
            ok: true,
            data: result
        });

    } catch (error) {
        console.error(
            "TikTok resolver error:",
            error
        );

        return res.status(500).json({
            ok: false,
            message:
                "Gagal memproses URL TikTok."
        });
    }
}


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {

    getAll,

    getBySlug,

    getById,

    create,

    uploadVideo,

    uploadAttachment,

    update,

    remove,

    resolveTikTok

};