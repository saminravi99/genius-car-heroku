const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Genius Server Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwygg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Genius Car Service");
    const serviceCollection = client.db("geniusCar");
    const collection = serviceCollection.collection("service");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.collection("service").find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await collection.findOne(query);
      res.send(service);
    });

    app.post('/services',  async(req, res) =>{
      const newService = req.body;
      const result = await collection.insertOne(newService);
      res.send(result);
    })
    app.delete('/services/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    })
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
