require('dotenv').config();

module.exports = {

    APP_NAME: 'PGI Helpdesk V2',

    PORT: process.env.PORT || 3000,

    DATABASE: './helpdesk.db',

    CHROME_PATH:
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',

    HEADLESS: false

};