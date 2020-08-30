// Init - Requirements
const PORT = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Local storage for now
let games = [];
// function Game(title, link) {
//     this.title = title;
//     this.link = link;
// };
// var game1 = new Game("Me vs Adrian, Chigorin", "https://lichess.org/YlZfgDfs");
// games.push(game1);

// chesstpass
// Connect to mongo 
mongoose.connect("mongodb+srv://admin-thenvir:chesstpass@cluster0.hgwhu.mongodb.net/chesstDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Create Schema
const gameSchema = {
    title: String,
    link: String,
}

// Create Model based on Schema
const Game = mongoose.model("Game", gameSchema);

// Default game
const game1 = new Game({
    title: "GM penguingim1 Crazy Blunder", 
    link: "https://lichess.org/A23XQK61",
});

// Default games
const defaultGames = [game1];
let firstVisit = true;

// Render index page
app.get('/', function(req, res){
    // Get games from DB
    Game.find({}, function(err, foundGames){
        if(firstVisit){
            // Insert default if DB is empty - else render games
            Game.insertMany(defaultGames, function(err2){
                if(err2){
                    console.log(err2);
                } else {
                    console.log("Successfully saved default items to db");
                }
            });
            firstVisit = false;
            res.redirect('/');
        } else {
            res.render('index', {games: foundGames});
        }
    });
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

    // Add to game array and render the home page
    const userGame = new Game({
        title: title, 
        link: link,
    });
    userGame.save();
    return res.redirect('/');
});

app.post('/delete', function(req, res){
    // Get game to delete by link
    const gameToDelete = req.body.removeButton;
    // Delete from DB and redirect to home 
    Game.deleteOne({'link': gameToDelete}, function(err){
        if(!err){
            console.log("Successfully deleted item!");
        }
        else{
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(PORT, function(){
    console.log("Running on: " + PORT);
});