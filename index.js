const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];
morgan.token("body", (req, res) =>
  Object.keys(req.body).length !== 0 ? JSON.stringify(req.body) : null
);
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] :response-time :body")
);
app.use(cors());

app.get("/info", (req, res) => {
  const content =
    `<div>Phonebook has info for ${persons.length} people</div>` +
    "<br/>" +
    Date();
  res.send(content);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  var name = body["name"];
  var number = body["number"];

  if (persons.find((x) => x.name === name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  if (!name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }

  if (!number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }

  const person = {
    name: name,
    number: number,
    id: Math.floor(Math.random() * 1000),
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
