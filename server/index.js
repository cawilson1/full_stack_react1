const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = express.Router();

mongoose.connect(
  "mongodb+srv://user2:secretwow@cluster0-4nkhd.mongodb.net/todos?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

///mongo connection

//mongoose
//  .connect("mongodb://localhost:27017/todos", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//  })
// .catch(e => {
//   console.error("Connection error", e.message);
// });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const ZipSchema = new Schema(
  {
    zip: { type: Number, requred: true },
    temp: { type: Number, required: true }
  },
  { timestamps: true }
);

const Zip = mongoose.model('zips',ZipSchema)

createZip = (req, res) => {
  console.log("create a zip");
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a zip code"
    });
  }
  const zip = new Zip(body);
  if (!zip) {
    return res.status(400).json({ success: false, error: err });
  }

  zip
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: zip._id,
        message: "Zip Created!"
      });
    })
    .catch(error => {
      return res.status(400).json({
        error,
        message: "Zip not created"
      });
    });
};
getZipById = async (req, res) => {
  console.log("get a zip");
  await Zip.findOne({ _id: req.params.id }, (err, zip) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!zip) {
      return res.status(404).json({ success: false, error: `zip not found` });
    }
    return res
      .status(200)
      .json({ success: true, data: zip })
      .catch(err => console.log(err));
  });
};

getZips = async (req, res) => {
  console.log("get all zips");
  await Zip.find({}, (err, zips) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!zips.length) {
      return res.status(404).json({ success: false, error: `zip not found` });
    }
    try{
    return res
      .status(200)
      .json({ success: true, data: zips })
    }catch(err){
        console.log(err)
    }
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/zip", createZip);
app.get("/zip/:id", getZipById);
app.get("/zips", getZips);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
