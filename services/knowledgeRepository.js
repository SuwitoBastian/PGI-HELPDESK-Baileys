const db =
    require("../database/database");


// ==========================================================
// GET ALL
// ==========================================================

function getAll(options = {}) {

    const {
        status = null,
        category = null,
        search = null
    } = options;


    let sql = `
        SELECT
            kb.*,
            users.name AS creator_name
        FROM knowledge_base kb
        LEFT JOIN users
            ON users.id = kb.created_by
        WHERE 1 = 1
    `;


    const params = {};


    if (status) {

        sql += `
            AND kb.status = @status
        `;

        params.status = status;

    }


    if (category) {

        sql += `
            AND kb.category = @category
        `;

        params.category = category;

    }


    if (search) {

        sql += `
            AND (
                kb.title LIKE @search
                OR kb.keywords LIKE @search
                OR kb.content LIKE @search
                OR kb.category LIKE @search
            )
        `;

        params.search =
            `%${search}%`;

    }


    sql += `
        ORDER BY
            kb.updated_at DESC,
            kb.id DESC
    `;


    return db
        .prepare(sql)
        .all(params);

}


// ==========================================================
// GET BY ID
// ==========================================================

function getById(id) {

    return db
        .prepare(`
            SELECT
                kb.*,
                users.name AS creator_name
            FROM knowledge_base kb
            LEFT JOIN users
                ON users.id = kb.created_by
            WHERE kb.id = ?
        `)
        .get(id);

}


// ==========================================================
// GET BY SLUG
// ==========================================================

function getBySlug(slug) {

    return db
        .prepare(`
            SELECT
                kb.*,
                users.name AS creator_name
            FROM knowledge_base kb
            LEFT JOIN users
                ON users.id = kb.created_by
            WHERE kb.slug = ?
        `)
        .get(slug);

}


// ==========================================================
// CREATE
// ==========================================================

function create({

    title,

    slug,

    category,

    content = "",

    keywords = null,

    status = "DRAFT",

    type = "ARTICLE",

    videoUrl = null,

    createdBy = null

}) {

    const result =
        db
            .prepare(`
                INSERT INTO knowledge_base (

                    title,

                    slug,

                    category,

                    content,

                    keywords,

                    status,

                    type,

                    video_url,

                    created_by

                )

                VALUES (

                    @title,

                    @slug,

                    @category,

                    @content,

                    @keywords,

                    @status,

                    @type,

                    @videoUrl,

                    @createdBy

                )
            `)
            .run({

                title,

                slug,

                category,

                content,

                keywords,

                status,

                type,

                videoUrl,

                createdBy

            });


    return getById(
        result.lastInsertRowid
    );

}


// ==========================================================
// UPDATE
// ==========================================================

function update(

    id,

    {

        title,

        slug,

        category,

        content = "",

        keywords = null,

        status = "DRAFT",

        type = "ARTICLE",

        videoUrl = null

    }

) {

    const result =
        db
            .prepare(`
                UPDATE knowledge_base

                SET

                    title = @title,

                    slug = @slug,

                    category = @category,

                    content = @content,

                    keywords = @keywords,

                    status = @status,

                    type = @type,

                    video_url = @videoUrl,

                    updated_at = CURRENT_TIMESTAMP

                WHERE id = @id
            `)
            .run({

                id,

                title,

                slug,

                category,

                content,

                keywords,

                status,

                type,

                videoUrl

            });


    if (
        result.changes === 0
    ) {

        return null;

    }


    return getById(id);

}


// ==========================================================
// DELETE
// ==========================================================

function remove(id) {

    const result =
        db
            .prepare(`
                DELETE FROM knowledge_base
                WHERE id = ?
            `)
            .run(id);


    return result.changes > 0;

}


// ==========================================================
// INCREMENT VIEWS
// ==========================================================

function incrementViews(id) {

    db
        .prepare(`
            UPDATE knowledge_base

            SET views = views + 1

            WHERE id = ?
        `)
        .run(id);

}


// ==========================================================
// CATEGORIES
// ==========================================================

function getCategories() {

    return db
        .prepare(`
            SELECT
                category,
                COUNT(*) AS total
            FROM knowledge_base
            WHERE status = 'PUBLISHED'
            GROUP BY category
            ORDER BY category ASC
        `)
        .all();

}


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {

    getAll,

    getById,

    getBySlug,

    create,

    update,

    remove,

    incrementViews,

    getCategories

};