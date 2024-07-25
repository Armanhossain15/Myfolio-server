const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtlua5u.mongodb.net/?appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const projectCollection = client.db("Myfolio").collection("projects");
        const blogsCollection = client.db("Myfolio").collection("blogs");
        const blogsReviewsCollection = client.db("Myfolio").collection("Reviews");

        //project API
        app.get('/projects', async(req, res)=> {
            const result = await projectCollection.find().toArray()
            res.send(result)
        })
        app.get('/projects/:projectName', async(req, res)=> {
            const projectName = req.params.projectName
            const query = {title : projectName}
            const result = await projectCollection.findOne(query)
            res.send(result)
        })
        app.post('/projects', async(req, res)=>{
            const project = req.body.data
            // console.log(project);
            const result = await projectCollection.insertOne(project)
            res.send(result)
        })

        //blog API
        app.get('/blogs', async(req, res)=> {
            const result = await blogsCollection.find().toArray()
            res.send(result)
        })
        
        app.get('/blogs/:_id', async(req, res)=> {
            const id = req.params._id
            const query = {_id : new ObjectId(id)}
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })

        //blogReviews API
        app.get('/reviews', async (req, res)=> {
            const result = await blogsReviewsCollection.find().toArray()
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('portfolio sie server is ruuning')
})

app.listen(port, () => {
    console.log(`portfolio server is ruuning ${port}`);
})