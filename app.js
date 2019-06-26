const express = require("express");
const mongoose = require("mongoose");
const _ = require('lodash');
const path = require('path');
var app = express();

var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/users', (req, res) => {
    User.find().then(
        users => res.render('index', { users: _.map(users, ({ firstName, lastName }) => ({ firstName, lastName }))})
    ).catch(err => res.send({ error: err.message || 'Something went wrong.'}));
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            console.log(item);
            res.send({ 
                _id: item._id,
                message: "item saved to database"
            });
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
}); 