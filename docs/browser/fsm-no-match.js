function match(str) {
  let isAFound = false;
  let isBFound = false; // 👈
  let isCFound = false; // 👈
  let isDFound = false; // 👈
  let isEFound = false; // 👈
  for (let c of str) {
    if (c === "a") {
      isAFound = true;
    } else if (c === "b" && isAFound) {
      isBFound = true; // 👈
    } else if (c === "c" && isAFound && isBFound) {
      isCFound = true; // 👈
    } else if (c === "d" && isAFound && isBFound && isCFound) {
      isDFound = true; // 👈
    } else if (c === "e" && isAFound && isBFound && isCFound && isDFound) {
      isEFound = true; // 👈
    } else if (
      c === "f" &&
      isAFound &&
      isBFound &&
      isCFound &&
      isDFound &&
      isEFound
    ) {
      return true; // 👈
    } else {
      isAFound = false;
      isBFound = false; // 👈
      isCFound = false; // 👈
      isDFound = false; // 👈
      isEFound = false; // 👈
    }
  }
  return false;
}

let result = match("I abcdefm groot");
console.log(result);
