/********************************************************************************* 
 * * WEB422 – Assignment 1 
 * * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * * No part of this assignment has been copied manually or electronically from any other source 
 * * (including web sites) or distributed to other students. *
 * * Name: Rafaela Pelegrini 
 * * Student ID: 053660130 Date: 2021-09-16 
 * * Heroku Link: https://enigmatic-reef-63285.herokuapp.com/
 
 * * ********************************************************************************/

var express = require('express');//talk to the webborwser  to the node.js, require: loads in the files.
var path = require('path');
const bp = require('body-parser');
const cors = require('cors');
const restaurantDB = require('./modules/restaurantDB.js'); //reading the file in 
const db = new restaurantDB();//makes the restaurant object 
var app = express();//make the express object to use get/post
app.use(express.static('public'));
var HTTP_PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());// tell the express to use the cors

app.get("/", (req, res) => {//default 

    res.json({ message: "API Listening" });

});

db.initialize('mongodb+srv://dbUser:Seneca2021@cluster0.yhdwf.mongodb.net/sample_restaurants?retryWrites=true&w=majority').then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});


app.post("/api/restaurants", (req, res) => {
    //data=db.makeData();
    //var result = db.addNewRestaurant(data);
    var result = db.addNewRestaurant(req.body);
    if (result != null) {
        res.status(201).json({ message: "New Restaurant created" });
    }
    else {
        res.status(400).json({ message: "New Restaurant not created" });
    }


});

// app.post("/api/test", (req, res) => {
//   data=db.makeData();
//    var result = db.addNewRestaurant(req.body);
//     var result = data;
//     console.log(JSON.stringify(result));
//     if (result != null) {
//         res.status(201).json({ message: "New Restaurant created" });
//     }
//     else {
//         res.status(400).json({ message: "New Restaurant not created" });
//     }


// });

//async : the server needs t wait for the db to get the data from the cloud
app.get("/api/restaurants", async (req, res) => {
    return res.json(await db.getAllRestaurants(parseInt(req.query.page), parseInt(req.query.perPage), req.query.borough));



});

app.get("/api/restaurants/:id", async (req, res) => { //async tells the function to be syncrones 
    //console.log("RESTAURANT BY ID" + req.params.id);
    try {
        let restaurant = await db.getRestaurantById(req.params.id);
        //tells the server to wait for the completion of the db function 

        if (restaurant) {//program gets the data from the db from the cloud , takes time to go to the cloud, that's why it needs to wait 
            res.json(restaurant);
        } else {
            res.status(404).json({ message: "no restaurant name found" })
        }
    }
    catch {
        res.status(404).json({ message: " wrong restaurant id" });
    }
});
//app.put("/api/restaurants/:id", (req, res) => {
app.put("/api/restaurants/:id", async (req, res) => {//syncronis:wait for something to complete
    if (await db.updateRestaurantById(req.body,req.params.id)) {
        res.json({ message: "Restaurant name updated successfully" });
    } else {
        res.status(404).json({ message: "no Restaurant name found" });
    }
});

app.delete("/api/restaurants/:id", async (req, res) => {
    if (await db.deleteRestaurantById(req.params.id)) {
        res.json({ message: "Restaurant name deleted successfully" });
    } else {
        res.status(404).json({ message: "no Restaurant name found" });
    }



});

app.get("/api/getAllUsers", async (req, res) => {
    res.json(await db.getAllUsers());
});
