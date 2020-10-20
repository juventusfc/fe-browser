const { Request } = require("./http/Request");
const { HTMLParser } = require("./parser/HTMLParser");

void (async function () {
  let request = new Request({
    method: "POST",
    host: "localhost",
    path: "/",
    port: 8088,
    headers: {
      "Content-Type": "application/json",
      "X-Foo2": "customed",
    },
    body: {
      name: "frank",
    },
  });
  const response = await request.send();
  const dom = HTMLParser.parse(response.body);
  // console.log(dom);
})();
