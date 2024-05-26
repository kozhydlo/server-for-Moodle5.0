const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouters');
const mainRouter = require('./mainRouters');
const Grid = require('gridfs-stream');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/", mainRouter);

const start = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://kozhydlomark:mark2010@cluster0.v121azw.mongodb.net/Moodle5?retryWrites=true&w=majority&appName=Cluster0`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const gfs = Grid(conn.connection.db, mongoose.mongo);
        gfs.collection('uploads');

        app.set('gfs', gfs); // Збереження gfs в додатку

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
