const net = require("net");

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

  send() {
    const client = net.createConnection(
      {
        port: this.port,
        host: this.host,
      },
      () => {
        console.log("connected to server!");
        // socket 中写入 HTTP Request 格式的字符串
        client.write(this.toString());
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

exports.Request = Request;
