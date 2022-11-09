import { createElement, render } from "./micro-react";

const element = createElement(
  "h1",
  { id: "title" },
  "hello",
  createElement("h2", { id: "content", style: "background:blue" }, "hello"),
  createElement(
    "a",
    { id: "content", href: "http://wwww.baidu.com" },
    "hello",
    createElement(
      "div",
      { id: "content", href: "http://wwww.baidu.com" },
      "hello"
    )
  )
);

const container = document.getElementById("root");
render(element, container);
