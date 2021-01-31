const express = require("express");
const app = express();
var https = require("https");
var fs = require("fs");
var path = require("path");

var privateCrt = fs.readFileSync(
  path.join(process.cwd(), "https/1_xn--jpr91eh7e3vaq32f.cn_bundle.crt"),
  "utf8"
);
var privateKey = fs.readFileSync(
  path.join(process.cwd(), "https/2_xn--jpr91eh7e3vaq32f.cn.key"),
  "utf8"
);
const HTTPS_OPTOIN = {
  key: privateKey,
  cert: privateCrt,
};

const SSL_PORT = 3001;
const httpsServer = https.createServer(HTTPS_OPTOIN, app);

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/questionnaire-test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Questionnaire = mongoose.model(
  "Questionnaire",
  new mongoose.Schema({
    name: String,
    address: String,
    school: String,
    class: String,
    desire: String,
    message: String,
    time: String,
  })
);

// Questionnaire.insertMany([
//   {
//     name: "Kar1ovo",
//     school: "ntu",
//     class: "rq182",
//     desire: "code",
//     message: "..???!/",
//   },
// ]);

//解决跨域
app.use(require("cors")());

app.use(express.json());

app.use("/", express.static("public"));

app.get("/questionnaires", async (req, res) => {
  const questionnaires = await Questionnaire.find();
  res.send(questionnaires);
});

app.get("/questionnaires/:id", async (req, res) => {
  const questionnaire = await Questionnaire.findById(req.params.id);
  res.send(questionnaire);
});

app.post("/questionnaires", async (req, res) => {
  const data = req.body;
  const questionnaire = Questionnaire.create(data);
  res.send((await questionnaire).toJSON());
});

app.put("/questionnaires/:id", async (req, res) => {
  const questionnaire = await Questionnaire.findById(req.params.id);
  questionnaire = req.body;
  await questionnaire.save();
  res.send(questionnaire);
});

app.delete("/questionnaires/:id", async (req, res) => {
  const questionnaire = await Questionnaire.findById(req.params.id);
  await questionnaire.remove();
  res.send({
    success: true,
  });
});

// app.listen(3001, () => {
//   console.log("http://localhost:3001");
//   console.log(new Date().toLocaleString());
// });

httpsServer.listen(SSL_PORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSL_PORT}`);
});
