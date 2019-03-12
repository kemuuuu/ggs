export class Api {

  sessioninfo;

  constructor() {
    this.sessioninfo = null;
  }

  /**
   * get access token of salesforce
   * @param client_id 
   * @param client_secret 
   * @param user_name 
   * @param user_pass 
   */
  setAccessToken(client_id: string, client_secret: string, user_name: string, user_pass: string) {

    const ACCESS_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";

    if (!this.sessioninfo) {
      const self = this
      const payload = {
        'grant_type':'password',
        'client_id':client_id,
        'client_secret':client_secret,
        'username':user_name,
        'password':user_pass
      }
      let results = UrlFetchApp.fetch(ACCESS_TOKEN_URL, {
        'method':'post',
        'payload':payload
      })
      let resultText = results.getContentText()
      let rc = results.getResponseCode()
      self.sessioninfo = JSON.parse(results)
      Logger.log(self.sessioninfo)
    }
  }

  /**
   * Create sobje record(s)
   * @param sObj sobjName
   * @param recdata record data
   */
  createRecord(sObj: string, recdata: object) {
    const self = this
    const response = UrlFetchApp.fetch(
      self.sessioninfo.instance_url + `/services/data/v20.0/sobjects/${sObj}/`, 
      {
        "method" : "POST",
        "headers" : {
        "Authorization": "Bearer " + self.sessioninfo.access_token
      },
        "payload": JSON.stringify(recdata),
        "contentType": "application/json; charset=utf-8",
        "muteHttpExceptions": true
      }
    );
  
    const responseText = response.getContentText();
    const err = response.getHeaders()["error"];
    const rc = response.getResponseCode();
  }


  searchRecords(sObj: string, keyword: string) {

  }
}