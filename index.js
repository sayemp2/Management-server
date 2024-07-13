const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())
//
//zPutMB5HJNmNyDfT



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acyxhfp.mongodb.net/?appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const userDB = client.db("UserDB");
    const userList = userDB.collection("userList");

    app.get('/users', async (req, res) => {
      const users = await userList.find().toArray();
      res.send(users);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = { _id: new ObjectId(id) };
      const result = await userList.findOne(user);
      res.send(result);
    })

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
        }
      }
      const result = await userList.updateOne(filter, updateUser, option);
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userList.insertOne(user);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const user = { _id: new ObjectId(id) };
      const result = await userList.deleteOne(user);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Connect with Management server')
})
app.listen(port, () => {
  console.log(`connect with management server ${port}`);
})