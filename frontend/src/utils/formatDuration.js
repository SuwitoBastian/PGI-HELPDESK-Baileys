export function formatDuration(minutes) {
    const total = Math.round(Number(minutes));

    if (!Number.isFinite(total) || total <= 0) {
        return "-";
    }

    if (total < 60) {
        return `${total} Menit`;
    }

    if (total < 1440) {
        const jam = Math.floor(total / 60);
        const menit = total % 60;

        return menit > 0
            ? `${jam} Jam ${menit} Menit`
            : `${jam} Jam`;
    }

    const hari = Math.floor(total / 1440);
    const sisaJam = Math.floor((total % 1440) / 60);

    return sisaJam > 0
        ? `${hari} Hari ${sisaJam} Jam`
        : `${hari} Hari`;
}