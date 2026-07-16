function nowWIB() {

    const now = new Date();

    const utc =
        now.getTime() +
        (now.getTimezoneOffset() * 60000);

    const wib =
        new Date(utc + (7 * 60 * 60 * 1000));

    const year =
        wib.getFullYear();

    const month =
        String(wib.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(wib.getDate())
            .padStart(2, "0");

    const hour =
        String(wib.getHours())
            .padStart(2, "0");

    const minute =
        String(wib.getMinutes())
            .padStart(2, "0");

    const second =
        String(wib.getSeconds())
            .padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;

}

module.exports = {

    nowWIB

};