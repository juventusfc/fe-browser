# 实现 Toy-Browser 的步骤

1. 搭建一个 Server，只要能返回 Hello World 就可以。
2. 搭建一个简单版本 Client，向 Server 发送请求。在这里，我们基于 net 库。使用 `net.createConnection` 创建一个 Socket。通过 write 方法在 socket 中写入 HTTP Request 文本。
3. 重构 Client，抽象出 Request。
