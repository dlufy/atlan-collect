
const nsq = require('nsqjs');
const {AuthAndCreateSS,AuthAndAppendSS} = require("./../../googleSheet/gs") 

const InitConsumer = async (nsqLookupdAddress)=>{
  console.log("reader initialise",nsqLookupdAddress)
  const reader = new nsq.Reader('user_response','append_to_gs', {
  lookupdHTTPAddresses: nsqLookupdAddress,
});
reader.connect();
console.log("attaching consumer at",nsqLookupdAddress)

reader.on('message',msg => GoogleSheetProcesser(msg) );
}

const GoogleSheetProcesser = (msg) => {
  try {
  console.log('Received message:', msg.json());
  let data = msg.json()
  //if no spreadsheet, then create a spreedsheet for the form and publish the event to work
  if (data.spreedSheetId == null || data.spreedSheetId == ""){
    await AuthAndCreateSS(data.formName,data.formId)
  }
  msg.touch()
  // appendValues(msg)
  //fetch spreadsheetId
  range_ = 'MySheet!A:C'
  values = [
    ['6/2', 'login', 200],
    ['6/2', 'complain', 1]
]
valueInputOption='USER_ENTERED',
  await AuthAndAppendSS(data.spreedSheetId,range_,valueInputOption,values)
  msg.finish();
}catch (e){
  console.log("error while consuming",e)
  msg.requeueDelay(10)
}
}

module.exports = { InitConsumer };