const { MongoClient } = require("mongodb");
const express = require("express");
var cors = require("cors");
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pas4h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer_network");
    const eventsList = database.collection("eventsList");
    const volunteerList = database.collection("volunteerList");
    const registeredVolunteerListForEvents = database.collection(
      "registered_volunteer_list_for_events"
    );

    //Get All Event List
    app.get("/eventsList", async (req, res) => {
      const cursor = eventsList.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Insert Register User Data
    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await volunteerList.insertOne(user);
      res.json(result);
    });

    //Insert a volunteer in register event list
    app.post("/event-register", async (req, res) => {
      const event = req.body;
      const result = await registeredVolunteerListForEvents.insertOne(event);
      res.json(result);
    });

    //users registered event list
    app.post("/user-events", async (req, res) => {
      const uid = req.body;
      const query = { uid: { $in: uid } };
      const result = await registeredVolunteerListForEvents
        .find(query)
        .toArray();
      res.json(result);
    });

    //Delete Events
    app.delete("/my-events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await registeredVolunteerListForEvents.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Running Port: ${port}`);
});
