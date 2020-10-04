class ResponseParser {
  constructor() {
    this.isFinished = true;
    this.response = "placeholder";
  }

  receive(str) {
    for (let c of str) {
      this.receiveChar(c);
    }
  }

  receiveChar(c) {}
}

exports.ResponseParser = ResponseParser;
