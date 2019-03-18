import { SessionInfo, RequestData } from './safagass'

const SESSION_NAME = 'salesforce_session_info'

export class App {

  sessioninfo: SessionInfo

  constructor() {
    const userProperties = PropertiesService.getUserProperties()
    const si = userProperties.getProperty(SESSION_NAME)
    if (si) this.sessioninfo = JSON.parse(si)
  }

  getSessionInfo() :SessionInfo {
    return this.sessioninfo
  }

  /**
   * get access token of salesforce
   * @param client_id 
   * @param client_secret 
   * @param user_name 
   * @param user_pass 
   */
  setSessionInfo (client_id: string, client_secret: string, user_name: string, user_pass: string): SessionInfo {
    
    const ACCESS_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";    
    const payload = {
      'grant_type':'password',
      'client_id':client_id,
      'client_secret':client_secret,
      'username':user_name,
      'password':user_pass
    }

    // アクセストークン取得
    let results = UrlFetchApp.fetch(ACCESS_TOKEN_URL, {
      'method':'post',
      'payload':payload
    })
    let resultText = results.getContentText()
    let rc = results.getResponseCode()

    // セッション情報をユーザプロパティに保存
    let userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(SESSION_NAME, results.toString());

    const si: SessionInfo = JSON.parse(userProperties.getProperty(SESSION_NAME))
    return si

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
  createRecord(sObj: string, recdata: any) {

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
  searchRecords(sObj: string, keyword: string): Array<any> {

    let query: string = `SELECT id, name FROM ${sObj} WHERE name LIKE '%${keyword}%'`
    const queryUrl: string = this.sessioninfo.instance_url + "/services/data/v32.0/query?q=" + encodeURIComponent(query)

    const result = UrlFetchApp.fetch(queryUrl, {
      "contentType": "application/json",
      "headers": {
        "Authorization": "Bearer " + this.sessioninfo.access_token,
        "Accept": "application/json",
      },
      "muteHttpExceptions": true
    })

    const responseText = result.getContentText()
    const rc = result.getResponseCode()
    
    Logger.log(typeof result)
    Logger.log(result)

    return result.records
  }
}