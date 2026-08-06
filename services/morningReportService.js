const cron = require("node-cron");

const client = require("./waService");

const groups = require("../config/groups");

function start() {

    console.log("🕖 Morning Report Scheduler Ready");
    console.log("⏰ Jadwal : 07:45 WIB (Senin - Sabtu)");

    cron.schedule(
        "45 7 * * *",
        async () => {

            console.log("");
            console.log("==============================");
            console.log("📨 Mengirim Morning Report...");
            console.log("==============================");

            const pesan =
`Dear All Team Area Manager,

Selamat Pagi,

IT Support Standby untuk seluruh Area Manager dalam menangani permasalahan cabang.

Terima kasih.

Regards,

*IT Support*`;

            try {

                for (const [namaGroup, groupId] of Object.entries(groups)) {

                    await client.sendMessage(
                        groupId,
                        pesan
                    );

                    console.log(
                        `✅ Terkirim ke ${namaGroup}`
                    );

                    // Jeda 1 detik agar pengiriman lebih aman
                    await new Promise(resolve =>
                        setTimeout(resolve, 1000)
                    );

                }

                console.log("");
                console.log("✅ Morning Report selesai dikirim");
                console.log("==============================");
                console.log("");

            } catch (err) {

                console.error("");
                console.error("❌ Gagal mengirim Morning Report");
                console.error(err);
                console.error("");

            }

        },
        {
            timezone: "Asia/Jakarta"
        }
    );

}

module.exports = {
    start
};