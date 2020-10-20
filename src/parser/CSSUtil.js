const compare = (sp1, sp2) => {
  for (let i = 0; i < 4; i++) {
    if (sp1[i] > sp2[i]) {
      return true;
    } else if (sp1[i] < sp2[i]) {
      return false;
    } else {
      continue;
    }
  }

  return true;
};

// ['h1' 'body'] 这样
const getSpecificity = (selectors) => {
  let i = 0;
  let j = 0;
  let k = 0;

  for (let selector of selectors) {
    if (selector.charAt(0) === "#") {
      i++;
    } else if (selector.charAt(0) === ".") {
      j++;
    } else {
      k++;
    }
  }

  return [0, i, j, k];
};

// element {tagName,...} 之类
// selector 'h1' 之类
const match = (element, selector) => {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.charAt(0) === "#") {
    const attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    const attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
};

exports.compare = compare;
exports.getSpecificity = getSpecificity;
exports.match = match;
