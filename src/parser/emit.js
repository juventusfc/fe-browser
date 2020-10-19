const emit = (token) => {
  console.log(token);
};

const createTextToken = (c) => {
  return {
    type: "TEXT_TOKEN",
    content: c,
  };
};

const createStartTagToken = (tagName = "") => {
  return {
    type: "START_TAG_TOKEN",
    tagName,
  };
};

const createEndTagToken = (tagName = "") => {
  return {
    type: "END_TAG_TOKEN",
    tagName,
  };
};

const createEOFToken = (tagName = "") => {
  return {
    type: "EOF_TOKEN",
  };
};

exports.emit = emit;
exports.createStartTagToken = createStartTagToken;
exports.createTextToken = createTextToken;
exports.createEndTagToken = createEndTagToken;
exports.createEOFToken = createEOFToken;
