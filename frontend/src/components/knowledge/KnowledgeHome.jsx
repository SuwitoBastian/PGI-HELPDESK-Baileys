import React, {
    useEffect,
    useState
} from "react";


// ==========================================================
// YOUTUBE EMBED URL
// ==========================================================

function getYoutubeEmbedUrl(url) {

    if (!url) {
        return null;
    }

    try {

        const parsedUrl = new URL(
            url.trim()
        );

        const hostname =
            parsedUrl.hostname
                .toLowerCase()
                .replace(
                    /^www\./,
                    ""
                );

        let videoId = null;


        // ==================================================
        // youtube.com/watch?v=XXXXXXXX
        // ==================================================

        if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com"
        ) {

            videoId =
                parsedUrl.searchParams.get(
                    "v"
                );

        }


        // ==================================================
        // youtu.be/XXXXXXXX
        // ==================================================

        else if (
            hostname === "youtu.be"
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/")
                    .filter(Boolean)[0];

        }


        // ==================================================
        // youtube.com/embed/XXXXXXXX
        // ==================================================

        if (
            !videoId &&
            parsedUrl.pathname.startsWith(
                "/embed/"
            )
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/embed/")[1]
                    ?.split("/")[0];

        }


        // ==================================================
        // youtube.com/shorts/XXXXXXXX
        // ==================================================

        if (
            !videoId &&
            parsedUrl.pathname.startsWith(
                "/shorts/"
            )
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/shorts/")[1]
                    ?.split("/")[0];

        }


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!videoId) {

            return null;

        }


        // ==================================================
        // CLEAN VIDEO ID
        // ==================================================

        videoId =
            videoId
                .split("?")[0]
                .split("&")[0]
                .split("#")[0]
                .trim();


        if (!videoId) {

            return null;

        }


        // ==================================================
        // EMBED URL
        // ==================================================

        return (
            `https://www.youtube.com/embed/${videoId}?rel=0`
        );

    } catch (error) {

        return null;

    }

}


// ==========================================================
// KNOWLEDGE HOME
// ==========================================================

