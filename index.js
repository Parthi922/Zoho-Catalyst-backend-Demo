const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());

const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT||3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Display all Users
app.get("/users", (req, res) => {
  return res.json(users);
});

// Delete User Detail
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredUsers = users.filter((user) => user.id !== id);
  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing to file." });
    }
    return res.json(filteredUsers);
  });
});

// Add New User
app.post("/users", (req, res) => {
  const { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  const id = Date.now();
  const newUser = { id, name, age, city };
  users.push(newUser);

  fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing to file." });
    }
    return res.json(users);
  });
});

// Update User
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age, city } = req.body;

  if (!name || !age || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find the index of the user to update
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  // Update the user details
  users[index] = { ...users[index], name, age, city };

  fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing to file." });
    }
    return res.json({ message: "User details updated successfully.", users });
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
