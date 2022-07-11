
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 function authorize(args,credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client,title, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(args,oAuth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client,args, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(args,oAuth2Client);
      });
    });
  }

  async function AuthAndCreateSS(title,formId){
    fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), {title:title,formId:formId},create);
      });
  }

  async function AuthAndAppendSS(spreadsheetId,range,valueInputOption,_values){
    fs.readFile('./credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), {spreadsheetId,range,valueInputOption,_values},appendValues);
      });
  }

async function appendValues(args) {
  let spreadsheetId = args.spreadsheetId
   let range = args.range
   let  valueInputOption = args.valueInputOption
    let _values = args._values
    const auth = new GoogleAuth(
        {scopes: 'https://www.googleapis.com/auth/spreadsheet'});
  
    const service = google.sheets({version: 'v4', auth});
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];
    const resource = {
      values,
    };
    try {
      const result = await service.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      console.log(`${result.data.updates.updatedCells} cells appended.`);
      return result;
    } catch (err) {
      throw err;
    }
  }
  
  
  /**
   * Create a google spreadsheet
   * @param {string} title Spreadsheets title
   * @return {string} Created spreadsheets ID
   */
   async function create(args,auth) {
    let title = args.title
    let formId = args.formId
    const service = google.sheets({version: 'v4', auth});
    const resource = {
      properties: {
        title,
      },
    };
    try {
      const spreadsheet = await service.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
      });
      console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      
      //save this spreadsheetId to DB in the userform table
      //db.UpdateFormDataWithGoogleSheetId(formId,spreadsheetId)
      return spreadsheet.data.spreadsheetId;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  module.exports = {AuthAndAppendSS,AuthAndCreateSS}