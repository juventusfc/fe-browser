const WAITING_STATUS_LINE = 0;
const WAITING_STATUS_LINE_END = 1;
const WAITING_HEADER_NAME = 2;
const WAITING_HEADER_SPACE = 3;
const WAITING_HEADER_VALUE = 4;
const WAITING_HEADER_LINE_END = 5;
const WAITING_HEADER_BLOCK_END = 6;
const WAITING_BODY = 7;

class ResponseParser {
  constructor() {
    this.currentState = WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.isFinished = true;
    this.response = "placeholder";
  }

  receive(str) {
    for (let c of str) {
      this.receiveChar(c);
    }
    console.log(this.statusLine);
    console.log(this.headers);
  }

  receiveChar(c) {
    if (this.currentState === WAITING_STATUS_LINE) {
      if (c === "\r") {
        this.currentState = WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += c;
      }
    } else if (this.currentState === WAITING_STATUS_LINE_END) {
      if (c === "\n") {
        this.currentState = WAITING_HEADER_NAME;
      }
    } else if (this.currentState === WAITING_HEADER_NAME) {
      if (c === ":") {
        this.currentState = WAITING_HEADER_SPACE;
      } else if (c === "\r") {
        this.currentState = WAITING_HEADER_BLOCK_END;
      } else {
        this.headerName += c;
      }
    } else if (this.currentState === WAITING_HEADER_SPACE) {
      if (c === " ") {
        this.currentState = WAITING_HEADER_VALUE;
      }
    } else if (this.currentState === WAITING_HEADER_VALUE) {
      if (c === "\r") {
        this.currentState = WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += c;
      }
    } else if (this.currentState === WAITING_HEADER_LINE_END) {
      if (c === "\n") {
        this.currentState = WAITING_HEADER_NAME;
      }
    } else if (this.currentState === WAITING_HEADER_BLOCK_END) {
      if (c === "\n") {
        this.currentState = WAITING_BODY;
      }
    }
  }
}

exports.ResponseParser = ResponseParser;
