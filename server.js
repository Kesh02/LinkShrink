const express = require('express')
const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const shortid = require('shortid')

const app = express()

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl}) // creating a new short url
    res.redirect('/') //redirect user back to index page
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl}) //check if the short url exists in the db
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);