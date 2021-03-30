const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2g0i6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000 // react by default 3000 diye start kore tai server er port number change korte hobe

// console.log(process.env.DB_USER);

//middleware
app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  // perform actions on the collection object
  console.log('MongoDB Database Connected...........');

  // post use hoy database e create data er jonno
  app.post('/addProduct',(req, res)=>{ // post e (api name, callback function dite hoy)
    const products = req.body; // client side theke data niye mongoDB te pathabo
    console.log(products);
    productsCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
  })

// to load/read all products
  app.get('/products', (req, res)=>{ // ai url e data gulo load hobe
      productsCollection.find({})
      .toArray((err, documents) => {
          //console.log({req});
          res.send(documents);
      })
  })


  // to load/read single product
  app.get('/product/:key', (req, res)=>{ // ai url e data gulo load hobe
    productsCollection.find({key:req.params.key})
    .toArray((err, documents) => {
        //console.log({req});
        res.send(documents[0]); // single item er jonno array er 1st element pathabo
    })
})

 app.post('/productsByKeys', (req, res)=>{
   const productKeys = req.body;
   productsCollection.find({key: {$in: productKeys}})
   .toArray((err, documents) => {
     res.send(documents);
   })
 })


  //client.close();
});


app.get('/', (req, res) => {
  res.send('Server Connected................')
})

app.listen(port);