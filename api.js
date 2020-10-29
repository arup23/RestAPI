const express = require('express');
const app = express();
const port = process.env.PORT || 9500;
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClinet = mongo.MongoClient;
var mongourl = "mongodb+srv://Admin:LOLBiki972602@cluster0.wnm5t.mongodb.net/Edureka?retryWrites=true&w=majority";
var cors = require('cors');
var db;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('API is working')
});
//master Apis

app.get('/location', (req, res) => {
    db.collection('city').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/mealtype', (req, res) => {
    db.collection('mealtype').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/cuisine', (req, res) => {
    db.collection('cuisine').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/restaurant', (req, res) => {

        // resturent based on city & mealtype
        var query = {};
        if (req.query.city && req.query.mealtype) {
            query = { city: req.query.city, "type.mealtype": req.query.mealtype }
        } else if (req.query.city) {
            query = { city: req.query.city }
        } else if (req.query.mealtype) {
            query = { "type.mealtype": req.query.mealtype }
        } else {
            query = {}
        }

        db.collection('restaurant').find(query).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
    //subApi

//Details of resturents
app.get('/rsturentdetails/:id', (req, res) => {
    var query = { _id: req.params.id }
    db.collection('restaurant').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})


//List of Resturents

app.get('/restaurentList/:mealtype', (req, res) => {
    var condition = {};
    if (req.query.cuisine) {
        condition = { "type.mealtype": req.params.mealtype, "Cuisine.cuisine": req.query.cuisine }
    } else if (req.query.city) {
        condition = { "type.mealtype": req.params.mealtype, city: req.query.city }
    } else if (req.query.lcost && req.query.hcost) {
        condition = { "type.mealtype": req.params.mealtype, cost: { $lt: Number(req.query.hcost), $gt: Number(req.query.lcost) } }
    } else {
        condition = { "type.mealtype": req.params.mealtype }
    }
    db.collection('restaurant').find(condition).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

//postApi for placing the order

app.post('/placeorder', (req, res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body, (err, result) => {
        if (err) throw err;
        res.send('order placed')
    })

})

//for getting order
app.get('/orders', (req, res) => {
    db.collection('orders').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})


MongoClinet.connect(mongourl, (err, connection) => {
    if (err) throw err;
    db = connection.db('Edureka')
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`server is running on port ${port}`);
    })
})