const WAITING_LENGTH = 8;
const WAITING_LENGTH_END = 9;
const READING_TRUNK = 10;
const WAITING_NEW_LINE = 11;
const WAITING_NEW_LINE_END = 12;
class TrunkedBodyParser {
  constructor() {
    this.currentState = WAITING_LENGTH;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
  }

  receiveChar(c) {
    if (this.isFinished) {
      return;
    }
    if (this.currentState === WAITING_LENGTH) {
      if (c === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.currentState = WAITING_LENGTH_END;
      } else {
        this.length *= 16;
        this.length += parseInt(c, 16);
      }
    } else if (this.currentState === WAITING_LENGTH_END) {
      if (c === "\n") {
        this.currentState = READING_TRUNK;
      }
    } else if (this.currentState === READING_TRUNK) {
      this.content.push(c);
      this.length--;
      if (this.length === 0) {
        this.currentState = WAITING_NEW_LINE;
      }
    } else if (this.currentState === WAITING_NEW_LINE) {
      if (c === "\r") {
        this.currentState = WAITING_NEW_LINE_END;
      }
    } else if (this.currentState === WAITING_NEW_LINE_END) {
      if (c === "\n") {
        this.currentState = WAITING_LENGTH;
      }
    }
  }
}
exports.TrunkedBodyParser = TrunkedBodyParser;
