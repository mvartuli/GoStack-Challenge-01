const express = require("express");

const server = express();

//To inform express to read JSON from request body
server.use(express.json());

// query params = ?teste=1
// route params = /usrs/1
// request body = { "name": "Diego", "email": "diego@rocket.com"}

//users vector to simulate data storage
const projects = [
    {
        id: "1",
        title: "Projeto 1",
        tasks: ["Task 1"]
    }
];

let numReqs = 0;

//Global Middleware - always is called on every requisition
server.use((req, res, next) => {
    //to check the passed time the keyword in the parameter has to be the same in timeEnd call
    console.time("Request");
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    //next() returnes the excution to the called route and come back afterwards
    next();
    numReqs++;
    console.log(`Total requests: ${numReqs}`);
    //to check the passed time the keyword in the parameter has to be the same in timeEnd call
    console.timeEnd("Request");
});

//Local Middleware to check if the index of the project passed ind the querystring is valid
function checkProjectID(req, res, next) {
    const projectIndex = projects.findIndex(cur => cur.id === req.params.id);
    if (projectIndex === -1) {
        return res.status(400).json({
            error: "project does not exist"
        });
    }
    req.projectIndex = projectIndex;
    return next();
}

//route to return all projects
server.get("/projects", (req, res) => {
    return res.json(projects);
});

// route to create one project from request body
server.post("/projects", (req, res) => {
    const { id, title } = req.body;
    //projects.push({ id: id, title: title, tasks: [] });
    projects.push({ id, title, tasks: [] });
    return res.json(projects);
});

// route to create one task in one given project
server.post("/projects/:id/tasks", checkProjectID, (req, res) => {
    projects[req.projectIndex].tasks.push(req.body.task);
    return res.json(projects);
});

//route to edit the title of one project
server.put("/projects/:id", checkProjectID, (req, res) => {
    projects[req.projectIndex].title = req.body.title;
    return res.json(projects);
});

//route to delete one project
server.delete("/projects/:id", checkProjectID, (req, res) => {
    projects.splice(req.projectIndex, 1);
    return res.send();
});

server.listen(3000);
