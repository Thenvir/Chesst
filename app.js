// Init - Requirements
const PORT = 3000 || process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res){
    res.render('index');
});

app.listen(PORT, function(){
    console.log("Running on: " + PORT);
});