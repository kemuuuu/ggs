import { Api } from "./api";

const CLIENT_ID = "3MVG9d8..z.hDcPJGgo9II2L4BRyKLkRdkpPxZ1n2AMqhTEdg9ySTIU_2ouSzK_hwq9UmwOCsbu_ZTedM35RX";
const CLIENT_SECRET = "3427869449245589358";
const USER_NAME = "yosuke@dev.com";
const USER_PASS = "1q2w3e4r";

function app() {
  const myapi = new Api()
  myapi.setAccessToken(CLIENT_ID, CLIENT_SECRET, USER_NAME, USER_PASS)
  let aData = {
    'Name': 'glico☆'
  }
  myapi.createRecord('Account',aData)
}

