# 有限状态机

大家可能听说过状态机。其实在日常工作中，我们说的状态机就是有限状态机，因为无限状态机的概念只存在理论当中。

有限状态机有如下两个特点：

1. 每一个状态都是一个机器：

   - 所有的这些机器接受的输入类型都是一致的。
   - 在每一个机器里，我们都可以做计算、存储、输出。
   - 每一个机器本身没有状态。如果我们用函数表示每一个机器，函数应该是纯函数，也就是无副作用的。

2. 每一个机器知道下一个状态，分为 2 种：

   - Moore 型：每一个机器都有确定的下一个状态。
   - **Mealy 型**：每一个机器的下一个状态由输入决定。我们碰到的一般是这种状态机。

## Mealy 型状态机的一般套路

```javascript
// 函数作为状态机
function state(input) {
  // ... 处理其他逻辑
  return nextState; // 返回值 nextState 也是一个函数，作为下一个输入的状态机
}

// input 源源不断地喂进来
while (input) {
  // 运转一个个状态机
  state = state(input);
}
```

## 不使用状态机处理字符串

我们先来解决一个简单地问题：

> 在一个字符串中，找到字符 "a"。

```javascript
function match(str) {
  for (let c of str) {
    if (c === "a") {
      return true;
    }
  }
  return false;
}

let result = match("I am groot");
console.log(result);
```

现在问题升级：

> 在一个字符串中，找到字符 "ab"。要求不能使用正则表达式。

```javascript
function match(str) {
  let isAFound = false;

  for (let c of str) {
    if (c === "a") {
      isAFound = true;
    } else if (c === "b" && isAFound) {
      return true;
    } else {
      isAFound = false;
    }
  }
  return false;
}

let result = match("I abm groot");
console.log(result);
```

现在问题继续升级：

> 在一个字符串中，找到字符 "abcdef"。要求不能使用正则表达式。

```javascript
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
```

从这些一步步复杂地例子看起来，代码写得越来越难看懂。

## 使用状态机处理字符串

### 字符串中无重复

还是上面地问题，现在我们用状态机来实现。

> 在一个字符串中，找到字符 "abcdef"。要求不能使用正则表达式。

```javascript
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
  return start;
};

const foundB = (c) => {
  if (c === "c") {
    return foundC;
  }
  return start;
};

const foundC = (c) => {
  if (c === "d") {
    return foundD;
  }
  return start;
};

const foundD = (c) => {
  if (c === "e") {
    return foundE;
  }
  return start;
};

const foundE = (c) => {
  if (c === "f") {
    return end;
  }
  return start;
};

const end = () => end;

let result = match("I abcdefm groot");
console.log(result);
```

上面地代码表面上看不错，但其实是有 bug 的。比如，如果输入了 `I abcabcdefm groot`，输出竟然是 false。

这个问题的原因是因为，当执行到 `abca` 中后一个 a 时，它被 foundC 给消费掉了，导致了后面的一步步错误。为了解决这个问题，我们需要在各个状态上将这个 a 丢给 start 消费，也就是 reConsume：

```javascript
const foundA = (c) => {
  if (c === "b") {
    return foundB;
  }
  return start(c); // 👈 reConsume
};

// 其他的也按照 foundA 的方式改动
```

### 字符串中有重复

现在，问题继续升级：

> 使用状态机处理诸如 `abcabx` 这样的字符串

我们还是需要使用 reConsume。但是有一点要注意，由于字符串中存在重复，所以 foundB2 的状态在处理时，可能需要回到 foundB 状态进行处理。

```javascript
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
```

那么，我们来挑战一个更难的：

> 使用状态机处理诸如 `abababx` 这样的字符串

这个问题解决方法和上面的类似。

```javascript
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
```

## 解决问题的步骤

从上面的问题以及解决方法来看，状态机的问题主要可以通过以下方法解决：

1. 画状态转移图
2. 合理使用 reConsume
