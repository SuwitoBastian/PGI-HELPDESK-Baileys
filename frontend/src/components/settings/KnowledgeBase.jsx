import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    FileText,
    Video,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Save,
    Upload,
    Play,
    BookOpen
} from "lucide-react";


// ==========================================================
// DEFAULT FORM
// ==========================================================

const EMPTY_FORM = {
    type: "ARTICLE",
    title: "",
    slug: "",
    category: "",
    keywords: "",
    content: "",
    status: "DRAFT",
    videoUrl: "",
    attachmentUrl: "",
    attachmentName: ""
};


// ==========================================================
// COMPONENT
// ==========================================================

export default function KnowledgeBase() {

    // ======================================================
    // STATE
    // ======================================================

    const [contents, setContents] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] =
        useState(EMPTY_FORM);

    const [error, setError] =
        useState("");

    const videoInputRef =
        useRef(null);

    const [uploadingVideo, setUploadingVideo] =
        useState(false);

    const [uploadedVideoName, setUploadedVideoName] =
        useState("");

    const [videoSource, setVideoSource] =
        useState("UPLOAD");

    const [previewVideo, setPreviewVideo] =
        useState(null);

    const previewVideoRef =
        useRef(null);

    const attachmentInputRef =
        useRef(null);

    const [uploadingAttachment, setUploadingAttachment] =
        useState(false);


    // ======================================================
    // LOAD KNOWLEDGE BASE
    // ======================================================

    async function loadContents() {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch("/api/knowledge?status=ALL");

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil Knowledge Base."
                );

            }

            setContents(
                result.data || []
            );

        } catch (err) {

            console.error(
                "Knowledge Base load error:",
                err
            );

            setError(
                err.message ||
                "Gagal mengambil Knowledge Base."
            );

        } finally {

            setLoading(false);

        }

    }


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        loadContents();

    }, []);


    // ======================================================
    // CATEGORY LIST
    // ======================================================

    const categories = useMemo(() => {

        return [
            ...new Set(
                contents
                    .map(item =>
                        item.category
                    )
                    .filter(Boolean)
            )
        ];

    }, [contents]);


    // ======================================================
    // FILTER DATA
    // ======================================================

    const filteredContents =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return contents.filter(item => {

                const matchesSearch =
                    !keyword ||

                    String(
                        item.title || ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        item.category || ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        item.keywords || ""
                    )
                        .toLowerCase()
                        .includes(keyword);


                const matchesCategory =
                    !category ||
                    item.category === category;


                const matchesStatus =
                    !status ||
                    item.status === status;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            });

        }, [
            contents,
            search,
            category,
            status
        ]);


    // ======================================================
    // OPEN CREATE
    // ======================================================

    function openCreate(
        type = "ARTICLE"
    ) {

        setEditingId(null);

        setVideoSource(
            type === "VIDEO"
                ? "UPLOAD"
                : "UPLOAD"
        );

        setUploadedVideoName("");

        setForm({
            ...EMPTY_FORM,
            type
        });

        setError("");

        setModalOpen(true);

    }

// ======================================================
// OPEN VIDEO PREVIEW
// ======================================================

function openVideoPreview(item) {

    if (
        !item ||
        !item.video_url
    ) {
        return;
    }

    setPreviewVideo({

        title:
            item.title,

        url:
            item.video_url

    });

}

function closeVideoPreview() {

    if (previewVideoRef.current) {

        previewVideoRef.current.pause();

        previewVideoRef.current.currentTime = 0;

    }

    setPreviewVideo(null);

}


// ======================================================
// YOUTUBE EMBED URL
// ======================================================

