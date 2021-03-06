const css = require("css");
const { getSpecificity, match, compare } = require("./CSSUtil");
let currentTextNode = null;
let stack = [{ type: "document", children: [] }];

let rules = [];
const addCSSRules = (text) => {
  var obj = css.parse(text);
  rules.push(...obj.stylesheet.rules);
};

const computeCSS = (element) => {
  const elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    let selectors = rule.selectors[0].split(" ").reverse();
    let currentSpecificity = getSpecificity(selectors);

    if (!match(elements[0], selectors[0])) {
      continue;
    }

    let matched = false;
    let j = 0;
    for (let i = 0; i < elements.length - 1; i++) {
      if (match(elements[i], selectors[j])) {
        j++;
      }
    }

    if (j >= selectors.length) {
      matched = true;
    }

    if (matched) {
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {
            value: "",
            specificity: [0, 0, 0, 0],
          };
        }
        if (
          compare(
            currentSpecificity,
            computedStyle[declaration.property].specificity
          )
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = currentSpecificity;
        }
      }
    }
  }
};

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
      computeCSS(element);

      currentTextNode = null;
      break;

    case "END_TAG_TOKEN":
      if (token.tagName === "style") {
        addCSSRules(currentTextNode.content);
      }

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
