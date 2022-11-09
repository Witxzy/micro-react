function createDom(fiber) {
  // 创建元素
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 为元素添加属性
  Object.keys(fiber.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = fiber.props[key];
    }
  });

  return dom;
}

let nextUnitOfWork = null;
let wipRoot = null;

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    sibling: null,
    child: null,
    parent: null,
  };

  nextUnitOfWork = wipRoot;
}

function commitRoot() {
  commitWork(fiber);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 调度函数
function workLoop(deadLine) {
  // 退出标志位
  let shouldYield = false;

  // 有工作且浏览器还有剩余时间
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = perfromUnitOfWork(nextUnitOfWork);
    shouldYield = deadLine.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  // 没有足够时间，请求下次浏览器空闲时执行
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function perfromUnitOfWork(fiber) {
  // 添加dom节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 追加到父节点
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 创建children的fiber
  const elements = fiber.props.children;
  let prevSibling = null;

  // 构建fiber树
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };

    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
  }

  // 返回下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

export default render;
