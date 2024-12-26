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

        // jwt related APIs
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
                .send({ success: true })
        })

        app.post("/logout", (req, res) => {
            const body = req.body;
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
                .send({ success: true });
        })

        // Blog related APIs
        app.get("/blogs", async (req, res) => {
            const { category, search } = req.query;

            let query = {};

            if (category) {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                ];
            }

            const blogs = blogCollection.find(query);
            const result = await blogs.toArray();

            res.send(result);
        });

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        app.post('/blogs', verifyToken, async (req, res) => {
            const newBlog = req.body;
            const result = await blogCollection.insertOne(newBlog);
            res.send(result);
        })

        app.patch('/blogs/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const blogUpdates = req.body;

            delete blogUpdates._id;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: blogUpdates,
            };

            const result = await blogCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.get("/recent-blogs", async (req, res) => {
            const blogs = await blogCollection
                .find()
                .sort({ date: -1 })
                .limit(6)
                .toArray();

            res.send(blogs);
        });

        app.get("/featured-blogs", async (req, res) => {
            const blogs = await blogCollection
                .aggregate([
                    {
                        $addFields: {
                            wordCount: { $size: { $split: ["$longDescription", " "] } },
                        },
                    },
                    {
                        $sort: { wordCount: -1 },
                    },
                    {
                        $limit: 10,
                    },
                ])
                .toArray();

            res.send(blogs);
        });

        app.post('/comments', verifyToken, async (req, res) => {
            const newComment = req.body;
            const result = await commentsCollection.insertOne(newComment);
            res.json({ ...newComment, result });
        });

        app.get('/comments/:blogId', async (req, res) => {
            const { blogId } = req.params;
            const comments = await commentsCollection
                .find({ blogId: blogId })
                .toArray();
            res.send(comments);
        });

        // Wishlist related APIs
        app.get('/wishlist', async (req, res) => {
            const cursor = wishlistItemsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/wishlist/:email', verifyToken, async (req, res) => {
            const email = req.params.email;

            const query = { email: email };
            const cursor = wishlistItemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/wishlist', verifyToken, async (req, res) => {
            const newItem = req.body;
            const result = await wishlistItemsCollection.insertOne(newItem);
            res.send(result);
        });

        app.delete('/wishlist/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await wishlistItemsCollection.deleteOne(query);
            res.send(result);
        });

        // User related APIs
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users/public/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.get('/users/:email', verifyToken, async (req, res) => {
            const email = req.params.email;

            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access!' });
            }

            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    photo: user.photo,
                    createdAt: user.createdAt,
                    uid: user.uid,
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
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