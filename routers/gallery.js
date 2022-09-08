/** gallery router */
const router = require("express").Router()

/** multipart/form-data */
const multer = require("multer")
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/image")
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "_" +file.originalname)
	}
})
const upload = multer({storage: storage})

/** mongoDB */
const MONGO_URI = "mongodb+srv://admin:qwer1234@cluster0.kiv0sog.mongodb.net/?retryWrites=true&w=majority"
let db
const mongoClient = require("mongodb").MongoClient
mongoClient.connect(MONGO_URI, (err, client) => {
	if (err) return console.log(err)

	db = client.db("nodeapp")
})

/** render */
router.get("/", (req, res) => {
	res.redirect("/gallery/list")
})

router.get("/list", (req, res) => {
	db.collection("photo").find().sort({"_id": -1}).toArray((err, result) => {
		res.render("./gallery/list.ejs", {result: result})
	})
})

router.get("/write", (req, res) => {
	res.render("./gallery/write.ejs")
})

/** action */
router.post("/write", upload.single("file"), (req, res) => {
	db.collection("counter").findOne({
		name: "photoCounter"
	}, (err, result) => {
		let totalPost = result.totalPost
		let now = new Date().toLocaleString()
		let data = {
			_id: (totalPost + 1),
			...req.body,
			file: req.file.filename,
			date: now,
		}
		db.collection("photo").insertOne(data, (err, result) => {
			if (err) return console.log(err)

			db.collection("counter").updateOne({name: "photoCounter"}, {$inc: {totalPost: 1}})
			res.redirect("/gallery/list")
		})
	})
})

router.get("/delete/:id", (req, res) => {
	db.collection("photo").deleteOne({"_id": parseInt(req.params.id)}, (err, result) => {
		if (err) return console.log(err)

		res.redirect("/gallery/list")
	})
})

module.exports = router