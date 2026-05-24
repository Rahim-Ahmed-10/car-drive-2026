const express = require('express');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 8085;

// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");


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

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));


const logger = (req, res, next) => {
      console.log(`${req.method} | ${req.url}`);
      next();
      }

const verifyToken =async (req, res, next) => {
  const {authorization} =req.headers
console.log(req.headers, 'form verify token');
const token = authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    console.log(payload);
    next()
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }

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
        res.status(404).json({massage:"Data not found"})
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