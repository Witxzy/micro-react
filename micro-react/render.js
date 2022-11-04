function render(element, container) {
  // 创建元素
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // 为元素添加属性
  Object.keys(element.props).forEach((key) => {
    //console.log(key);
    if (key !== "children") {
      console.log(key);
      dom[key] = element.props[key];
    }
  });

  // 递归的对children执行同样操作
  element.props.children.forEach((child) => render(child, dom));

  // 追加dom
  container.append(dom);
}

let nextUnitOfWork = null;

// 调度函数
function workLoop(deadLine) {
  // 退出标志位
  let shouldYield = false;

  // 有工作且浏览器还有剩余时间
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = perfromUnitOfWork(nextUnitOfWork);
    shouldYield = deadLine.timeRemaining() < 1;
  }

  // 没有足够时间，请求下次浏览器空闲时执行
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function perfromUnitOfWork(work) {}

export default render;
