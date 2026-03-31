const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDb } = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// routes import 

    // category 
    const categoryRoutes = require('./routes/category.routes');

    // Products
    const productRoutes = require("./routes/product.routes");


// API

    // category 
    app.use('/api/categories', categoryRoutes);

    // Products 
    app.use("/api/products" , productRoutes)




app.get("/", (req, res) => {
  res.send("E-commerce server running 🚀");
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});