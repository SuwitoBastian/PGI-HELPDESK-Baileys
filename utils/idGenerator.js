function generateTicketId() {

    const now = new Date();

    const yy =
        String(now.getFullYear()).slice(-2);

    const mm =
        String(now.getMonth() + 1)
            .padStart(2,'0');

    const dd =
        String(now.getDate())
            .padStart(2,'0');

    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let random='';

    for(let i=0;i<6;i++){

        random +=
            chars[
                Math.floor(
                    Math.random()*chars.length
                )
            ];

    }

    return `${yy}${mm}${dd}-${random}`;

}

module.exports = generateTicketId;