export default function KnowledgeHome() {

    const [
        contents,
        setContents
    ] = useState([]);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        category,
        setCategory
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        selectedContent,
        setSelectedContent
    ] = useState(null);


    // ======================================================
    // LOAD KNOWLEDGE BASE
    // ======================================================

    useEffect(() => {

        async function loadKnowledge() {

            try {

                const response =
                    await fetch(
                        "/api/knowledge"
                    );


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }


                const result =
                    await response.json();


                if (
                    result?.ok &&
                    Array.isArray(
                        result.data
                    )
                ) {

                    setContents(
                        result.data
                    );

                } else {

                    setContents([]);

                }

            } catch (error) {

                console.error(
                    "Knowledge Home load error:",
                    error
                );

                setContents([]);

            } finally {

                setLoading(false);

            }

        }


        loadKnowledge();

    }, []);


    // ======================================================
    // CATEGORY LIST
    // ======================================================

    const categories = [

        ...new Set(

            contents
                .map(
                    item =>
                        item.category
                )
                .filter(Boolean)

        )

    ].sort();


    // ======================================================
    // FILTER SEARCH + CATEGORY
    // ======================================================

    const filteredContents =
        contents.filter(item => {

            const keyword =
                search
                    .toLowerCase()
                    .trim();


            // ==================================================
            // SEARCH
            // ==================================================

            if (keyword) {

                const title =
                    item.title || "";


                const itemCategory =
                    item.category || "";


                const keywords =
                    item.keywords || "";


                const content =
                    item.content
                        ? item.content
                            .replace(
                                /<[^>]*>/g,
                                ""
                            )
                        : "";


                const searchableText = (

                    title +
                    " " +
                    itemCategory +
                    " " +
                    keywords +
                    " " +
                    content

                ).toLowerCase();


                if (
                    !searchableText.includes(
                        keyword
                    )
                ) {

                    return false;

                }

            }


            // ==================================================
            // CATEGORY
            // ==================================================

            if (
                category &&
                item.category !== category
            ) {

                return false;

            }


            return true;

        });


    // ======================================================
    // OPEN DETAIL
    // ======================================================

    function openDetail(item) {

        if (!item) {

            return;

        }


        setSelectedContent(item);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ======================================================
    // CLOSE DETAIL
    // ======================================================

    function closeDetail() {

        setSelectedContent(null);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ======================================================
    // DETAIL VIEW
    // ======================================================

    if (selectedContent) {

        const youtubeUrl =
            selectedContent.type === "VIDEO"
                ? getYoutubeEmbedUrl(
                    selectedContent.video_url
                )
                : null;


        const isUploadedVideo =
            selectedContent.type === "VIDEO" &&
            selectedContent.video_url &&
            !youtubeUrl;


        return (

            <div className="knowledge-home">


                {/* ==================================================
                    DETAIL HEADER
                ================================================== */}

                <div className="knowledge-home-detail-header">


                    <button
                        type="button"
                        className="knowledge-home-back"
                        onClick={closeDetail}
                    >

                        ← Kembali ke Knowledge Base

                    </button>


                    <div className="knowledge-home-detail-meta">


                        <span className="knowledge-home-detail-type">

                            {selectedContent.type === "VIDEO"
                                ? "Video Tutorial"
                                : "Artikel"
                            }

                        </span>


                        <span className="knowledge-home-detail-category">

                            {selectedContent.category || "-"}

                        </span>


                    </div>


                    <h1>

                        {selectedContent.title}

                    </h1>


                </div>


                {/* ==================================================
                    DETAIL CONTENT
                ================================================== */}

                <div className="knowledge-home-detail-card">


                    {/* ==================================================
                        VIDEO
                    ================================================== */}

                    {selectedContent.type === "VIDEO" && (

                        <div className="knowledge-home-detail-video">


                            {youtubeUrl ? (

                                <iframe
                                    src={youtubeUrl}

                                    title={
                                        selectedContent.title ||
                                        "Video Tutorial"
                                    }

                                    frameBorder="0"

                                    allow="
                                        accelerometer;
                                        autoplay;
                                        clipboard-write;
                                        encrypted-media;
                                        gyroscope;
                                        picture-in-picture;
                                        web-share
                                    "

                                    referrerPolicy="strict-origin-when-cross-origin"

                                    allowFullScreen
                                />

                            ) : isUploadedVideo ? (

                                <video
                                    src={
                                        selectedContent.video_url
                                    }

                                    controls

                                    preload="metadata"

                                    playsInline

                                    controlsList="nodownload"

                                />

                            ) : (

                                <div
                                    className="knowledge-home-detail-video-error"
                                >

                                    <strong>
                                        Video tidak tersedia.
                                    </strong>


                                    <p>
                                        URL video belum tersedia
                                        atau format URL tidak dikenali.
                                    </p>


                                    {selectedContent.video_url && (

                                        <small>

                                            {selectedContent.video_url}

                                        </small>

                                    )}

                                </div>

                            )}


                        </div>

                    )}


                    {/* ==================================================
                        ARTICLE
                    ================================================== */}

                    {selectedContent.type !== "VIDEO" && (

                        <div
                            className="knowledge-home-detail-article"

                            dangerouslySetInnerHTML={{
                                __html:
                                    selectedContent.content ||
                                    "<p>Belum ada konten.</p>"
                            }}

                        />

                    )}

                    
                    {/* LAMPIRAN ARTIKEL */}
                    {selectedContent.type !== "VIDEO" &&
                        (selectedContent.attachment_url ||
                            selectedContent.attachmentUrl) && (
                            <div className="knowledge-home-attachment">
                                <strong>Materi atau Lampiran</strong>

                                <a
                                    href={
                                        selectedContent.attachment_url ||
                                        selectedContent.attachmentUrl
                                    }
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📎{" "}
                                    {selectedContent.attachment_name ||
                                        selectedContent.attachmentName ||
                                        "Unduh materi"}
                                </a>
                            </div>
                        )}



                    {/* ==================================================
                        VIDEO DESCRIPTION
                    ================================================== */}

                    {selectedContent.type === "VIDEO" &&
                        selectedContent.content && (

                            <div
                                className="knowledge-home-detail-description"

                                dangerouslySetInnerHTML={{
                                    __html:
                                        selectedContent.content
                                }}

                            />

                        )}


                </div>


            </div>

        );

    }


    // ======================================================
    // LIST VIEW
    // ======================================================

    return (

        <div className="knowledge-home">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="knowledge-home-header">


                <div>

                    <h1>
                        Knowledge Base
                    </h1>


                    <p>
                        Temukan panduan dan solusi
                        troubleshooting IT.
                    </p>

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="knowledge-home-search">

                    <input
                        type="text"

                        value={search}

                        onChange={
                            event =>
                                setSearch(
                                    event.target.value
                                )
                        }

                        placeholder="Cari artikel, kategori, atau keyword..."

                    />

                </div>


                {/* ==================================================
                    CATEGORY FILTER
                ================================================== */}

                <div className="knowledge-home-filter">

                    <select
                        value={category}

                        onChange={
                            event =>
                                setCategory(
                                    event.target.value
                                )
                        }
                    >

                        <option value="">
                            Semua Kategori
                        </option>


                        {categories.map(
                            item => (

                                <option
                                    key={item}
                                    value={item}
                                >

                                    {item}

                                </option>

                            )
                        )}

                    </select>

                </div>


            </div>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="knowledge-home-content">


                <div className="knowledge-home-list">


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading ? (

                        <div className="knowledge-home-state">

                            Memuat Knowledge Base...

                        </div>


                    ) : filteredContents.length === 0 ? (

                        <div className="knowledge-home-state">

                            {search.trim() || category

                                ? "Konten tidak ditemukan."

                                : "Belum ada artikel atau video."

                            }

                        </div>


                    ) : (

                        filteredContents.map(
                            item => (

                                <button
                                    type="button"

                                    key={item.id}

                                    className="knowledge-home-card"

                                    onClick={() =>
                                        openDetail(item)
                                    }
                                >


                                    {/* ==================================================
                                        ICON
                                    ================================================== */}

                                    <div
                                        className={
                                            item.type === "VIDEO"
                                                ? "knowledge-home-card-icon video"
                                                : "knowledge-home-card-icon"
                                        }
                                    >

                                        {item.type === "VIDEO"
                                            ? "▶"
                                            : "📄"
                                        }

                                    </div>


                                    {/* ==================================================
                                        BODY
                                    ================================================== */}

                                    <div className="knowledge-home-card-body">


                                        <h3>

                                            {item.title}

                                        </h3>


                                        <span>

                                            {item.category || "-"}

                                        </span>


                                        <p>

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
                                                        120
                                                    )

                                                : item.type === "VIDEO"

                                                    ? "Video tutorial troubleshooting IT."

                                                    : "Belum ada deskripsi."

                                            }

                                        </p>


                                    </div>


                                    {/* ==================================================
                                        ACTION
                                    ================================================== */}

                                    <div className="knowledge-home-card-type">

                                        →

                                    </div>


                                </button>

                            )

                        )

                    )}


                </div>


            </div>


        </div>

    );

}