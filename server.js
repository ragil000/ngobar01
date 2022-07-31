const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// koneksi mongo
mongoose.connect('mongodb://localhost:27017/ngobar01')
  .then((res) => {
    console.log('koneksi berhasil');
  })
  .catch((err) => {
    console.log('koneksi gagal', err);
  });

//  buat schema
const News = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'nonactive'],
        default: 'active'
    }
});

const NewsModel = mongoose.model('News', News);

// Ini untuk menampilkan data
app.get('/news', async (req, res) => {
    const status = req.query.status;
    let data = null;
    if(status) {
        data = await NewsModel.find({status: status});
    }else {
        data = await NewsModel.find({});
    }
    res.send({
        message: "menampilkan data berhasil",
        data: data
    });
});

// Ini untuk menambahkan data
app.post('/news', async (req, res) => {
    const data = {
        title: req.body.title,
        description: req.body.description
    };

    await NewsModel.create(data);
    res.send({
        message: "menambahkan data berhasil",
        data: data
    });
});

app.put('/news', async (req, res) => {
    const id = req.query.id;
    const data = {
        status: req.body.status
    };
    await NewsModel.updateOne({_id: id}, {$set: data});
    res.send({
        message: "mengubah data berhasil",
        data: data
    });
});

app.delete('/news', async (req, res) => {
    const id = req.query.id;
    await NewsModel.deleteOne({_id: id});
    res.send({
        message: "menghapus data berhasil"
    });
});

// tampilan
app.get('/fe_news', (req, res) => {
    res.render('tampilan');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});