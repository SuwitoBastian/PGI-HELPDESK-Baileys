import React, {
    useEffect,
    useState
} from "react";

export default function KnowledgeDetail({
    contentId,
    onBack
}) {

    const [
        content,
        setContent
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    // ==========================================================
    // LOAD DETAIL
    // ==========================================================

    useEffect(() => {

        async function loadDetail() {

            if (!contentId) {

                setError(
                    "Knowledge Base tidak ditemukan."
                );

                setLoading(false);

                return;

            }


            try {

                const response =
                    await fetch(
                        `/api/knowledge/${contentId}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Gagal mengambil Knowledge Base."
                    );

                }


                const result =
                    await response.json();


                if (
                    result.ok &&
                    result.data
                ) {

                    setContent(
                        result.data
                    );

                } else {

                    throw new Error(
                        "Knowledge Base tidak ditemukan."
                    );

                }

            } catch (err) {

                console.error(
                    "Knowledge Detail error:",
                    err
                );

                setError(
                    err.message ||
                    "Gagal memuat Knowledge Base."
                );

            } finally {

                setLoading(false);

            }

        }


        loadDetail();

    }, [
        contentId
    ]);


    // ==========================================================
    // YOUTUBE EMBED
    // ==========================================================

    function getYoutubeEmbedUrl(
        url
    ) {

        if (!url) {

            return null;

        }


        try {

            const parsed =
                new URL(url);


            // youtube.com/watch?v=xxxx

            if (
                parsed.hostname.includes(
                    "youtube.com"
                ) &&
                parsed.searchParams.get(
                    "v"
                )
            ) {

                const videoId =
                    parsed.searchParams.get(
                        "v"
                    );

                return (
                    `https://www.youtube.com/embed/${videoId}`
                );

            }


            // youtu.be/xxxx

            if (
                parsed.hostname ===
                "youtu.be"
            ) {

                const videoId =
                    parsed.pathname
                        .replace(
                            "/",
                            ""
                        );


                if (videoId) {

                    return (
                        `https://www.youtube.com/embed/${videoId}`
                    );

                }

            }


            // already embed

            if (
                parsed.pathname.startsWith(
                    "/embed/"
                )
            ) {

                return url;

            }


        } catch {

            return null;

        }


        return null;

    }


    // ==========================================================
    // DESCRIPTION
    // ==========================================================

    function getDescription() {

        if (
            !content?.content
        ) {

            return "";

        }


        return content.content
            .replace(
                /<[^>]*>/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {

        return (

            <div className="knowledge-detail">

                <button
                    type="button"
                    className="knowledge-detail-back"
                    onClick={onBack}
                >

                    ← Kembali

                </button>


                <div className="knowledge-detail-state">

                    Memuat Knowledge Base...

                </div>

            </div>

        );

    }


    // ==========================================================
    // ERROR
    // ==========================================================

    if (
        error ||
        !content
    ) {

        return (

            <div className="knowledge-detail">

                <button
                    type="button"
                    className="knowledge-detail-back"
                    onClick={onBack}
                >

                    ← Kembali

                </button>


                <div className="knowledge-detail-state error">

                    {error ||
                        "Knowledge Base tidak ditemukan."
                    }

                </div>

            </div>

        );

    }


    // ==========================================================
    // VIDEO URL
    // ==========================================================

    const youtubeUrl =
        content.type === "VIDEO"
            ? getYoutubeEmbedUrl(
                content.video_url
            )
            : null;


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <div className="knowledge-detail">


            {/* ==================================================
                BACK
            ================================================== */}

            <button
                type="button"
                className="knowledge-detail-back"
                onClick={onBack}
            >

                ← Kembali ke Knowledge Base

            </button>


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="knowledge-detail-header">

                <div className="knowledge-detail-meta">

                    <span className="knowledge-detail-category">

                        {content.category ||
                            "IT Support"
                        }

                    </span>


                    <span className="knowledge-detail-type">

                        {content.type === "VIDEO"
                            ? "Video"
                            : "Artikel"
                        }

                    </span>

                </div>


                <h1>

                    {content.title}

                </h1>


                {content.keywords && (

                    <div className="knowledge-detail-keywords">

                        {content.keywords}

                    </div>

                )}

            </div>


            {/* ==================================================
                VIDEO
            ================================================== */}

            {content.type === "VIDEO" &&
                content.video_url && (

                    <div className="knowledge-detail-video">

                        {youtubeUrl ? (

                            <iframe
                                src={youtubeUrl}
                                title={
                                    content.title
                                }
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />

                        ) : (

                            <video
                                src={
                                    content.video_url
                                }
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                                playsInline
                            />

                        )}

                    </div>

                )}


            {/* ==================================================
                CONTENT
            ================================================== */}

            <article className="knowledge-detail-content">

                {content.content ? (

                    <div
                        dangerouslySetInnerHTML={{
                            __html:
                                content.content
                        }}
                    />

                ) : (

                    <p>

                        {content.type === "VIDEO"

                            ? "Video tutorial troubleshooting IT."

                            : "Belum ada isi panduan."

                        }

                    </p>

                )}

            </article>


        </div>

    );

}