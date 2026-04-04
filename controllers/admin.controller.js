const { connectDB, ObjectId } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOrderEmail = require("../utils/sendOrderEmail");

const collection = async () => {
  const db = await connectDB();
  return db.collection("admins");
};

const createAdminUser = async (req, res) => {
  try {
    const adminCollection = await collection();
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const exists = await adminCollection.findOne({ email });
    if (exists) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await adminCollection.insertOne(newUser);

    const html = `
      <div style="background-color: #001B3D; padding: 30px; font-family: sans-serif; color: #fff;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; color: #333; padding: 25px; border-radius: 10px;">
          <h2 style="color: #0052CC; text-align: center;">Account Created</h2>
          <p>Hello <b>${name}</b>,</p>
          <p>Your account has been created on <b>TEKLIY</b>. Please wait for admin approval.</p>
          <div style="background: #f4f7fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Name:</b> ${name}</p>
            <p style="margin: 5px 0;"><b>Email:</b> ${email}</p>
            <p style="margin: 5px 0;"><b>Password:</b> ${password}</p>
            <p style="margin: 5px 0;"><b>Phone:</b> ${phone}</p>
          </div>
          <p style="font-size: 13px; color: #666; text-align: center;">Status: <b style="color: #e67e22;">Pending Approval</b></p>
        </div>
      </div>
    `;

    try {
      await sendOrderEmail({
        to: email,
        subject: "Account Information - TEKLIY",
        html,
      });
    } catch (err) {
      console.error(err.message);
    }

    res
      .status(201)
      .send({ message: "User created successfully", id: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to create user", error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const adminCollection = await collection();
    const { email, password } = req.body;

    const user = await adminCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .send({ message: "Your account is still pending or inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.send({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).send({ message: "Login failed", error: error.message });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const adminCollection = await collection();
    const id = req.params.id;
    const { status, role } = req.body;

    const result = await adminCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(status && { status }),
          ...(role && { role }),
          updatedAt: new Date(),
        },
      },
    );

    res.send({ message: "User updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Update failed", error: error.message });
  }
};

module.exports = { createAdminUser, adminLogin, updateAdminStatus };
