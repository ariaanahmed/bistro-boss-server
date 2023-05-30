const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.jvx2mqj.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const usersCollection = client.db("bistroDB").collection("users");
        const menuCollection = client.db("bistroDB").collection("menu");
        const reviewsCollection = client.db("bistroDB").collection("reviews");
        const cartsCollection = client.db("bistroDB").collection("carts");
        
        // user related APIs
        
        app.get('/users', async(req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            console.log(user);
            const query = {email: user.email};
            const existingUser = await usersCollection.findOne(query);
            if(existingUser){
                return res.send({message: 'user already exists'})
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // menu related APIs
        app.get('/menu', async(req,  res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })
        // review related APIs
        app.get('/reviews', async(req,  res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        // cart collection APIs

        app.get('/carts', async(req, res) => {
            const email = req.query.email;
            if(!email){
                res.send([])
            }
            const query = {email: email};
            const result = await cartsCollection.find(query).toArray();
            res.send(result);   
        })
        app.post('/carts', async(req, res) => {
            const item = req.body;
            const result = await cartsCollection.insertOne(item);
            res.send(result)
        })

        app.delete('/carts/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('BOSS SERVER IS RUNNING')
})

app.listen(port, () => {
    console.log(`BISTRO BOSS IS RUNNING AT PORT: ${port}`)
})


/*
*--------------------------
*     NAMING COMVENTION
*--------------------------
*users: userCollection
* app.users('/users')
* app.users('/users/:id')
* app.post('/users')
* app.patch('/users/:id')
* app.put('/users/:id')
* app.delete('/users/:id')
*/ 