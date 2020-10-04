# 实现 Toy-Browser 的步骤

1. 搭建一个 Server，只要能返回 Hello World 就可以。
2. 实现一个 HTTP 请求
   1. 从使用的角度，设计一个 HTTP 请求类 Request。其中，Content-Type 是一个必要的字段，要有默认值。 Content-Type 的不同决定了 body 字符串的写法。
   2. 设计 send 方法，将 Request 发送出去
      1. 返回一个 Promise。
      2. 基于 net 库，使用 `net.createConnection` 创建一个 Socket，前后端进行通信。通过 write 方法在 socket 中写入 HTTP Request 文本。
      3. 由于是 TCP 传输，onData 事件会不断触发，所以需要使用 ResponseParser，将后端返回过来的流式字符串使用状态机进行处理。
