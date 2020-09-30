const match = (str) => {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
};

const start = (c) => {
  if (c === "a") {
    return foundA;
  }
  return start;
};

const foundA = (c) => {
  if (c === "b") {
    return foundB;
  }
  return start(c);
};

const foundB = (c) => {
  if (c === "c") {
    return foundC;
  }
  return start(c);
};

const foundC = (c) => {
  if (c === "d") {
    return foundD;
  }
  return start(c);
};

const foundD = (c) => {
  if (c === "e") {
    return foundE;
  }
  return start(c);
};

const foundE = (c) => {
  if (c === "f") {
    return end;
  }
  return start(c);
};

const end = () => end;

let result = match("I abcabcdefm groot");
console.log(result);
