const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://tech-sphere-3568c.web.app",
            "https://tech-sphere-3568c.firebaseapp.com",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: "Unauthorized Access!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized Access!" });
        }
        req.user = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bleng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const userCollection = client.db("blogDB").collection("users");
        const blogCollection = client.db("blogDB").collection("blogs");
        const wishlistItemsCollection = client.db("blogDB").collection("wishlistItems");
        const commentsCollection = client.db("blogDB").collection("comments");

        
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tech Sphere Server is running!')
    res.send(req.user);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})