const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const shortid = require('shortid');

const app = express();

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ 
        full: req.body.fullUrl, 
        text: req.body.text 
    }); // Creating a new short URL with the text field
    res.redirect('/'); // Redirect user back to index page
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl }); // Check if the short URL exists in the DB
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
