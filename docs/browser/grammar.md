# 词法与语法分析

## 使用 Node.js 搭建一个 http server

参考[官网](https://nodejs.org/docs/latest-v10.x/api/http.htm)，使用 http 模块搭建 server。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(3000);
```

## 搭建 http client

为了测试 http server，我们需要搭建 http client。

最常见的 http client 是 xhr（XMLHttpRequest）。

```javascript
var xhr = new XMLHttpRequest();
xhr.open("get", "http://localhost:3000", false);
xhr.send();
xhr.responseText; //"ok"
```
