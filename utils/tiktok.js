async function resolveTikTokUrl(url) {
    if (!url) return null;

    try {
        const inputUrl = url.trim();

        const response = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(inputUrl)}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0"
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (
            data &&
            data.type === "video" &&
            data.html
        ) {
            const match =
                data.html.match(
                    /data-video-id="(\d+)"/
                );

            if (match) {
                return {
                    videoId: match[1],
                    embedUrl:
                        `https://www.tiktok.com/player/v1/${match[1]}`,
                    canonicalUrl:
                        data.author_url
                            ? data.html.match(
                                /cite="([^"]+)"/
                            )?.[1] || inputUrl
                            : inputUrl
                };
            }
        }

        return null;

    } catch (error) {
        console.error(
            "TikTok resolve error:",
            error.message
        );

        return null;
    }
}

module.exports = {
    resolveTikTokUrl
};