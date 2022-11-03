import { createElement } from "./micro-react";

const element = createElement(
  "h1",
  { id: "title", text: "123" },
  "hello",
  createElement("h2", { id: "content", text: "123" }, "hello")
);

console.log(element);
