const net = require("net");
const { parse } = require("path");
const { ResponseParser } = require("./ResponseParser");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host || "localhost";
    this.path = options.path || "/";
    this.port = options.port || 80;
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.getStatusLine()}${this.getHeaders()}\r\n${this.getBody()}`;
  }

  getStatusLine() {
    return `${this.method} ${this.path} HTTP/1.1\r\n`;
  }

  getHeaders() {
    return (
      Object.keys(this.headers)
        .map((key) => `${key}: ${this.headers[key]}`)
        .join(`\r\n`) + "\r\n"
    );
  }

  getBody() {
    return `${this.bodyText}\r\n`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            port: this.port,
            host: this.host,
          },
          () => {
            console.log("connected to server!");
            // socket 中写入 HTTP Request 格式的字符串
            connection.write(this.toString());
          }
        );

        connection.on("data", (data) => {
          // 由于 TCP 是流式传输，我们压根不知道 data 是不是一个完整的返回。也就是说， onData 事件可能发生多次。
          // 所以每次触发新的 onData 事件，就将返回的 data 数据流喂给状态机。
          console.log(data.toString());
          parser.receive(data.toString());
          if (parser.isFinished) {
            console.log("&&&&", parser.response);
            resolve(parser.response);
            connection.end();
          }
        });

        connection.on("end", () => {
          console.log("disconnected from server");
        });

        connection.on("error", (err) => {
          reject(err);
          connection.end();
        });
      }
    });
  }
}

exports.Request = Request;
