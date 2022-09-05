const express = require("express")
const app = express()

app.listen(5000, (req, res) => {
	console.log("running server")
})

const methodOverride = require("method-override")
app.use(methodOverride("_method"))

app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

const boardRouter = require("./routes/board.js")
app.use("/board", boardRouter)
app.use("/test", require("./routes/test.js"))