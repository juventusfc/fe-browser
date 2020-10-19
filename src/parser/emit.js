let currentTextNode = null;
let stack = [{ type: "document", children: [] }];

const emit = (token) => {
  let top = stack[stack.length - 1];
  switch (token.type) {
    case "TEXT_TOKEN":
      if (!currentTextNode) {
        currentTextNode = {
          type: "text",
          content: "",
        };
        top.children.push(currentTextNode);
      }
      currentTextNode.content += token.content;
      break;

    case "START_TAG_TOKEN":
      let element = {
        type: "element",
        tagName: token.tagName,
        attributes: [],
        children: [],
        parent: top,
      };

      for (let p in token) {
        if (p !== "type" && p !== "tagName") {
          element.attributes.push({
            name: p,
            value: token[p],
          });
        }
      }

      top.children.push(element);

      if (!token.isSelfClosing) {
        stack.push(element);
      }

      currentTextNode = null;
      break;

    case "END_TAG_TOKEN":
      stack.pop();

      currentTextNode = null;
      break;

    case "EOF_TOKEN":
      return stack[0];
      break;

    default:
      break;
  }
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
    isSelfClosing: false,
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
