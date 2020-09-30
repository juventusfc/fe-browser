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
  if (c === "a") {
    return foundA3;
  }
  return start(c);
};

const foundA3 = (c) => {
  if (c === "b") {
    return foundB3;
  }
  return start(c);
};

const foundB3 = (c) => {
  if (c === "x") {
    return end;
  }
  return foundB2(c); // 👈 reConsume
};

const end = () => end;

let result = match("abababababababx");
console.log(result);
