function getStatus(
    assigned,
    completionRate
) {

    // Tidak ada assignment pada periode/filter ini
    if (assigned === 0) {

        return {

            label: "STANDBY",

            color: "#22c55e"

        };

    }

    // Sangat baik
    if (completionRate >= 90) {

        return {

            label: "EXCELLENT",

            color: "#22c55e"

        };

    }

    // Baik
    if (completionRate >= 70) {

        return {

            label: "GOOD",

            color: "#3b82f6"

        };

    }

    // Cukup
    if (completionRate >= 50) {

        return {

            label: "FAIR",

            color: "#f59e0b"

        };

    }

    // Perlu perhatian
    return {

        label: "NEEDS ATTENTION",

        color: "#ef4444"

    };

}

module.exports = {

    getStatus

};