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

    // Orders 
    const orderRoutes = require("./routes/order.routes")

    // Admin  Auth
    const adminRoutes = require('./routes/admin.routes.js');

    // Banner 
    const bannerRoutes = require('./routes/banner.routes');

    // Contact 
    const contactRoutes = require('./routes/contact.routes');


// API

    // category 
    app.use('/api/categories', categoryRoutes);

    // Products 
    app.use("/api/products" , productRoutes)

    // Orders 
    app.use("/api/orders" , orderRoutes)

    // Admin Auth 
    app.use('/api/admin', adminRoutes);

    // Banner 
    app.use('/api/banners', bannerRoutes);

    // Contact 
    app.use('/api/contacts', contactRoutes);




app.get("/", (req, res) => {
  res.send("E-commerce server running 🚀");
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});