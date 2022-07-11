
const {AuthAndCreateSS} = require("./../../googleSheet/gs")
const nsq = require('nsqjs')
const writer = new nsq.Writer(
    '172.18.59.254',
    '4150',
  );
  
  const ProducerUserFormResponse = async(msg)=>{
    writer.connect();
    writer.on('ready', () => {
        // const msg = { name: 'Gijo Varghese' };
        console.log('Message sent:', msg);
        
        writer.publish('user_response', msg);
    });
  }

  module.exports = { ProducerUserFormResponse };
  