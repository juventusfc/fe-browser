const {
  emit,
  createTextToken,
  createStartTagToken,
  createEndTagToken,
  createEOFToken,
} = require("./emit");

const EOF = Symbol("EOF");

let currentToken;
let currentAttribute;

const data = (c) => {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit(createEOFToken());
    return;
  } else {
    currentToken = createTextToken(c);
    emit(currentToken);
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
    currentToken = createTextToken(c);
    emit(currentToken);
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
    return selfClosingStartTag;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return;
  }
};

const beforeAttributeName = (c) => {
  if (isSpace(c)) {
    return beforeAttributeName;
  } else if (c === "/" || c == ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = { name: "", value: "" };
    return attributeName(c);
  }
};

const attributeName = (c) => {
  if (isSpace(c) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
};

const beforeAttributeValue = (c) => {
  if (isSpace(c) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeName;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else {
    return UnquotedAttributeValue(c);
  }
};

const doubleQuotedAttributeValue = (c) => {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
};

const singleQuotedAttributeValue = (c) => {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
};

const afterQuotedAttributeValue = (c) => {
  if (isSpace(c)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
};

const UnquotedAttributeValue = (c) => {
  if (isSpace(c)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
};

const selfClosingStartTag = (c) => {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  }
};

const endTagOpen = (c) => {
  if (isLetter(c)) {
    currentToken = createEndTagToken();
    return tagName(c);
  }
};

const afterAttributeName = (c) => {
  if (isSpace(c)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName;
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
