import React, {
    useEffect,
    useMemo,
    useState
} from "react";


/* ==========================================================
   YOUTUBE EMBED
========================================================== */

function getYoutubeEmbedUrl(url) {

    if (!url) {
        return null;
    }

    try {

        const parsedUrl = new URL(url);

        let videoId = null;


        // youtube.com/watch?v=XXXX
        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.searchParams.get("v")
        ) {

            videoId =
                parsedUrl.searchParams.get("v");

        }


        // youtu.be/XXXX
        else if (
            parsedUrl.hostname === "youtu.be"
        ) {

            videoId =
                parsedUrl.pathname
                    .replace("/", "")
                    .trim();

        }


        // youtube.com/embed/XXXX
        else if (
            parsedUrl.pathname.startsWith("/embed/")
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/embed/")[1]
                    ?.split("/")[0];

        }


        if (!videoId) {
            return null;
        }


        return (
            `https://www.youtube.com/embed/${videoId}`
        );

    } catch {

        return null;

    }

}


/* ==========================================================
   TIKTOK EMBED
========================================================== */

function getTiktokEmbedUrl(url) {

    if (!url) {
        return null;
    }

    try {

        const parsedUrl =
            new URL(url.trim());

        const hostname =
            parsedUrl.hostname
                .toLowerCase()
                .replace(/^www\./, "");

        if (
            hostname !== "tiktok.com" &&
            hostname !== "m.tiktok.com"
        ) {
            return null;
        }

        const match =
            parsedUrl.pathname.match(
                /\/video\/(\d+)/
            );

        if (!match) {
            return null;
        }

        return (
            `https://www.tiktok.com/player/v1/${match[1]}`
        );

    } catch {

        return null;

    }

}


/* ==========================================================
   TIKTOK RESOLVER
========================================================== */

async function resolveTikTokEmbedUrl(url) {

    if (!url) {
        return null;
    }

    const directEmbed =
        getTiktokEmbedUrl(url);

    if (directEmbed) {
        return directEmbed;
    }

    try {

        const response =
            await fetch(
                `/api/knowledge/tiktok-resolve?url=${encodeURIComponent(
                    url.trim()
                )}`
            );

        if (!response.ok) {
            return null;
        }

        const result =
            await response.json();

        if (
            result.ok &&
            result.data &&
            result.data.embedUrl
        ) {
            return result.data.embedUrl;
        }

        return null;

    } catch (error) {

        console.error(
            "TikTok resolver error:",
            error
        );

        return null;

    }

}
/* ==========================================================
   GUEST PORTAL
========================================================== */

