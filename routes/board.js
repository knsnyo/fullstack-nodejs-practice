const router = require("express").Router()

const MONGO_URI = "mongodb+srv://admin:qwer1234@cluster0.kiv0sog.mongodb.net/?retryWrites=true&w=majority"
let db

const mongoClient = require("mongodb").MongoClient
mongoClient.connect(MONGO_URI, (err, client) => {
	if (err) return console.log(err)

	db = client.db("nodeapp")
})

router.get("/", (req, res) => {
	res.redirect("/board/list")
})

router.get("/write", (req, res) => {
	res.render("./board/write.ejs")
})

router.post("/write", (req, res) => {
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
			res.redirect("/board/list")
		})
	})
})

router.get("/list", (req, res) => {
	db.collection("board").find().sort({"_id": -1}).toArray((err, result) => {
		/**
		 * if file in views auto render.
		 */
		res.render("./board/list.ejs", {result: result})
	})
})

router.get("/detail/:id", (req, res) => {
	db.collection("board").findOne({"_id": parseInt(req.params.id)}, (err, result) => {
		res.render("./board/detail.ejs", {result: result})
	})
})

router.get("/edit/:id", (req, res) => {
	db.collection("board").findOne({
		"_id": parseInt(req.params.id)
	}, (err, result) => {
		res.render("./board/edit.ejs", {result: result})
	})
})

router.put("/edit", (req, res) => {
	/**
	 * $set: { updated_data }
	 */
	db.collection("board").updateOne({"_id": parseInt(req.body.id)}, {$set: {
		title: req.body.title,
		name: req.body.name, 
		description: req.body.description,
		reservation: req.body.reservation,
	}}, (err, result) => {
		res.redirect("/board/list")
	})
})

module.exports = router