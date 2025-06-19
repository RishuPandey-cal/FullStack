import express from "express"
import mongoose from "mongoose";
import cors   from "cors"

import userModel from "./user.model.js"

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect("mongodb://mongo:27017/db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/exit", (req, res) => {
  res.send("Shutting down server...");
  
    console.log("Server closed");
    process.exit(0); 
 
});

app.get("/get-names", async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users || []);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
  }
});

app.post("/add-names", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    }

    const newUser = new userModel({ name });
    await newUser.save();

    res.send("Successfully added user");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add user");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
