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

export default render;
