const express = require('express');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 8085;

// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");




const products = [

  {name:"laptop", price:30000},
  {name:"HeadPhone, price:550"},
  {name:"Mobile", price:18500}

]

// app.get("/products", (req, res) => {
//   res.send(products);
// })



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const logger = (req, res, next) => {
      console.log(`${req.method} | ${req.url}`);
      next();
      }

const verifyToken =async (req, res, next) => {
console.log(req.headers)
}



async function server() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });



    const db =client.db("car-platform");
    const productCollection = db.collection("carProducts");

    app.get("/carProducts", async(req, res) =>{
      const cursor= productCollection.find();
      // console.log(cursor);
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);
    });

    app.get("/carProducts/:carProductId",logger, verifyToken,async(req, res) => {
      const {carProductId} = req.params;
      console.log(carProductId);
      const query = {_id:new ObjectId(carProductId)};
      // console.log(query);
      const result = await productCollection.findOne(query);
      if(result){
        // console.log("Data Found", result);
        res.send(result);
      }else{
        // console.log("No data found for this id");
        res.send(404).send({massage:"Data not found"})
      }

    })



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