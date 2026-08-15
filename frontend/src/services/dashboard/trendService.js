const API = "/api/trend";

/**
 * Daily Trend
 *
 * location:
 *   ""    = ALL
 *   "AKR" = HO - AKR Tower
 *   "HO"  = Head Office
 */
export async function getDailyTrend({

    days = null,

    startDate = "",

    endDate = "",

    location = ""

} = {}) {

    const params =
        new URLSearchParams();


    if (
        days !== null &&
        days !== "ALL"
    ) {

        params.append(
            "days",
            days
        );

    }


    if (startDate) {

        params.append(
            "startDate",
            startDate
        );

    }


    if (endDate) {

        params.append(
            "endDate",
            endDate
        );

    }


    if (location) {

        params.append(
            "location",
            location
        );

    }


    const query =
        params.toString();


    const response =
        await fetch(
            `${API}/daily${
                query
                    ? `?${query}`
                    : ""
            }`
        );


    if (!response.ok) {

        throw new Error(
            `Failed to load daily trend (${response.status})`
        );

    }


    return await response.json();

}