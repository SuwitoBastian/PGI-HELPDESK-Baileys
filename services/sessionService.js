const sessions = new Map();
const autoTroubleshootingTimers = new WeakMap();

function createSession() {

    return {
        state: "IDLE",

        ticketId: null,

        pic: null,

        selectedPIC: null,

        daftarTiket: [],

        selectedTicket: null,

        autoTroubleshooting: null
    };

}


function get(groupId) {

    if (!sessions.has(groupId)) {

        sessions.set(
            groupId,
            createSession()
        );

    }

    return sessions.get(groupId);

}


function setState(
    groupId,
    state
) {

    const session =
        get(groupId);

    session.state = state;

}


function reset(groupId) {

    const session =
        sessions.get(groupId);


    if (!session) {

        sessions.set(
            groupId,
            createSession()
        );

        return;

    }


    // ======================================================
    // CANCEL TIMER
    // ======================================================

    const timer =
        autoTroubleshootingTimers.get(
            session
        );

    if (timer) {

        clearTimeout(timer);

        autoTroubleshootingTimers.delete(
            session
        );

    }


    // ======================================================
    // RESET SEMUA ID YANG MENUNJUK SESSION INI
    // ======================================================

    for (
        const [
            id,
            currentSession
        ]
        of sessions.entries()
    ) {

        if (
            currentSession ===
            session
        ) {

            sessions.set(
                id,
                createSession()
            );

        }

    }

}


function startAutoTroubleshootingTimer(
    groupId,
    durationMs,
    onExpired
) {

    const session =
        sessions.get(groupId);


    if (!session) {

        return;

    }


    // ======================================================
    // HAPUS TIMER LAMA
    // ======================================================

    const oldTimer =
        autoTroubleshootingTimers.get(
            session
        );

    if (oldTimer) {

        clearTimeout(oldTimer);

    }


    // ======================================================
    // START TIMER
    // ======================================================

    const timer =
        setTimeout(
            async () => {

                autoTroubleshootingTimers.delete(
                    session
                );


                // ==================================================
                // PASTIKAN SESSION MASIH AKTIF
                // ==================================================

                if (
                    session.state !==
                        "AUTO_TROUBLESHOOTING" &&
                    session.state !==
                        "WIFI_RESTART"
                ) {

                    return;

                }


                console.log("");

                console.log(
                    "⏰ AUTO TROUBLESHOOTING EXPIRED"
                );

                console.log(
                    "CHAT ID :",
                    groupId
                );

                console.log(
                    "TYPE    :",
                    session.autoTroubleshooting?.type
                );

                console.log(
                    "STATUS  : RESET → IDLE"
                );


                try {

                    if (onExpired) {

                        await onExpired(
                            session
                        );

                    }

                } catch (err) {

                    console.error(
                        "❌ Error Auto Troubleshooting Expired:",
                        err
                    );

                }


                // ==================================================
                // RESET SEMUA ID YANG MENUNJUK SESSION INI
                // ==================================================

                for (
                    const [
                        id,
                        currentSession
                    ]
                    of sessions.entries()
                ) {

                    if (
                        currentSession ===
                        session
                    ) {

                        sessions.set(
                            id,
                            createSession()
                        );

                    }

                }

            },
            durationMs
        );


    autoTroubleshootingTimers.set(
        session,
        timer
    );

}


function cancelAutoTroubleshootingTimer(
    groupId
) {

    const session =
        sessions.get(groupId);


    if (!session) {

        return;

    }


    const timer =
        autoTroubleshootingTimers.get(
            session
        );

    if (timer) {

        clearTimeout(timer);

        autoTroubleshootingTimers.delete(
            session
        );

    }

}


function linkSession(
    sourceId,
    targetId
) {

    const sourceSession =
        get(sourceId);

    sessions.set(
        targetId,
        sourceSession
    );

    console.log(
        `🔗 Session linked: ${sourceId} → ${targetId}`
    );

    return sourceSession;

}


module.exports = {

    get,

    setState,

    reset,

    linkSession,

    startAutoTroubleshootingTimer,

    cancelAutoTroubleshootingTimer

};