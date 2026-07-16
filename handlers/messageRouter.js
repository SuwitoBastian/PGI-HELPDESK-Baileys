const ticketEngine =
require('../services/ticketEngine');

module.exports = async(msg)=>{

    if(msg.fromMe)
        return;

    await ticketEngine.handle(msg);

};