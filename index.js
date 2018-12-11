const express    = require('express');
const fs         = require('fs')
const app        = express();
const port       = 25565;
const jsonParser = require('body-parser').json();

app.post('/upload/:projectID', jsonParser, function (req, res) {
    const projectID = req.params.projectID;
    const fPath     = `files/${projectID}.json`;
    const newData   = req.body;

    let projectData = {};
    if (fs.existsSync(fPath)) {
        projectData = JSON.parse(fs.readFileSync(fPath));
    }

    let outputData = {};
    for (box in newData){
        if (newData[box].version > projectData[box].version){
            projectData[box] = newData[box];
        }else{
            outputData[box] = projectData[box]
        }
    }

    fs.writeFileSync(fPath, JSON.stringify(projectData, null, 2));

    res.send(outputData);
});

app.post('/download/:projectID', jsonParser, function (req, res) {
    const projectID = req.params.projectID;
    const fPath     = `files/${projectID}.json`;
    const manifest  = req.body;

    let projectData = {};
    if (fs.existsSync(fPath)) {
        projectData = JSON.parse(fs.readFileSync(fPath));
    }

    let outputData = {};
    for (box in projectData){
        if (!manifest[box] || projectData[box].version>manifest[box]){
            outputData[box] = projectData[box]
        }
    }

    //res.send(JSON.stringify(outputData));
    res.send(outputData);
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});