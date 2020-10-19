# 实现 Toy-Browser 的步骤

1. HTTP 请求
   1. 搭建一个 Server，只要能返回 Hello World 就可以。
   2. 实现一个 HTTP 请求。从使用的角度，设计一个 HTTP 请求类 Request。其中，Content-Type 是一个必要的字段，要有默认值。 Content-Type 的不同决定了 body 字符串的写法。
   3. 设计 send 方法，将 Request 发送出去
      1. 返回一个 Promise。
      2. 基于 net 库，使用 `net.createConnection` 创建一个 Socket，前后端进行通信。通过 write 方法在 socket 中写入 HTTP Request 文本。
   4. 由于是 TCP 传输，onData 事件会不断触发，所以需要使用 ResponseParser，将后端返回过来的流式字符串使用状态机进行解析处理。
      1. 画出状态转移图
      2. 代码实现
2. 解析 HTML。这一步，我们偷个懒，将 HTML 全部返回后再进行解析。真实的浏览器中，肯定不会这么做。

   1. 使用状态机解析 HTML。这一步，先搭个状态机的架子。
   2. 根据[标准](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)，选择一些主要的状态机进行解析。标准已经是状态机的伪代码了。
   3. 解析标签。标签分成三种：开始标签、结束标签、自封闭标签。这一步，先忽略属性以及创建元素。
   4. 创建元素。在状态机中附加逻辑代码，生成对应的元素，也就是标准中说的 emit token。
   5. 处理属性。属性值分为双引号、单引号、无引号 3 种写法，当然，可能没有属性值，所以共 4 种。属性结束时，需要将属性加到 token 上。
   6. 使用栈构建 DOM。DOM 元素的表示方法为：

      ```javascript
      let o = {
        type: "element||text",
        tagName: "",
        attributes: [],
        children: [],
        parent: o,
        content: "",
      };

      let stack = [o];
      ```
