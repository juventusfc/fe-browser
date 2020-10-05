const http = require("http");
const fs = require("fs");

let htmlData;
fs.readFile("./example.html", "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  htmlData = data;
});

http
  .createServer((req, res) => {
    let body = [];
    req
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        console.log("body", body);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlData);
      });
  })
  .listen(8088);

console.log("server started");
