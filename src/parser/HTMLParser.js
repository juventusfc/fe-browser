const { data, EOF } = require("./fsm");

class HTMLParser {
  static parse(html) {
    let state = data;
    for (let c of html) {
      state = state(c);
      // console.log(state.name);
    }
    state = state(EOF);
    return html;
  }
}

exports.HTMLParser = HTMLParser;
