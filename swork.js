const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');

app.set('views','form');
app.set('view engine', 'pug');

app.get('/', (req,res) => {    
    res.render('page');
});

app.post('/', (req,res) => {
    let calculator = spawn(path.resolve(__dirname,'bin','calcapp'),[0,10]);
    calculator.on('exit',() => {
        let data = fs.readFileSync(path.resolve(__dirname,'result.csv'),'utf-8');
        let lines = data.split('\n');
        data = lines.map(l => l.split(',').map(e => parseFloat(e)));
        res.json(data);
    });
});

app.listen(2021);