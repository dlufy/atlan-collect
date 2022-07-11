
const {InitConsumer} = require("./consumer/googleSheetConsumer")

const initConsumers = async (nsqLookupdAdress)=>{
    await InitConsumer(nsqLookupdAdress)
}

module.exports = { initConsumers };