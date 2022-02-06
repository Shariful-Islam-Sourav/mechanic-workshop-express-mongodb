const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 9000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3uhme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("carworkshop");
    const servicesCollection = database.collection("services");
    
    //GET API
    app.get("/services", async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })

    //GET SINGLE SERVICE
    app.get('/services/:serviceId', async (req, res) => {
        const serviceId = req.params.serviceId;
        const query = {_id: ObjectId(serviceId)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })

    //POST API
    app.post("/services", async(req,res) => {
        const service = req.body;
        const result = await servicesCollection.insertOne(service);
        res.json(result)
    })
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Workshop Server");
});

app.listen(port, () => {
  console.log("Running Workshop Server at", port);
});
