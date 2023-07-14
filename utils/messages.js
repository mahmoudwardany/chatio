const moment = require("moment")

function formatMsg(username,text) {
    const timeStamp=moment().format("h:mm a")
    return {
        username,
        text,
        timeStamp
    }
}
module.exports= formatMsg