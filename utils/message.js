const moment = require('moment')

const formatMsg = (name, text) => {
    return {
        username : name,
        timestamp : moment().utc().format('hh:mm A'),
        text
    }
}

module.exports = {
    formatMsg
}