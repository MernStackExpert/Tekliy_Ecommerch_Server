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

const addCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryCollection = await collection();
    
    const newCategory = {
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      icon: icon || null,
      createdAt: new Date()
    };

    const result = await categoryCollection.insertOne(newCategory);
    res.status(201).json({ 
      message: "Category added successfully", 
      insertedId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

module.exports = { getCategories, addCategory };