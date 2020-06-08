const express = require('./node_modules/express');
const aws = require('aws-sdk');//to set  deployment -env variables for heroku
const bodyParser = require('body-parser');
const cors = require('cors');
// require('dotenv').config()
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();

app.use(cors());
app.use(bodyParser.json());




let s3 = new aws.S3({
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PWD: process.env.MONGO_PWD,
    MONGO_DBName: process.env.MONGO_DBName,
    PORT: process.env.PORT,

});



const MONGODB_URL=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@restapicluster0-1pve1.mongodb.net/${process.env.MONGO_DBName}?retryWrites=true&w=majority`

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    topics: {
        type: [],
        required: true
    }
})
const myCourse = mongoose.model('Course', CourseSchema);



app.get('/course', (req, res) => {
    myCourse.find()
        .then(course => res.json({ success: true, data: course }))
        .catch(err => res.json({ success: false, err }))
});
app.post('/addCourse', (req, res) => {
    myCourse.create(req.body)
        .then(course => res.json({ success: true, data: course }))
        .catch(err => res.json({ success: false, err }))
});


app.delete('/delete', (req, res) => {
    const id = req.query.id;
    myCourse.findByIdAndDelete({ _id: id })
        .then(course => res.json({ success: true, data: "course succesfully deleted" }))
        .catch(err => res.json({ success: false, err }))
});

app.put('/update', (req, res) => {
    const id = req.query.id;
    myCourse.findByIdAndUpdate({ _id: id }, req.body)
        .then(course => res.json({ success: true, data: "course succesfully updated" }))
        .catch(err => res.json({ success: false, err }))
});

app.get('/course/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    myCourse.findById({ _id: id })
        .then(course => res.json({ success: true, data: course }))
        .catch(err => res.json({ success: false, err }))
});
// console.log(process.env.PORT)

mongoose.connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        app.listen(`${process.env.PORT}`, () => console.log(`App running`));
    })
    .catch(err => console.log(err))
