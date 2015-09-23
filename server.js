var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var MongoStore = require('connect-mongo')(session);
app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/angular_session'
    }),
    secret: 'angular-tutorial',
    resave: true,
    saveUninitialized: true
}));

var fs = require('fs');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));

db.open(function() {
    console.log("mongo db is opened!");
});

db.collection('notes', function(error, notes) {
    db.notes = notes;
});

app.listen(3000);

var ObjectID = require('mongodb').ObjectID;

app.get("/notes", function(req, res) {
    db.notes.find(req.query).sort({order: 1}).toArray(function(err, items) {
        req.session.notes_amount = items.length;
        res.send(items);
    });
    console.log('notes amount = ' + req.session.notes_amount);
});

app.post("/notes", function(req, res) {
    req.body.date=new Date();
    req.body.order = req.session.notes_amount;
    db.notes.insert(req.body);
    req.session.notes_amount++;
    res.end();
});

app.post("/notes/:id/top", function(req, res) {
    console.log('params=', req.params);
    console.log('query=', req.query);
    var id = new ObjectID(req.params.id);
    console.log('wrappedId=', id);
    db.notes.find()
        .sort({order: 1})
        .limit(1)
        .toArray(function(err, items) {
            if (err) {
                console.log(err);
            } else {
                console.log('minNote=', items[0]);
                var minOrder = items[0].order;
                console.log('minOrder = ' + minOrder);
                console.log('updated note id=', id);
                var updatedMinOrder = minOrder - 1;
                console.log('updated note order=', updatedMinOrder);
                db.notes.update({_id: id},
                    {$set: {order: updatedMinOrder}}, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                res.end();
            }
        });
});

app.delete("/notes", function(req, res) {
    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function(err) {
        if (err) {
            console.log(err);
            res.send("Failed");
        } else {
            req.session.notes_amount--;
            res.send("Success");
        }
    });
    console.log('notes amount = ' + req.session.notes_amount);
});

db.collection('sections', function(error, sections) {
    db.sections = sections;
});

app.get("/sections", function(req, res) {
    db.sections.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.post("/sections/replace", function(req, res) {
    // do not clear the list
    if (req.body.length = 0) {
        res.end;
    }

    db.sections.remove({}, function(err, res) {
        if (err) {
            console.log(err);
        }
        db.sections.insert(req.body, function(err, res) {
            if (err) {
                console.log('err after insert', err);
                res.end();
            }
        });
    });
});


