require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const Person = require("./models/person");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

morgan.token("body", (req, res) =>
  Object.keys(req.body).length !== 0 ? JSON.stringify(req.body) : null
);
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] :response-time :body")
);
app.use(cors());
app.use(express.static("build"));

app.get("/info", (req, res, next) => {
  Person.count()
    .then((dbRes) => {
      const content =
        `<div>Phonebook has info for ${dbRes} people</div>` + "<br/>" + Date();
      res.send(content);
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res, next) => {
  return Person.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()));
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  var name = body["name"];
  var number = body["number"];

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((dbRes) => {
      console.log(`added ${name} number ${number} to phonebook db`);
      res.json(dbRes);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name: body.name, number: body.number },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((dbRes) => {
      res.json(dbRes.toJSON());
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((dbRes) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
