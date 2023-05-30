const app = require('express')(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cookieParser = require("cookie-parser"),
    secret = "somebody_once_told_me_the_world_is_gonna_roll_me...",
    axios = require('axios')

app.use(cookieParser())
app.use(bodyParser.json())

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.get('/document', async (req, res) => {
    const isDemo = req.query.isDemo === 'true'
    const isAuth = req.cookies.token === secret
    const isGoogle = req.headers['client-ip'] === '192.168.1.9'

    const paragraphsAmount = !isGoogle && isDemo && !isAuth ? 10 : 100
    const { data } = await axios.get(`https://baconipsum.com/api/?type=all-meat&paras=${paragraphsAmount}`)

    res.status(200).send(data)
})


app.post('/auth', (req, res) => {
    const { login, password } = req.body

    if (login === "456456456" && password === "456456456") {
        res.cookie("token", secret)
        res.sendStatus(200)
    } else {
        res.clearCookie("token")
        res.sendStatus(401)
    }
})

app.get('/test', (req, res) => {
    res.sendStatus(200)
})

app.listen(3080, () => {
    console.log(`BE listening http://localhost:3080`)
})