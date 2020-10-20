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

3. 计算 CSS。这一步的目的，是将 CSS 应用于 DOM，也就是说，在 element 上增加 computedStyle 属性。这一步，我们不对 `<link>` 指向的 CSS 文件做兼容。

   1. 安装 css 包。该包能将字符串转换成 CSS 的 AST。

      ```bash
      npm i css
      ```

   2. 收集 CSS 规则。当 emit 的 endTag 是 style 时，使用 css 包，将规则存进 rules 中。
   3. 添加调用。当我们创建 DOM element 时，就会将 rules 应用于 element。
   4. 获取父元素序列。CSS 中，需要知道当前元素的所有父元素才能判断是否与 rule 匹配。rule 中，selector 是按照 `父->子` 的次序排列，子表示当前 element。如 `div #goods` 选择器表示匹配 id 为 goods 的元素，同时这个元素的父元素是 div。
   5. 选择器与元素匹配。这里有个 trick，其实我们要比较 elements 和 selectors 的匹配关系，我们将他们都放在数组里，我们从子到父的次序进行判断，所以有一个 reverse 的过程。这样，也就抽象为两个数组之间的匹配了。当然，我们还需要根据选择器的类型，判断选择器和当前 element 的匹配情况。
