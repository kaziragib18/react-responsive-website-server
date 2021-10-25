const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txagv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
      try {
            await client.connect();
            // console.log('connected to database');
            const database = client.db('car_kit');
            const servicesCollection = database.collection('services');

            //GET API 
            app.get('/services', async (req, res) => {
                  const cursor = servicesCollection.find({});
                  const services = await cursor.toArray();
                  res.send(services);

            })

            //GET SINGLE SERVICE
            app.get('/services/:id', async (req, res) => {
                  const id = req.params.id;
                  console.log('Getting specific service', id);
                  const query = { _id: ObjectId(id) };
                  const service = await servicesCollection.findOne(query);
                  res.json(service);

            })


            //POST API
            app.post('/services', async (req, res) => {
                  const service = req.body;
                  console.log('Hit the post', service);

                  const result = await servicesCollection.insertOne(service);
                  console.log(result);
                  res.json(result)
            });

            //DELETE API
            app.delete('/services/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id:ObjectId(id) };
                  const result = await servicesCollection.deleteOne(query);
                  // console.log(result);
                  res.json(result);
            })
      }
      finally {
            // await client.close();
      }
}
run().catch(console.dir);

app.get('/', (req, res) => {
      res.send('Car Kit Server Running')
});

app.listen(port, () => {
      console.log('Running Car kit server on port', port);
})