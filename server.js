// Dependencies
const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("./models/products")
const methodOverride = require("method-override");

//Connect to MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Database connection error/success
//Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongod not running?'))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Routes
app.get('/', (req, res) => {
	res.send("Welcome!")
});

// Seed
const productSeed = require('./models/productSeed.js');
app.get('/products/seed', (req, res) => {
	Product.deleteMany({}, (error, allProducts) => {})
	Product.create(productSeed, (error, data) => {
		res.redirect("/products")
	}); 
});

// Index
app.get('/products', (req, res) => {
	Product.find({}, (error, allProducts) => {
		res.render("index.ejs", {
			products: allProducts,
		});
	});
});

// Render page to create new product
app.get('/products/new', (req, res) => {
	res.render("new.ejs")
})	

//Delete
app.delete('/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, data) =>{
        res.redirect("/products")
    })
});

// Update
app.put("/products/:id", (req, res) => {
    Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        (error, updatedProduct) => {
            res.redirect(`/products/${req.params.id}`)
        });
});

//Create, post
app.post("/products", (req, res) => {
    Product.create(req.body, (error, createdProduct) => {
		res.redirect("/products")
    });
});

// Render page to edit existing product
app.get("/products/:id/edit", (req, res) => {
	Product.findById(req.params.id, (error, foundProduct) => {
		res.render('edit.ejs', {
			product: foundProduct,
		});
	});
});

//Show
app.get('/products/:id', (req, res) => {
	Product.findById(req.params.id, (error, foundProduct) => {
		res.render('show.ejs', {
			product: foundProduct,
		});
	});
});

app.get('/products/:id/buy', (req, res) => {
	// Using mongoose $inc operator to decrement by 1
	// https://www.mongodb.com/docs/manual/reference/operator/update/inc/
	Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { qty: -1 }},
        (error, updatedProduct) => {
            res.redirect(`/products/${req.params.id}`)
        });
});

// Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));