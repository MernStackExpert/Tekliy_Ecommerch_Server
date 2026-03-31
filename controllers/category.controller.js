const { connectDB } = require("../config/db");

const collection = async () => {
  const db = await connectDB();
  return db.collection("categories");
};

const getCategories = async (req, res) => {
  try {
    const categoryCollection = await collection();
    const categories = await categoryCollection.find().toArray();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

module.exports = { getCategories };