function getYoutubeEmbedUrl(url) {

    if (!url) {
        return null;
    }

    try {

        const parsed =
            new URL(url);


        // youtube.com/watch?v=XXXX
        if (
            parsed.hostname.includes(
                "youtube.com"
            ) &&
            parsed.searchParams.get("v")
        ) {

            const videoId =
                parsed.searchParams.get("v");

            return `https://www.youtube.com/embed/${videoId}`;

        }


        // youtu.be/XXXX
        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            const videoId =
                parsed.pathname.substring(1);

            if (videoId) {

                return `https://www.youtube.com/embed/${videoId}`;

            }

        }


        return null;

    } catch {

        return null;

    }

}


    // ======================================================
    // OPEN EDIT
    // ======================================================

    function openEdit(item) {

        setEditingId(
            item.id
        );

        const existingVideoUrl =
            item.video_url ||
            item.videoUrl ||
            "";

        if (
            existingVideoUrl
                .toLowerCase()
                .includes("youtube.com") ||
            existingVideoUrl
                .toLowerCase()
                .includes("youtu.be")
        ) {

            setVideoSource(
                "YOUTUBE"
            );

        } else {

            setVideoSource(
                "UPLOAD"
            );

        }

        setForm({

            type:
                item.type ||
                "ARTICLE",

            title:
                item.title ||
                "",

            slug:
                item.slug ||
                "",

            category:
                item.category ||
                "",

            keywords:
                item.keywords ||
                "",

            content:
                item.content ||
                "",

            status:
                item.status ||
                "DRAFT",

            videoUrl:
                item.video_url ||
                item.videoUrl ||
                "",

            attachmentUrl:
                item.attachment_url ||
                item.attachmentUrl ||
                "",

            attachmentName:
                item.attachment_name ||
                item.attachmentName ||
                ""

        });

        setError("");

        setModalOpen(true);

    }


    // ======================================================
    // CLOSE MODAL
    // ======================================================

    function closeModal() {

        if (saving) {
            return;
        }

        setModalOpen(false);

        setEditingId(null);

        setForm({
            ...EMPTY_FORM
        });

        setError("");

    }


    // ======================================================
    // HANDLE CHANGE
    // ======================================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));

    }


    // ======================================================
    // TITLE -> SLUG
    // ======================================================

    function handleTitleChange(event) {

        const title =
            event.target.value;

        setForm(current => ({

            ...current,

            title,

            slug:
                editingId
                    ? current.slug
                    : title
                        .toLowerCase()
                        .trim()
                        .replace(
                            /[^a-z0-9\s-]/g,
                            ""
                        )
                        .replace(
                            /\s+/g,
                            "-"
                        )
                        .replace(
                            /-+/g,
                            "-"
                        )

        }));

    }


    // ======================================================
    // SAVE
    // ======================================================

    async function handleSubmit(event) {

        event.preventDefault();

        if (saving) {
            return;
        }

        try {

            setSaving(true);
            setError("");


            const isEdit =
                Boolean(editingId);


            const url =
                isEdit
                    ? `/api/knowledge/${editingId}`
                    : "/api/knowledge";


            const method =
                isEdit
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {

                        method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                type:
                                    form.type,

                                title:
                                    form.title,

                                slug:
                                    form.slug,

                                category:
                                    form.category,

                                content:
                                    form.content,

                                keywords:
                                    form.keywords,

                                status:
                                    form.status,

                                videoUrl:
                                    form.videoUrl,

                                attachmentUrl:
                                    form.attachmentUrl,

                                attachmentName:
                                    form.attachmentName

                            })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal menyimpan konten."
                );

            }


            closeModal();

            await loadContents();


        } catch (err) {

            console.error(
                "Knowledge Base save error:",
                err
            );

            setError(
                err.message ||
                "Gagal menyimpan konten."
            );

        } finally {

            setSaving(false);

        }

    }


    // ======================================================
    // DELETE
    // ======================================================

    async function handleDelete(item) {

        const confirmed =
            window.confirm(
                `Hapus "${item.title}"?\n\nKonten yang dihapus tidak dapat dikembalikan.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");


            const response =
                await fetch(
                    `/api/knowledge/${item.id}`,
                    {
                        method:
                            "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal menghapus konten."
                );

            }


            await loadContents();


        } catch (err) {

            console.error(
                "Knowledge Base delete error:",
                err
            );

            setError(
                err.message ||
                "Gagal menghapus konten."
            );

        }

    }


    // ======================================================
    // DELETE FROM EDIT MODAL
    // ======================================================

    async function handleDeleteFromModal() {

        if (!editingId) {
            return;
        }

        const item =
            contents.find(
                content =>
                    content.id ===
                    editingId
            );


        if (!item) {
            return;
        }


        const confirmed =
            window.confirm(
                `Hapus "${item.title}"?\n\nKonten yang dihapus tidak dapat dikembalikan.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setSaving(true);
            setError("");


            const response =
                await fetch(
                    `/api/knowledge/${item.id}`,
                    {
                        method:
                            "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal menghapus konten."
                );

            }


            setModalOpen(false);

            setEditingId(null);

            setForm({
                ...EMPTY_FORM
            });

            await loadContents();


        } catch (err) {

            console.error(
                "Knowledge Base delete error:",
                err
            );

            setError(
                err.message ||
                "Gagal menghapus konten."
            );

        } finally {

            setSaving(false);

        }

    }

    // ======================================================
    // UPLOAD VIDEO
    // ======================================================

    async function handleVideoUpload(file) {

        if (!file) {
            return;
        }


        // Validasi extension
        if (
            !file.name
                .toLowerCase()
                .endsWith(".mp4")
        ) {

            setError(
                "Video harus berformat MP4."
            );

            return;

        }


        // Validasi ukuran 50 MB
        const maxSize =
            50 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            setError(
                "Ukuran video maksimal 50 MB."
            );

            return;

        }


        try {

            setUploadingVideo(true);

            setError("");

            setUploadedVideoName("");


            const formData =
                new FormData();

            formData.append(
                "video",
                file
            );


            const response =
                await fetch(
                    "/api/knowledge/upload-video",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal upload video."
                );

            }


            // URL video dari server
            setForm(current => ({

                ...current,

                videoUrl:
                    result.data.url

            }));


            setUploadedVideoName(
                result.data.originalName ||
                file.name
            );


        } catch (err) {

            console.error(
                "Video upload error:",
                err
            );


            setError(
                err.message ||
                "Gagal upload video."
            );

        } finally {

            setUploadingVideo(false);

        }

    }

    // ======================================================
