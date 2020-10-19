const { createTextToken, emit, createStartTagToken, createEndTagToken } = require("./emit");

const EOF = Symbol("EOF");

let currentToken;

const data = (c) => {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    return;
  } else {
    currentToken = createTextToken(c);
    emit(currentToken);
    currentToken = null;
    return data;
  }
};

const tagOpen = (c) => {
  if (c === "/") {
    return endTagOpen;
  } else if (isLetter(c)) {
    currentToken = createStartTagToken();
    return tagName(c);
  } else {
    return;
  }
};

const endTagOpen = (c) => {
  if (isLetter(c)) {
    currentToken = createEndTagToken();
    return tagName(c);
  } else {
    return;
  }
};

const tagName = (c) => {
  if (isSpace(c)) {
    return beforeAttributeName;
  } else if (isLetter(c)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === "/") {
    return selfClosingTag;
  } else if (c === ">") {
    emit(currentToken);
    currentToken = null;
    return data;
  } else {
    return;
  }
};

const beforeAttributeName = (c) => {
  if (c === ">") {
    emit(currentToken);
    currentToken = null;
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

exports.data = data;
exports.EOF = EOF;

function isSpace(c) {
  return c.match(/^[\t\n\f ]$/);
}
function isLetter(c) {
  return c.match(/^[a-zA-Z]$/);
}

