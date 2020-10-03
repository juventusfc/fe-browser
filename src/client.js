const net = require("net");

class Request {
  constructor(obj) {
    // this.method = obj.method;
    // this.host = obj.host;
    // this.path = obj.path;
    // this.port = obj.port;
    // this.headers = obj.headers;
    // this.body = obj.body;
  }

  send() {
    const client = net.createConnection(
      {
        port: 8088,
        host: "localhost",
      },
      () => {
        console.log("connected to server!");
        // socket 中写入 HTTP Request 格式的字符串
        client.write("GET / HTTP/1.1\r\n\r\n");
      }
    );
    client.on("data", (data) => {
      console.log(data.toString());
      client.end();
    });
    client.on("end", () => {
      console.log("disconnected from server");
    });
  }
}

void (async function () {
  let request = new Request();
  const response = await request.send();
  console.log(response);
})();
