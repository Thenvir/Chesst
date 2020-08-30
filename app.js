// Init - Requirements
const PORT = 3000 || process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Local storage for now
let games = [];
function Game(title, link) {
    this.title = title;
    this.link = link;
};
var game1 = new Game("Me vs Adrian, Chigorin", "https://lichess.org/YlZfgDfs");
games.push(game1);


// Connect to mongo 


// Render index page
app.get('/', function(req, res){
    res.render('index', {games: games});
});

// Post Request
app.post('/', function(req,res){

    // Get user input & make a game object
    const title = req.body.title;
    let link = req.body.link;

    // Validate inputs if empty / doesn't include http
    if(title.length === 0 || link.length === 0){
        return res.redirect('/');
    }
    if(!link.includes('https://')){
        link = 'https://' + link; 
    }
    const userGame = new Game(title, link);

    // Add to game array and render the home page
    games.push(userGame);
    return res.redirect('/');
});

app.listen(PORT, function(){
    console.log("Running on: " + PORT);
});