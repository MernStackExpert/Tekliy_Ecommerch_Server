const { connectDB, ObjectId } = require("../config/db");

const collection = async () => {
  const db = await connectDB();
  return db.collection("contacts");
};

const submitInquiry = async (req, res) => {
  try {
    const contactCollection = await collection();
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    const newInquiry = {
      name,
      email,
      phone: phone || "",
      subject: subject || "No Subject",
      message,
      status: "unread",
      createdAt: new Date(),
    };

    const result = await contactCollection.insertOne(newInquiry);
    res.status(201).send({ message: "Inquiry submitted successfully", id: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Failed to submit inquiry", error: error.message });
  }
};

const getAllInquiries = async (req, res) => {
  try {
    const contactCollection = await collection();
    const inquiries = await contactCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(inquiries);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch inquiries", error: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const contactCollection = await collection();
    const id = req.params.id;

    const result = await contactCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "read", updatedAt: new Date() } }
    );

    res.send({ message: "Inquiry marked as read" });
  } catch (error) {
    res.status(500).send({ message: "Update failed", error: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const contactCollection = await collection();
    const id = req.params.id;

    const result = await contactCollection.deleteOne({ _id: new ObjectId(id) });
    res.send({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Delete failed", error: error.message });
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry
};