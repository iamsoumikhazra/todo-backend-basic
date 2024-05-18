const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  let todo = '<button><a href="http://localhost:3000/todos" >View All</a></button>';
  let addTodo = '<button><a href="http://localhost:3000/addtodo">Add Todo</a></button>';
  let deleteTodo = '<button><a href="http://localhost:3000/delete-todo/:id">Delete Todo</a></button>';
  let updateTodo = '<button><a href="http://localhost:3000/update-todo/:id">Update Todo</a></button>';
  res.send(todo + " " + addTodo + " " + deleteTodo + " " + updateTodo);
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.post("/addtodo", async(req, res) => {
  const existingData = await fs.readFileSync("./todo.json", "utf8");
  const existingObject = JSON.parse(existingData);
  const newMessage = req.body;
  existingObject.messages.push(newMessage);
  const updatedData = JSON.stringify(existingObject, null, 2);
  await fs.writeFileSync("./todo.json", updatedData);
  res.json({ success: true });
});

app.get("/todos", async(req, res) => {
  const data = await fs.readFileSync("./todo.json", "utf8");
  const object = JSON.parse(data);
  res.json(object);
});
app.get("/delete-todo/:id", async(req, res) => {
  const data = await fs.readFileSync("./todo.json", "utf8");
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
  await fs.writeFileSync("./todo.json", updatedData);
  if(!deletedMessage) return res.json({ success: false, error: "No Todo Found" });
  else{
  res.json({ success: true, deletedMessage });
  }
});

app.put("/update-todo/:id", async(req, res) => {
  const data = await fs.readFileSync("./todo.json", "utf8");
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
  await fs.writeFileSync("./todo.json", updatedData);
  if(!updatedMessage) return res.json({ success: false, error: "No Todo Found" });
  else{
  res.json({ success: true , updatedMessage});
  }
});