const express = require('express');
const app = express();
const port = 3000;

// car-platform-side
// car-platform-side36321

const products = [

  {name:"laptop", price:30000},
  {name:"HeadPhone, price:550"},
  {name:"Mobile", price:18500}

]

// app.get("/products", (req, res) => {
//   res.send(products);
// })



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://car-platform-side:car-platform-side36321@ac-joyu3f9-shard-00-00.0zaxi3z.mongodb.net:27017,ac-joyu3f9-shard-00-01.0zaxi3z.mongodb.net:27017,ac-joyu3f9-shard-00-02.0zaxi3z.mongodb.net:27017/?ssl=true&replicaSet=atlas-ju8gcw-shard-0&authSource=admin&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function server() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
server().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World I am a web development !');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});