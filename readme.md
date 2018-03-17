# 项目目的

## 面向对象的编程练习

- 了解scrollTop,scrollHeight,clientHeight的区别

- jquery事件的命名空间以及事件代理

  1. $doc.on('click.name',proxyed,callback) 其中click后面.name就为该事件的命名空间,proxyed为事件代理的目标元素(通常一开始不存在后来被动态插入的元素) $doc.off(".name")可以指定关掉这个事件,不与其他的相冲突
  2. 本项目最为核心的代码为:{ slider.on({ "mousedown": function(e) {

    ```
       e.preventDefault();
       pageyStart = e.pageY;
       contScrollStart = self.$cont.scrollTop();
       self.$doc.on({
           "mousemove.scroll": contScrollFunc,
           "mouseup.scroll": function(e) {
               e.preventDefault();
               self.$doc.off(".scroll")
           }
       })
    ```

     } })

  } 在点击以后的回调中监听mousemove和mouseup,当mouseup触发时关掉这个事件的监听 模拟出移动端touchstart,touchmove,touchend
