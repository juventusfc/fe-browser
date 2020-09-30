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
  if (c === "a") {
    return foundA2;
  }
  return start(c);
};

const foundA2 = (c) => {
  if (c === "b") {
    return foundB2;
  }
  return start(c);
};

const foundB2 = (c) => {
  if (c === "x") {
    return end;
  }
  return foundB(c); // 👈 reConsume
};

const end = () => end;

let result = match("abcabcabx");
console.log(result);
