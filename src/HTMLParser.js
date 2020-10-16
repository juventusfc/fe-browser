const EOF = Symbol("EOF");

class HTMLParser {
  static parse(html) {
    let state = data;
    for (let c of html) {
      state = state(c);
    }
    state = state(EOF);
    return html;
  }
}

const data = (c) => {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    return;
  } else {
    return data;
  }
};

const tagOpen = (c) => {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/[a-zA-Z]/)) {
    return tagName(c);
  } else {
    return;
  }
};

const endTagOpen = (c) => {
  if (c.match(/[a-zA-Z]/)) {
    return tagName(c);
  } else {
    return;
  }
};

const tagName = (c) => {
  if (c.match(/[\t\n\f ]/)) {
    return beforeAttributeName;
  } else if (c.match(/[a-zA-Z]/)) {
    return tagName;
  } else if (c === "/") {
    return selfClosingTag;
  } else if (c === ">") {
    return data;
  } else {
    return;
  }
};

const beforeAttributeName = (c) => {
  if (c === ">") {
    return data;
  } else {
    return beforeAttributeName;
  }
};

const selfClosingTag = (c) => {
  if (c === ">") {
    return data;
  }
};

exports.HTMLParser = HTMLParser;
