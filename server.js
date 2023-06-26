const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;
const app = express();

const { Schema } = mongoose;

const numberSchema = new Schema({
  value: Number,
});

const MyNumber = mongoose.model("Number", numberSchema);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/incrementNumbers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connection checking:
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.error("Error connecting to MongoDB:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
//send index file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//obtain query
app.get("/change", (req, res) => {
  const newValue = req.query.newValue;
  //find more recent change
  MyNumber.findOne()
    .sort({ createdAt: -1 })
    .exec()
    .then((number) => {
      if (number) {
        // update the existing document and save
        number.value = newValue;
        return number.save();
      } else {
        // no document found, create a new one
        const myNumber = new MyNumber({ value: newValue });
        return myNumber.save();
      }
    })
    .then(() => {
      console.log("Number saved");
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Error saving value:", error);
      res.status(500).json({
        success: false,
        error: "Failed to save value in the database",
      });
    });
});

app.get("/api/get-value", (req, res) => {
  MyNumber.findOne()
    .sort({ createdAt: -1 })
    .exec()
    .then((number) => {
      if (number) {
        res.json({ value: number.value });
      } else {
        res.json({ value: null });
      }
    })
    .catch((error) => {
      console.error("Error retrieving value:", error);
      res
        .status(500)
        .json({ error: "Failed to retrieve value from the database" });
    });
});

app.listen(port, () => {
  console.log("connection successful");
});
