const express = require("express");
const server = express();

/// Usando o json como modulo
server.use(express.json());

///Log de início do Servidor
console.log("Iniciando Servidor");

//Constante de teste
const projects = [];

let numberOfRequests = 0;

///Midleware de checagem de projeto
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

//numero de requests
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

//Rota de retorno de projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Rota de postagem de projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  //Na constante colocar todos os campos da array
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//Rota de postagem de task
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Rota de delete
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Rota de edição
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.listen(3000);
