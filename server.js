const express = require("express")
const app = express()

const MONGO_URI = "mongodb+srv://admin:qwer1234@cluster0.kiv0sog.mongodb.net/?retryWrites=true&w=majority"
let db

const mongoClient = require("mongodb").MongoClient
mongoClient.connect(MONGO_URI, (err, client) => {
	if (err) return console.log(err)

	db = client.db("nodeapp")

	app.listen(5000, (req, res) => {
		console.log("running server")
	})
})

app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get("/write", (req, res) => {
	res.sendFile(__dirname + "/write.html")
})

app.post("/ok", (req, res) => {
	db.collection("counter").findOne({
		name: "boardCounter"
	}, (err, result) => {
		let totalPost = result.totalPost
		let data = {
			_id: (totalPost + 1),
			...req.body
		}
		db.collection("board").insertOne(data, (err, result) => {
			if (err) return console.log(err)
			
			/**
			 * $inc: increase
			 */
			db.collection("counter").updateOne({name: "boardCounter"}, {$inc: {totalPost: 1}})
			res.redirect("/list")
		})
	})
})

app.get("/list", (req, res) => {
	db.collection("board").find().sort({"_id": -1}).toArray((err, result) => {
		/**
		 * if file in views auto render.
		 */
		res.render("list.ejs", {result: result})
	})
})

app.get("/detail/:id", (req, res) => {
	db.collection("board").findOne({"_id": parseInt(req.params.id)}, (err, result) => {
		res.render("detail.ejs", {result: result})
	})
})