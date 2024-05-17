const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  let todo = '<a href="http://localhost:3000/todos">View All</a>';
  let addTodo = '<a href="http://localhost:3000/addtodo">Add Todo</a>';
  let deleteTodo = '<a href="http://localhost:3000/delete-todo/:id">Delete Todo</a>';
  let updateTodo = '<a href="http://localhost:3000/update-todo/:id">Update Todo</a>';
  res.send(todo + " " + addTodo + " " + deleteTodo + " " + updateTodo);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.post("/addtodo", (req, res) => {
  const existingData = fs.readFileSync("./todo.json", "utf8");
  const existingObject = JSON.parse(existingData);
  const newMessage = req.body;
  existingObject.messages.push(newMessage);
  const updatedData = JSON.stringify(existingObject, null, 2);
  fs.writeFileSync("./todo.json", updatedData);
  res.json({ success: true });
});

app.get("/todos", (req, res) => {
  const data = fs.readFileSync("./todo.json", "utf8");
  const object = JSON.parse(data);
  res.json(object);
});
app.get("/delete-todo/:id", (req, res) => {
  const data = fs.readFileSync("./todo.json", "utf8");
  const object = JSON.parse(data);
  const id = req.params.id;
  let deletedMessage = null;

  for (let i = 0; i < object.messages.length; i++) {
    if (object.messages[i].id == id) {
      deletedMessage = object.messages.splice(i, 1)[0];
      break;
    }
  }
  const updatedData = JSON.stringify(object, null, 2);
  fs.writeFileSync("./todo.json", updatedData);
  res.json({ success: true, deletedMessage });
});

app.put("/update-todo/:id", (req, res) => {
  const data = fs.readFileSync("./todo.json", "utf8");
  const object = JSON.parse(data);
  const id = req.params.id;
  const updatedMessage = req.body;
  for (let i = 0; i < object.messages.length; i++) {
    if (object.messages[i].id == id) {
      object.messages[i] = updatedMessage;
      break;
    }
  }
  const updatedData = JSON.stringify(object, null, 2);
  fs.writeFileSync("./todo.json", updatedData);
  res.json({ success: true , updatedMessage});
});