// UPLOAD ARTICLE ATTACHMENT
// ======================================================

async function handleAttachmentUpload(file) {

    if (!file) {
        return;
    }

    if (
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {
        setError("Materi harus berformat PDF.");
        return;
    }

    const maxSize =
        20 * 1024 * 1024;

    if (file.size > maxSize) {
        setError("Ukuran materi maksimal 20 MB.");
        return;
    }

    try {

        setUploadingAttachment(true);
        setError("");

        const formData =
            new FormData();

        formData.append(
            "attachment",
            file
        );

        const response =
            await fetch(
                "/api/knowledge/upload-attachment",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Gagal upload materi."
            );

        }

        setForm(current => ({
            ...current,

            attachmentUrl:
                result.data.url,

            attachmentName:
                result.data.originalName ||
                file.name
        }));

    } catch (err) {

        console.error(
            "Attachment upload error:",
            err
        );

        setError(
            err.message ||
            "Gagal upload materi."
        );

    } finally {

        setUploadingAttachment(false);

    }

}


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="knowledge-page">


            {/* ==================================================
                ACTION BAR

                Header Knowledge Base sudah dibuat oleh App.jsx.
                Jadi di sini hanya tombol aksi.
            ================================================== */}

            <div
                className="knowledge-header-actions"
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginBottom: "24px"
                }}
            >

                <button
                    type="button"
                    className="knowledge-secondary-action"
                    onClick={() =>
                        openCreate("ARTICLE")
                    }
                >

                    <FileText
                        size={17}
                    />

                    <span>
                        Tambah Artikel
                    </span>

                </button>


                <button
                    type="button"
                    className="knowledge-primary-button"
                    onClick={() =>
                        openCreate("VIDEO")
                    }
                >

                    <Video
                        size={17}
                    />

                    <span>
                        Post Video
                    </span>

                </button>

            </div>


            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="knowledge-toolbar">


                {/* SEARCH */}

                <div className="knowledge-search">

                    <Search
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Cari artikel, kategori, atau keyword..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* CATEGORY */}

                <select
                    value={category}
                    onChange={event =>
                        setCategory(
                            event.target.value
                        )
                    }
                >

                    <option value="">
                        Semua Kategori
                    </option>


                    {categories.map(item => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>


                {/* STATUS */}

                <select
                    value={status}
                    onChange={event =>
                        setStatus(
                            event.target.value
                        )
                    }
                >

                    <option value="">
                        Semua Status
                    </option>

                    <option value="PUBLISHED">
                        Published
                    </option>

                    <option value="DRAFT">
                        Draft
                    </option>

                </select>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="knowledge-error">

                    {error}

                </div>

            )}


            {/* ==================================================
                CONTENT LIST
            ================================================== */}

            <div className="knowledge-list-card">


                {/* TABLE HEADER */}

                <div className="knowledge-list-header">

                    <span>
                        KONTEN
                    </span>

                    <span>
                        KATEGORI
                    </span>

                    <span>
                        STATUS
                    </span>

                    <span>
                        AKSI
                    </span>

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="knowledge-state">

                        Memuat Knowledge Base...

                    </div>


                ) : filteredContents.length === 0 ? (

                    <div className="knowledge-state">

                        <BookOpen
                            size={34}
                        />

                        <strong>
                            Belum ada konten
                        </strong>

                        <span>
                            Tambahkan artikel atau video
                            untuk Knowledge Base.
                        </span>


                        

                    </div>


                ) : (

                    filteredContents.map(item => (

                        <div
                            key={item.id}
                            className="knowledge-row"
                        >


                            {/* ==================================================
                                CONTENT
                            ================================================== */}

                            <div className="knowledge-content-info">

                                <div
                                    className={
                                        item.type === "VIDEO"
                                            ? "knowledge-content-icon video"
                                            : "knowledge-content-icon"
                                    }
                                >

                                    {item.type === "VIDEO" ? (

                                        <Video
                                            size={21}
                                        />

                                    ) : (

                                        <FileText
                                            size={21}
                                        />

                                    )}

                                </div>


                                <div>

                                    <div
                                        className="knowledge-content-title"
                                    >

                                        {item.title}

                                    </div>


                                    <div
                                        className="knowledge-content-description"
                                    >

                                        {item.content

                                            ? item.content
                                                .replace(
                                                    /<[^>]*>/g,
                                                    ""
                                                )
                                                .replace(
                                                    /\s+/g,
                                                    " "
                                                )
                                                .trim()
                                                .slice(
                                                    0,
                                                    90
                                                )

                                            : item.type === "VIDEO"

                                                ? "Video tutorial troubleshooting IT."

                                                : "Belum ada deskripsi."
                                        }


                                        {item.content &&
                                            item.content
                                                .replace(
                                                    /<[^>]*>/g,
                                                    ""
                                                )
                                                .length > 90
                                            ? "..."
                                            : ""
                                        }

                                    </div>

                                </div>

                            </div>


                            {/* ==================================================
                                CATEGORY
                            ================================================== */}

                            <div>

                                <span
                                    className="knowledge-category"
                                >

                                    {item.category || "-"}

                                </span>

                            </div>


                            {/* ==================================================
                                STATUS
                            ================================================== */}

                            <div>

                                <span
                                    className={
                                        item.status === "PUBLISHED"
                                            ? "knowledge-status published"
                                            : "knowledge-status draft"
                                    }
                                >

                                    {item.status}

                                </span>

                            </div>


                            {/* ==================================================
                                ACTION
                            ================================================== */}

                            <div className="knowledge-actions">


                                {/* VIDEO PREVIEW */}

                                {item.type === "VIDEO" &&
                                    item.video_url && (

                                        <button
                                            type="button"
                                            className="knowledge-action video"
                                            title="Preview Video"
                                            onClick={() =>
                                                openVideoPreview(item)
                                            }
                                        >

                                            <Play
                                                size={15}
                                            />

                                        </button>

                                    )}


                                {/* EDIT */}

                                <button
                                    type="button"
                                    className="knowledge-action"
                                    title="Edit Konten"
                                    onClick={() =>
                                        openEdit(item)
                                    }
                                >

                                    <Pencil
                                        size={15}
                                    />

                                </button>


                                {/* DELETE */}

                                <button
                                    type="button"
                                    className="knowledge-action danger"
                                    title="Hapus Konten"
                                    onClick={() =>
                                        handleDelete(item)
                                    }
                                >

                                    <Trash2
                                        size={15}
                                    />

                                </button>

                            </div>


                        </div>

                    ))

                )}

            </div>


            {/* ==================================================
                MODAL
            ================================================== */}

            {modalOpen && (

                <div
                    className="knowledge-modal-backdrop"
                >

                    <div
                        className="knowledge-editor"
                    >


                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

                        <div
                            className="knowledge-editor-header"
                        >

                            <div>

                                <h2>

                                    {editingId

                                        ? "Edit Konten"

                                        : form.type === "VIDEO"

                                            ? "Post Video"

                                            : "Tambah Artikel"

                                    }

                                </h2>

                                <p>
                                    Kelola artikel atau
                                    video Knowledge Base.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="knowledge-close"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* ==================================================
                            TYPE TABS
                        ================================================== */}

                        <div
                            className="knowledge-type-tabs"
                        >


                            {/* ARTICLE */}

                            <button
                                type="button"
                                className={
                                    form.type === "ARTICLE"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setForm(current => ({
                                        ...current,
                                        type: "ARTICLE"
                                    }))
                                }
                                disabled={
                                    Boolean(editingId)
                                }
                            >

                                <FileText
                                    size={16}
                                />

                                Artikel

                            </button>


                            {/* VIDEO */}

                            <button
                                type="button"
                                className={
                                    form.type === "VIDEO"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setForm(current => ({
                                        ...current,
                                        type: "VIDEO"
                                    }))
                                }
                                disabled={
                                    Boolean(editingId)
                                }
                            >

                                <Video
                                    size={16}
                                />

                                Video

                            </button>

                        </div>


                        {/* ==================================================
                            FORM
                        ================================================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="knowledge-editor-form"
                        >


                            {/* TITLE */}

                            <div className="knowledge-field">

                                <label>
                                    Judul Konten *
                                </label>

                                <input
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleTitleChange
                                    }
                                    required
                                    placeholder={
                                        form.type === "VIDEO"

                                            ? "Contoh: Cara Reset Password Windows"

                                            : "Contoh: Printer Tidak Bisa Mencetak"
                                    }
                                />

                            </div>


                            {/* SLUG */}

                            <div className="knowledge-field">

                                <label>
                                    Slug *
                                </label>

                                <input
                                    name="slug"
                                    value={
                                        form.slug
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    placeholder="printer-tidak-bisa-mencetak"
                                />

                                <small>
                                    Gunakan huruf kecil,
                                    angka, dan tanda -
                                </small>

                            </div>


                            {/* CATEGORY + STATUS */}

                            <div
                                className="knowledge-field-row"
                            >

                                <div
                                    className="knowledge-field"
                                >

                                    <label>
                                        Kategori *
                                    </label>

                                    <input
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        placeholder="Printer"
                                    />

                                </div>


                                <div
                                    className="knowledge-field"
                                >

                                    <label>
                                        Status *
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="DRAFT">
                                            DRAFT
                                        </option>

                                        <option value="PUBLISHED">
                                            PUBLISHED
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* KEYWORDS */}

                            <div className="knowledge-field">

                                <label>
                                    Keywords
                                </label>

                                <input
                                    name="keywords"
                                    value={
                                        form.keywords
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="printer, cetak, print, tidak bisa mencetak"
                                />

                                <small>
                                    Pisahkan dengan koma.
                                </small>

                            </div>


                            {/* ==================================================
                                ARTICLE CONTENT
                            ================================================== */}

                            {form.type === "ARTICLE" && (

                                <div
                                    className="knowledge-field"
                                >

                                    <label>
                                        Content / Solusi *
                                    </label>


                                    <div
                                        className="knowledge-editor-box"
                                    >

                                        <div
                                            className="knowledge-editor-toolbar"
                                        >

                                            <button
                                                type="button"
                                                title="Bold"
                                            >
                                                <strong>
                                                    B
                                                </strong>
                                            </button>

                                            <button
                                                type="button"
                                                title="Italic"
                                            >
                                                <em>
                                                    I
                                                </em>
                                            </button>

                                            <button
                                                type="button"
                                                title="Underline"
                                            >
                                                <u>
                                                    U
                                                </u>
                                            </button>

                                            <span />

                                            <button
                                                type="button"
                                                title="Bullet List"
                                            >
                                                •
                                            </button>

                                            <button
                                                type="button"
                                                title="List"
                                            >
                                                ≡
                                            </button>

                                            <button
                                                type="button"
                                                title="Link"
                                            >
                                                🔗
                                            </button>

                                        </div>


                                        <textarea
                                            name="content"
                                            value={
                                                form.content
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                            rows={8}
                                            placeholder="Tuliskan langkah penyelesaian kendala..."
                                        />

                                    </div>

                                </div>

                            )}

                                {form.type === "ARTICLE" && (

                                <div className="knowledge-field">

                                    <label>
                                        Materi / Lampiran Artikel
                                    </label>

                                    <div
                                        className="knowledge-upload-box"
                                        onClick={() =>
                                            !uploadingAttachment &&
                                            attachmentInputRef.current?.click()
                                        }
                                        onDragOver={event =>
                                            event.preventDefault()
                                        }
                                        onDrop={event => {

                                            event.preventDefault();

                                            if (uploadingAttachment) {
                                                return;
                                            }

                                            const file =
                                                event.dataTransfer.files?.[0];

                                            handleAttachmentUpload(file);

                                        }}
                                        style={{
                                            cursor:
                                                uploadingAttachment
                                                    ? "wait"
                                                    : "pointer"
                                        }}
                                    >

                                        <input
                                            ref={attachmentInputRef}
                                            type="file"
                                            accept="application/pdf,.pdf"
                                            hidden
                                            onChange={event => {

                                                const file =
                                                    event.target.files?.[0];

                                                handleAttachmentUpload(file);

                                                event.target.value = "";

                                            }}
                                        />

                                        {uploadingAttachment ? (

                                            <>

                                                <Upload size={30} />

                                                <strong>
                                                    Mengupload materi...
                                                </strong>

                                                <span>
                                                    Mohon tunggu sebentar
                                                </span>

                                            </>

                                        ) : form.attachmentName ? (

                                            <>

                                                <FileText size={30} />

                                                <strong>
                                                    {form.attachmentName}
                                                </strong>

                                                <span>
                                                    Materi PDF berhasil diupload
                                                </span>

                                                <span>
                                                    Klik untuk mengganti file
                                                </span>

                                            </>

                                        ) : (

                                            <>

                                                <Upload size={30} />

                                                <strong>
                                                    Upload materi PDF
                                                </strong>

                                                <span>
                                                    PDF, maksimal 20 MB
                                                </span>

                                                <span>
                                                    atau drag &amp; drop file di sini
                                                </span>

                                            </>

                                        )}

                                    </div>

                                    <small>
                                        Opsional. Materi ini dapat didownload
                                        dari GuestPortal.
                                    </small>

                                </div>

                            )}

                            {/* ==================================================
                                VIDEO
                            ================================================== */}

                            {form.type === "VIDEO" && (

                                <div className="knowledge-video-section">


                                    {/* ==================================================
                                        VIDEO SOURCE
                                    ================================================== */}

                                    <div className="knowledge-field">

                                        <label>
                                            Video Tutorial
                                        </label>


                                        <div className="knowledge-video-tabs">


                                            {/* UPLOAD */}

                                            <button
                                                type="button"
                                                className={
                                                    videoSource === "UPLOAD"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => {

                                                    setVideoSource("UPLOAD");

                                                    setError("");

                                                }}
                                            >

                                                <Upload size={15} />

                                                Upload Video

                                            </button>


                                            {/* YOUTUBE */}

                                            <button
                                                type="button"
                                                className={
                                                    videoSource === "YOUTUBE"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => {

                                                    setVideoSource("YOUTUBE");

                                                    setError("");

                                                }}
                                            >

                                                <Play size={15} />

                                                Link YouTube

                                            </button>

                                        </div>


                                        {/* ==================================================
                                            UPLOAD VIDEO
                                        ================================================== */}

                                        {videoSource === "UPLOAD" && (

                                            <div
                                                className="knowledge-upload-box"

                                                onClick={() =>
                                                    !uploadingVideo &&
                                                    videoInputRef.current?.click()
                                                }

                                                onDragOver={event =>
                                                    event.preventDefault()
                                                }

                                                onDrop={event => {

                                                    event.preventDefault();

                                                    if (uploadingVideo) {
                                                        return;
                                                    }

                                                    const file =
                                                        event.dataTransfer.files?.[0];

                                                    handleVideoUpload(file);

                                                }}

                                                style={{
                                                    cursor:
                                                        uploadingVideo
                                                            ? "wait"
                                                            : "pointer"
                                                }}
                                            >

                                                <input
                                                    ref={videoInputRef}
                                                    type="file"
                                                    accept="video/mp4,.mp4"
                                                    hidden

                                                    onChange={event => {

                                                        const file =
                                                            event.target.files?.[0];

                                                        handleVideoUpload(file);

                                                        event.target.value = "";

                                                    }}
                                                />


                                                {uploadingVideo ? (

                                                    <>

                                                        <Upload size={30} />

                                                        <strong>
                                                            Mengupload video...
                                                        </strong>

                                                        <span>
                                                            Mohon tunggu sebentar
                                                        </span>

                                                    </>

                                                ) : uploadedVideoName ? (

                                                    <>

                                                        <Video size={30} />

                                                        <strong>
                                                            {uploadedVideoName}
                                                        </strong>

                                                        <span>
                                                            Video berhasil diupload
                                                        </span>

                                                        <span>
                                                            Klik untuk mengganti video
                                                        </span>

                                                    </>

                                                ) : (

                                                    <>

                                                        <Upload size={30} />

                                                        <strong>
                                                            Upload video
                                                        </strong>

                                                        <span>
                                                            MP4, maksimal 50 MB
                                                        </span>

                                                        <span>
                                                            atau drag &amp; drop file di sini
                                                        </span>

                                                    </>

                                                )}

                                            </div>

                                        )}


                                        {/* ==================================================
                                            YOUTUBE URL
                                        ================================================== */}

                                        {videoSource === "YOUTUBE" && (

                                            <>

                                                <input
                                                    name="videoUrl"

                                                    value={
                                                        form.videoUrl
                                                    }

                                                    onChange={
                                                        handleChange
                                                    }

                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />

                                                <small>
                                                    Masukkan link YouTube.
                                                </small>

                                            </>

                                        )}

                                    </div>


                                    {/* ==================================================
                                        VIDEO DESCRIPTION
                                    ================================================== */}

                                    <div className="knowledge-field">

                                        <label>
                                            Deskripsi / Penjelasan Video
                                        </label>


                                        <textarea
                                            name="content"

                                            value={
                                                form.content
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            rows={6}

                                            placeholder="Jelaskan isi video, langkah-langkah yang dijelaskan, atau informasi tambahan yang perlu diketahui setelah menonton video..."
                                        />


                                        <small>
                                            Opsional. Penjelasan ini akan ditampilkan
                                            di bawah video pada Knowledge Base.
                                        </small>

                                    </div>


                                </div>

                            )}


                            {/* ==================================================
                                FOOTER
                            ================================================== */}

                            <div
                                className="knowledge-editor-footer"
                            >

                                <button
                                    type="button"
                                    className="knowledge-secondary-button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >

                                    Batal

                                </button>


                                {/* DELETE */}

                                {editingId && (

                                    <button
                                        type="button"
                                        className="knowledge-modal-delete"
                                        onClick={
                                            handleDeleteFromModal
                                        }
                                        disabled={
                                            saving
                                        }
                                    >

                                        <Trash2
                                            size={16}
                                        />

                                        Hapus Konten

                                    </button>

                                )}


                                {/* SAVE */}

                                <button
                                    type="submit"
                                    className="knowledge-primary-button"
                                    disabled={
                                        saving
                                    }
                                >

                                    <Save
                                        size={16}
                                    />

                                    {saving

                                        ? "Menyimpan..."

                                        : editingId

                                            ? "Simpan Perubahan"

                                            : "Simpan Konten"

                                    }

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}


            {/* ==================================================
                VIDEO PREVIEW MODAL
            ================================================== */}

            {previewVideo && (

                <div
                    className="knowledge-preview-overlay"
                    onClick={closeVideoPreview}
                >

                    <div
                        className="knowledge-preview-modal"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >

                        <div
                            className="knowledge-preview-header"
                        >

                            <div>

                                <h3>
                                    {previewVideo.title}
                                </h3>

                                <span>
                                    Video Tutorial
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={closeVideoPreview}
                            >
                                <X
                                    size={22}
                                />
                            </button>

                        </div>


                        <div
                            className="knowledge-preview-player"
                        >

                            {getYoutubeEmbedUrl(previewVideo.url) ? (

                                <iframe
                                    key={previewVideo.url}
                                    src={getYoutubeEmbedUrl(previewVideo.url)}
                                    title={previewVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />

                            ) : (

                                <video
                                    ref={previewVideoRef}
                                    src={previewVideo.url}
                                    controls
                                    preload="metadata"
                                    playsInline
                                />

                            )}

                        </div>

                    </div>

                </div>

            )}


        </div>

    );

}