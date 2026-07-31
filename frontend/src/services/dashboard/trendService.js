const API = "/api/trend";

/**
 * Daily Trend
 */
export async function getDailyTrend({
    days = null,
    team = "ALL"
} = {}) {

    const params = new URLSearchParams();

    if (days !== null && days !== "ALL") {
        params.append("days", days);
    }

    if (team && team !== "ALL") {
        params.append("team", team);
    }

    const query = params.toString();

    const response = await fetch(
        `${API}/daily${query ? `?${query}` : ""}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to load daily trend (${response.status})`
        );
    }

    return await response.json();
}