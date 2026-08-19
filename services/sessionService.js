const sessions = new Map();

function createSession(){

    return{
        state:'IDLE',

        ticketId:null,

        pic:null,

        selectedPIC: null,

        daftarTiket: [],

        selectedTicket:null,

        autoTroubleshooting: null
    };

}

function get(groupId){

    if(!sessions.has(groupId)){

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

){

    const session=

        get(groupId);

    session.state=state;

}

function reset(groupId){

    sessions.set(

        groupId,

        createSession()

    );

}

function linkSession(sourceId, targetId) {

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

module.exports={

    get,

    setState,

    reset,

    linkSession

};