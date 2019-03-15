import { SessionInfo, RequestData } from './safagass'

export class App {

  sessioninfo: SessionInfo

  constructor() {
    this.sessioninfo = null
  }

  /**
   * get access token of salesforce
   * @param client_id 
   * @param client_secret 
   * @param user_name 
   * @param user_pass 
   */
  setAccessToken (client_id: string, client_secret: string, user_name: string, user_pass: string): SessionInfo {

    const ACCESS_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";

    if (!this.sessioninfo) {
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
      this.sessioninfo = JSON.parse(results.toString())
      return this.sessioninfo
    }

  }

  /**
   * Salesforceから編集可能オブジェクト情報を取得します
   * TODO: とりあえずモックでかんべんしてくれ〜〜〜〜〜〜〜〜〜〜ぃ!!!!
   */
  fetchObjectInfo(): Array<string> {
    return ['Account', 'Opportunity', 'Contact']
  }

  /**
   * Create sobje record(s)
   * @param sObj sobjName
   * @param recdata record data
   */
  createRecord(sObj: string, recdata: object) {

    const response = UrlFetchApp.fetch(
      this.sessioninfo.instance_url + `/services/data/v20.0/sobjects/${sObj}/`, 
      {
        "method" : "post",
        "headers" : {
          "Authorization": "Bearer " + this.sessioninfo.access_token
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

  /**
   * レコード検索
   * TODO: 項目動的にする、検索対象動的にする、諸々頑張る、コレほぼモック
   * @param sObj 
   * @param keyword 
   */
  searchRecords(sObj: string, keyword: string) {

    let query: string = `SELECT id, name FROM ${sObj} WHERE name LIKE %${keyword}%`

    const queryUrl: string = this.sessioninfo.instance_url + "/services/data/v32.0/query?q=" + encodeURIComponent(query)
    const response = UrlFetchApp.fetch(queryUrl, {
      "contentType": "application/json",
      "headers": {
        "Authorization": "Bearer " + this.sessioninfo.access_token,
        "Accept": "application/json",
      },
      "muteHttpExceptions": true
    })

    const responseText = response.getContentText()
    const rc = response.getResponseCode()
  }
}