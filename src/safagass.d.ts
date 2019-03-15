/**
 * SalesforceのSession情報
 */
export interface SessionInfo {
  access_token: string
  id: string
  instance_url: string
  issued_at: string
  signature: string
  token_type: string
}

/**
 * HTTPリクエストデータ
 */
export interface RequestData {
  method: string
  payload: any
  headers?: { Authorization: string, Accept?: string }
  contentType?: string
  muteHttpExceptions?: boolean
}