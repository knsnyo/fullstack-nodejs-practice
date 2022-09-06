/** express server */
const express = require("express")
const app = express()

/** using put method */
const methodOverride = require("method-override")
app.use(methodOverride("_method"))

/** using ejs */
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

/** routers */
const boardRouter = require("./routers/board")
const galleryRouter = require("./routers/gallery")

app.use("/board", boardRouter)
app.use("/gallery", galleryRouter)

/** default */
app.listen(5000, (req, res) => {
	console.log("running server")
})

app.get("/", (req, res) => {
	res.render("index.ejs")
})