// Init - Requirements
const PORT = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to mongo 
mongoose.connect("mongodb+srv://user:pass@cluster0.hgwhu.mongodb.net/chesstDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Create Schema
const gameSchema = {
    title: String,
    link: String,
}

// Create Model based on Schema
const Game = mongoose.model("Game", gameSchema);

// Default game
const game1 = new Game({
    title: "Games Will Show Here", 
    link: "https://lichess.org/cEsWZ31M",
});

// Default games
const defaultGames = [game1];

// Render index page
app.get('/', function(req, res){
    // Get games from DB
    Game.find({}, function(err, foundGames){
        if(foundGames.length === 0){
            // Insert default if DB is empty - else render games
            Game.insertMany(defaultGames, function(err2){
                if(err2){
                    console.log(err2);
                } else {
                    console.log("Successfully saved default items to db");
                }
            });
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
