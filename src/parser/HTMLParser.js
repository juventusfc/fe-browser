const { data, EOF } = require("./fsm");

class HTMLParser {
  static parse(html) {
    let state = data;
    for (let c of html) {
      state = state(c);
      // console.log(state.name);
    }
    let dom = state(EOF);
    return dom;
  }
}

exports.HTMLParser = HTMLParser;