export default function GuestPortal() {

    const [contents, setContents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [showAll, setShowAll] =
        useState(false);

    const [selectedContent, setSelectedContent] =
        useState(null);

    const [tiktokEmbedUrl, setTiktokEmbedUrl] =
        useState(null);

    const [tiktokLoading, setTiktokLoading] =
        useState(false);



    /* ======================================================
       LOAD KNOWLEDGE BASE
    ====================================================== */

    useEffect(() => {

        async function loadKnowledge() {

            try {

                const response =
                    await fetch("/api/knowledge");


                if (!response.ok) {

                    throw new Error(
                        "Gagal mengambil panduan IT."
                    );

                }


                const result =
                    await response.json();


                if (
                    result.ok &&
                    Array.isArray(result.data)
                ) {

                    const published =
                        result.data.filter(
                            item =>
                                item.status === "PUBLISHED"
                        );


                    setContents(
                        published
                    );

                } else {

                    setContents([]);

                }

            } catch (error) {

                console.error(
                    "Guest Portal error:",
                    error
                );

                setContents([]);

            } finally {

                setLoading(false);

            }

        }


        loadKnowledge();

    }, []);


    /* ======================================================
       RESOLVE TIKTOK
    ====================================================== */

    useEffect(() => {

        let cancelled = false;

        async function resolveSelectedTikTok() {

            setTiktokEmbedUrl(null);

            if (
                !selectedContent ||
                selectedContent.type !== "VIDEO" ||
                !selectedContent.video_url
            ) {
                setTiktokLoading(false);
                return;
            }

            const url =
                selectedContent.video_url.trim();

            if (
                getYoutubeEmbedUrl(url) ||
                url.startsWith("/uploads/knowledge/")
            ) {
                setTiktokLoading(false);
                return;
            }

            setTiktokLoading(true);

            const embedUrl =
                await resolveTikTokEmbedUrl(url);

            if (!cancelled) {
                setTiktokEmbedUrl(embedUrl);
                setTiktokLoading(false);
            }

        }

        resolveSelectedTikTok();

        return () => {
            cancelled = true;
        };

    }, [selectedContent]);


    /* ======================================================
       CATEGORY
    ====================================================== */

    const categories =
        useMemo(() => {

            const values =
                contents
                    .map(
                        item =>
                            item.category
                    )
                    .filter(Boolean);


            return [
                ...new Set(values)
            ];

        }, [
            contents
        ]);


    /* ======================================================
       SEARCH + CATEGORY
    ====================================================== */

    const filteredContents =
        useMemo(() => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            return contents.filter(
                item => {

                    if (
                        selectedCategory !== "ALL" &&
                        item.category !== selectedCategory
                    ) {

                        return false;

                    }


                    if (!keyword) {

                        return true;

                    }


                    const title =
                        item.title || "";

                    const category =
                        item.category || "";

                    const keywords =
                        item.keywords || "";

                    const content =
                        item.content
                            ? item.content
                                .replace(
                                    /<[^>]*>/g,
                                    " "
                                )
                            : "";


                    const searchableText = (

                        title +
                        " " +
                        category +
                        " " +
                        keywords +
                        " " +
                        content

                    ).toLowerCase();


                    return searchableText.includes(
                        keyword
                    );

                }
            );

        }, [
            contents,
            search,
            selectedCategory
        ]);


    /* ======================================================
       DISPLAY
    ====================================================== */

    const displayedContents =
        showAll ||
        search.trim() ||
        selectedCategory !== "ALL"

            ? filteredContents

            : filteredContents.slice(
                0,
                4
            );


    /* ======================================================
       DESCRIPTION
    ====================================================== */

    function getDescription(item) {

        if (item.content) {

            const text =
                item.content
                    .replace(
                        /<[^>]*>/g,
                        " "
                    )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            if (text) {

                return (
                    text.slice(0, 120) +
                    (
                        text.length > 120
                            ? "..."
                            : ""
                    )
                );

            }

        }


        if (
            item.type === "VIDEO"
        ) {

            return (
                "Video panduan penanganan kendala IT."
            );

        }


        return (
            "Panduan penyelesaian kendala IT yang umum terjadi."
        );

    }


    /* ======================================================
       OPEN DETAIL
    ====================================================== */

    function openDetail(item) {

        if (!item) {
            return;
        }


        console.log(
            "OPEN KNOWLEDGE:",
            item
        );


        setSelectedContent(item);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ======================================================
       CLOSE DETAIL
    ====================================================== */

    function closeDetail() {

        setSelectedContent(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ======================================================
       CATEGORY CLICK
    ====================================================== */

    function handleCategory(category) {

        setSelectedCategory(
            category
        );

        setShowAll(true);

        setSearch("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ======================================================
       SHOW ALL
    ====================================================== */

    function handleShowAll() {

        setShowAll(true);

        setSelectedCategory(
            "ALL"
        );

        setSearch("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ======================================================
       BACK HOME
    ====================================================== */

    function handleBackHome() {

        setShowAll(false);

        setSelectedCategory(
            "ALL"
        );

        setSearch("");

        setSelectedContent(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ======================================================
       DETAIL VIEW
    ====================================================== */

    if (selectedContent) {

        const youtubeUrl =
            selectedContent.type === "VIDEO"
                ? getYoutubeEmbedUrl(
                    selectedContent.video_url
                )
                : null;


        const tiktokUrl =
            selectedContent.type === "VIDEO"
                ? tiktokEmbedUrl
                : null;

const isUploadedVideo =
            selectedContent.type === "VIDEO" &&
            selectedContent.video_url &&
            selectedContent.video_url.startsWith("/uploads/knowledge/");


        return (

            <div className="guest-portal">

                <div className="guest-container">


                    {/* ==========================================
                       HEADER
                    ========================================== */}

                    <div className="guest-header">

                        <div className="guest-brand">

                            <div className="guest-brand-title">
                                IT HELPDESK
                            </div>

                            <div className="guest-brand-subtitle">
                                Pusat Bantuan IT
                            </div>

                        </div>


                        <a
                            href="/login"
                            className="guest-login"
                        >
                            Login Staf IT
                        </a>

                    </div>


                    {/* ==========================================
                       DETAIL
                    ========================================== */}

                    <main className="guest-detail">

                        <button
                            type="button"
                            className="guest-detail-back"
                            onClick={closeDetail}
                        >
                            ← Kembali ke Panduan IT
                        </button>

                        <div className="guest-detail-meta">

                            <span className="guest-detail-category">
                                {selectedContent.category || "Dukungan IT"}
                            </span>


                            <span className="guest-detail-type">

                                {selectedContent.type === "VIDEO"
                                    ? "Video"
                                    : "Artikel"
                                }

                            </span>

                        </div>


                        <h1 className="guest-detail-title">
                            {selectedContent.title}
                        </h1>


                        {/* ======================================
                           VIDEO
                        ====================================== */}

                        {selectedContent.type === "VIDEO" && (

                            <div className="guest-detail-video">

                                {youtubeUrl ? (

                                    <iframe
                                        src={youtubeUrl}
                                        title={
                                            selectedContent.title
                                        }
                                        allow="
                                            accelerometer;
                                            autoplay;
                                            clipboard-write;
                                            encrypted-media;
                                            gyroscope;
                                            picture-in-picture;
                                            web-share
                                        "
                                        allowFullScreen
                                    />

                                ) : tiktokUrl ? (

                                    <iframe
                                        src={tiktokUrl}
                                        title={
                                            selectedContent.title
                                        }
                                        allow="
                                            autoplay;
                                            encrypted-media;
                                            fullscreen;
                                            picture-in-picture
                                        "
                                        allowFullScreen
                                    /> ) : tiktokLoading ? (

                                    <div className="guest-detail-video-error">
                                        Memuat video TikTok...
                                    </div>

                                ) : isUploadedVideo ? (

                                        <div>
                                            <video
                                                src={
                                                    selectedContent.video_url
                                                }
                                                controls
                                                preload="metadata"
                                                playsInline
                                            />

                                            <a
                                                href={selectedContent.video_url}
                                                download
                                                className="guest-download-button"
                                                onClick={event => event.stopPropagation()}
                                            >
                                                Download Video
                                            </a>
                                        </div>

                                    ) : (

                                    <div className="guest-detail-video-error">

                                        Video tidak tersedia.

                                    </div>

                                )}

                            </div>

                        )}


                        {/* ======================================
                           ARTICLE
                        ====================================== */}

                        {selectedContent.type !== "VIDEO" && (

                            <>

                                <div
                                    className="guest-detail-content"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectedContent.content ||
                                            "<p>Belum ada konten.</p>"
                                    }}
                                />

                                {selectedContent.attachment_url && (

                                    <div className="guest-detail-attachment">

                                        <a
                                            href={selectedContent.attachment_url}
                                            download={
                                                selectedContent.attachment_name ||
                                                true
                                            }
                                            className="guest-download-button"
                                            onClick={event =>
                                                event.stopPropagation()
                                            }
                                        >
                                            Download Materi
                                            {selectedContent.attachment_name
                                                ? ` - ${selectedContent.attachment_name}`
                                                : ""
                                            }
                                        </a>

                                    </div>

                                )}

                            </>

                        )}


                        {/* ======================================
                           VIDEO DESCRIPTION
                        ====================================== */}

                        {selectedContent.type === "VIDEO" &&
                            selectedContent.content && (

                                <div
                                    className="guest-detail-description"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectedContent.content
                                    }}
                                />

                            )}

                    </main>


                    {/* ==========================================
                       FOOTER
                    ========================================== */}

                    <footer className="guest-footer">

                        <div className="guest-footer-help">

                            <span>
                                Butuh bantuan lebih lanjut?
                            </span>

                            <span>
                                Silakan buat laporan kendala di grup IT-AM.
                            </span>

                        </div>

                    </footer>
                </div>

            </div>

        );

    }


    /* ======================================================
       HOME VIEW
    ====================================================== */

    return (

        <div className="guest-portal">

            <div className="guest-container">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="guest-header">

                    <div className="guest-brand">

                        <div className="guest-brand-title">
                            IT HELPDESK
                        </div>

                        <div className="guest-brand-subtitle">
                            Pusat Bantuan IT
                        </div>

                    </div>


                    <a
                        href="/login"
                        className="guest-login"
                    >
                        Login Staf IT
                    </a>

                </div>


                {/* ==================================================
                    HERO
                ================================================== */}

                {!showAll && (

                    <section className="guest-hero">

                        <div className="guest-hero-content">

                            <div className="guest-hero-badge">
                                IT SUPPORT
                            </div>


                            <h1>
                                Ada kendala IT?
                            </h1>


                            <p>
                                Cari solusi terlebih dahulu melalui
                                Panduan IT sebelum membuat laporan.
                            </p>


                            <div className="guest-search">

                                <span
                                    className="guest-search-icon"
                                    aria-hidden="true"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="7"
                                        />

                                        <path
                                            d="m20 20-4-4"
                                        />
                                    </svg>
                                </span>


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Cari kendala, aplikasi, atau solusi..."
                                />

                            </div>

                        </div>

                    </section>

                )}


                {/* ==================================================
                    KNOWLEDGE BASE
                ================================================== */}

                <section className="guest-section">


                    <div className="guest-section-header">

                        <div>

                            <h2>
                                {showAll
                                    ? "Semua Panduan IT"
                                    : "Panduan IT"
                                }
                            </h2>


                            <p>
                                {showAll
                                    ? "Temukan panduan dan solusi penyelesaian kendala IT."
                                    : "Temukan panduan penyelesaian kendala IT yang umum terjadi."
                                }
                            </p>

                        </div>


                        {!showAll && (

                            <button
                                type="button"
                                className="guest-view-all"
                                onClick={
                                    handleShowAll
                                }
                            >
                                Lihat Semua Panduan IT →
                            </button>

                        )}


                        {showAll && (

                            <button
                                type="button"
                                className="guest-view-all"
                                onClick={
                                    handleBackHome
                                }
                            >
                                ← Kembali
                            </button>

                        )}

                    </div>


                    {/* ==================================================
                        SEARCH ALL
                    ================================================== */}

                    {showAll && (

                        <div className="guest-search guest-search-all">

                            <span
                                className="guest-search-icon"
                                aria-hidden="true"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path
                                        d="m20 20-4-4"
                                    />
                                </svg>
                            </span>


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Cari panduan, kategori, atau kata kunci..."
                            />

                        </div>

                    )}


                    {/* ==================================================
                        CATEGORIES
                    ================================================== */}

                    {!loading &&
                        categories.length > 0 && (

                            <div className="guest-categories">

                                <button
                                    type="button"
                                    className={
                                        selectedCategory === "ALL"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        handleCategory("ALL")
                                    }
                                >
                                    Semua
                                </button>


                                {categories.map(
                                    category => (

                                        <button
                                            key={category}
                                            type="button"
                                            className={
                                                selectedCategory === category
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleCategory(category)
                                            }
                                        >
                                            {category}
                                        </button>

                                    )
                                )}

                            </div>

                        )}


                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="guest-articles">

                        {loading ? (

                            <div className="guest-state">
                                Memuat Knowledge Base...
                            </div>

                        ) : displayedContents.length === 0 ? (

                            <div className="guest-state">

                                {search.trim()
                                    ? "Panduan IT tidak ditemukan."
                                    : "Belum ada panduan IT yang dipublikasikan."
                                }

                            </div>

                        ) : (

                            displayedContents.map(
                                item => (

                                    <article
                                        key={
                                            item.id
                                        }
                                        className="guest-article"
                                        onClick={() =>
                                            openDetail(item)
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={
                                            (event) => {

                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {

                                                    openDetail(
                                                        item
                                                    );

                                                }

                                            }
                                        }
                                    >

                                        {/* ==================================
                                           BODY
                                        ================================== */}

                                        <div className="guest-article-body">

                                            <div className="guest-article-meta">

                                                <span>
                                                    {item.category || "Dukungan IT"}
                                                </span>

                                            </div>


                                            <h3>
                                                {item.title}
                                            </h3>


                                            <p>
                                                {
                                                    getDescription(
                                                        item
                                                    )
                                                }
                                            </p>

                                        </div>


                                        {/* ==================================
                                           TYPE
                                        ================================== */}

                                        <div className="guest-article-type">

                                            {item.type === "VIDEO"
                                                ? "Video →"
                                                : "Artikel →"
                                            }

                                        </div>

                                    </article>

                                )
                            )

                        )}

                    </div>


                    {/* ==================================================
                        SEE ALL
                    ================================================== */}

                </section>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer className="guest-footer">

                    <div className="guest-footer-help">

                        <span>
                            Butuh bantuan lebih lanjut?
                        </span>

                        <span>
                            Silakan buat laporan kendala di grup IT-AM.
                        </span>

                    </div>

                </footer>

            </div>

        </div>

    );

}