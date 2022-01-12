const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.801m1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("wonderlandRajshahi");
        const ridesCollection = database.collection("rides");
        const bookingsCollection = database.collection("bookings");

        // Get all rides
        app.get("/rides", async (req, res) => {
            const cursor = ridesCollection.find({});
            const rides = await cursor.toArray();
            res.send(rides);
        });

        // Get ride by id
        app.get("/rides/:rideId", async (req, res) => {
            const id = req.params.rideId;
            const query = { _id: ObjectId(id) };
            const ride = await ridesCollection.findOne(query);
            res.send(ride);
        });

        // Get all the bookings
        app.get("/bookings", async (req, res) => {
            const cursor = bookingsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get booking by email
        app.get("/bookings/:email", async (req, res) => {
            const email = req.params.email;
            const filter = bookingsCollection.find({ email: email });
            const result = await filter.toArray();
            res.send(result);
        });

        // Add a new ride information
        app.post("/rides", async (req, res) => {
            const rideDetail = req.body;
            const result = await ridesCollection.insertOne(rideDetail);
            res.send(result);
        });

        // Add a new booking
        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.send(result);
        });

        // Update bookings status
        app.put("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            // console.log("accessed");
            // console.log(id);
            // console.log(req.body.status);
            const query = { _id: ObjectId(id) };
            console.log(query);
            const updateDoc = {
                $set: {
                    status: req.body.status,
                },
            };
            const result = await bookingsCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // Delete a booking
        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Wonderland server is running");
});

app.listen(port, () => {
    console.log("Wonderland server is running on port:", port);
});
