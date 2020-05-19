const express = require('express');
const app = express();

app.set('views','form');
app.set('view engine', 'pug');

app.get('/', (req,res) => {
    
    res.render('page');

});

app.listen(2021);