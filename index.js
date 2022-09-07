const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors())
app.use(bodyParser.json());

const port = 3000;

const ITEMS = {
  users: [
    {
      id: 1,
      first_name: "Robert",
      last_name: "Schwartz",
      email: "rob23@gmail.com",
    },
    {
      id: 2,
      first_name: "Lucy",
      last_name: "Ballmer",
      email: "lucyb56@gmail.com",
    },
    {
      id: 3,
      first_name: "Anna",
      last_name: "Smith",
      email: "annasmith23@gmail.com",
    },
    {
      id: 4,
      first_name: "Robert",
      last_name: "Brown",
      email: "bobbrown432@yahoo.com",
    },
    {
      id: 5,
      first_name: "Roger",
      last_name: "Bacon",
      email: "rogerbacon12@yahoo.com",
    },
  ],
};

app.get("/users", (req, res) => {
  return res.status(200).send(JSON.stringify(ITEMS.users));
});

app.get("/users/:id", (req, res) => {
  const user = ITEMS.users.find(
    (user) => user.id === JSON.parse(req.params.id)
  );
  if (user) {
    return res.status(200).send(JSON.stringify(user));
  }
  return res.status(204).send(null);
});

app.post("/users/:id/update", (req, res) => {
  const body = req.body || {};
  const userIdx = ITEMS.users.findIndex(
    (user) => user.id === JSON.parse(req.params.id)
  );
  const user = ITEMS.users[userIdx];
  ITEMS.users[userIdx] = {...user, ...body}
  return res.status(200).send(ITEMS.users[userIdx]);
});

app.delete("/users/:id/delete", (req, res) => {
  const id = req.params.id
  ITEMS.users = ITEMS.users.filter(user => user.id !== JSON.parse(id))
  return res.status(200).send({success: true})
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
