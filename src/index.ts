import { App } from "./app"
import { SessionInfo } from './safagass'

const CLIENT_ID = "REPLACE_CLIENT_ID"
const CLIENT_SECRET = "REPLACE_CLIENT_SECRET"
const USER_NAME = "REPLACE_USER_NAME"
const USER_PASS = "REPLACE_PASSWORD"

/** アドオン追加 */
function onOpen(): void {
  SpreadsheetApp.getUi().createAddonMenu().addItem('Salesforce連携アプリ', 'showApp').addToUi()
}
/** サイドバー表示 */
function showApp(): void {
  const ui = HtmlService.createHtmlOutputFromFile('sfIntegrate').setTitle('Salesforce連携アプリ')
  SpreadsheetApp.getUi().showSidebar(ui)
}

// 接続アプリケーション
const app: App = new App()

function isLoggedIn() :SessionInfo {
  return app.getSessionInfo()
}

/**
 * LOG-iN
 */
function login(): string {
  const session_info: SessionInfo = app.setSessionInfo(CLIENT_ID, CLIENT_SECRET, USER_NAME, USER_PASS)
  return session_info.access_token
}

/**
 * オブジェクト取得
 */
function fetchObj(): Array<string> {
  return app.fetchObjectInfo()
}

/**
 * レコード検索
 * @param sObjName 
 * @param keyword 
 */
function search(sObjName: string, keyword: string): any {
  return app.searchRecords(sObjName, keyword)
}
