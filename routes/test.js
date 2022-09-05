const router = require("express").Router()

router.get("/", (req, res) => {
	res.send("test")
})

router.get("/test1", (req, res) => {
	res.render("./test/1.ejs")
})

router.get("/test2", (req, res) => {
	res.render("./test/2.ejs")
})

module.exports = router