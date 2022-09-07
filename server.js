// Dependencies
const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const Store = require("./models/products")
const Seed = require("./models/storeSeed")

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

//Middleware, body parser
app.use(express.urlencoded({ extended: true }))

// // Seed
// app.get('/products/seed', (req, res) => {
// 	Product.deleteMany({}, (error, allProducts) => {})
// 	Product.create(storeSeed, (error, data) => {
// 		res.redirect("/products")
// 	})
// })

//Index
app.get('/products', (req, res) => {
	Product.find({}, (error, allProducts) => {
		res.render("index.ejs", {
			Product: allProducts,
		});
	});
});

//New
app.get('/products/new', (req, res) => {
	res.render("new.ejs")
})	

//Delete


//Update
app.put("products/:id", (res, req) => {
	product.findById(req.params.id, (error, foundProduct) => {
		res.send(updatedProduct)
	})
})

//Create
app.post("/products", (req, res) => {
    Product.create(req.body, (error, createdProduct) => {
        res.redirect("/products")
    });
})

// //Edit
// app.get("products/:id/edit", (req, res) => {
// 	res.render("edit.ejs")
// })

//Show
app.get('/products/:id', (req, res) => {
	Product.findById(req.params.id, (error, foundProduct) => {
		res.render('show.ejs', {
			product: foundProduct,
		})
	})
})

// Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));