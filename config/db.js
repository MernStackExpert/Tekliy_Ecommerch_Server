const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbConnection;

module.exports = {
  connectToDb: async () => {
    try {
      await client.connect();
    
      dbConnection = client.db("tekliy_ecommerch_db"); 
      console.log("Successfully connected to MongoDB!");
    } catch (err) {
      console.error("MongoDB Connection Error:", err);
      process.exit(1);
    }
  },
  getDb: () => dbConnection,
};