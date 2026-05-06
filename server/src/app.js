const express = require("express");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation")
const bcrypt = require('bcrypt');

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {

     validateSignupData(req.body);
     const { firstname, lastname, emailId, password, age, gender, about } = req.body;

const passwordHash = await bcrypt.hash(password, 10);


    const user = new User({
                firstname,
                lastname,
                emailId,
                password:passwordHash,
                age,
                gender,
                about
            });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // ✅ Validate input
    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ Find user
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Login successful",
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/users/:id", async (req,res)=>{
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({message: "User Deleted"})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.patch("/users/:id", async (req, res)=>{
  const userId = req.params.id;
  const data = req.body;

const ALLOWED_UPDATES = [
   "photoURL",
          "about",
          "gender",
          "skills",
          "firstname",
          "lastname",
          "age"
];

const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
if(!isUpdateAllowed){
  throw new Error("update not allowed")
}
  try{
      const user = await User.findByIdAndUpdate(userId,data);
      console.log(user);
      res.send("User updated successfully") 

  }catch(error){
   res.status(400).send("something went wrong");
  }
})

connectDB()
  .then(() => {
    console.log("Db connection succesfull");
    app.listen(7777, () => {
      console.log("Server running on port 7777");
    });
  })
  .catch(() => {
    console.error("Database Connection fail");
  });
