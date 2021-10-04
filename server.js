import express from 'express';
import fetch from 'node-fetch';
import cheerio from "cheerio";

const app = express()
 
const port = process.env.PORT || 8000;

app.use(express.json());

// ensuring https
if(process.env.NODE_ENV === 'production'){
    // force https 
    app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
    else
        next();
    });
}

// serving frontend files
app.use(express.static('static'));

// download end point
app.post('/download', async (req, res) => {

    const {url} = req.body;
    if(!url)
        return res.status(422).send();

    const regex = new RegExp("^(http|https)://(www.instagram|instagram)\.(com)*");

    if(!regex.test(url))
        return res.status(404).send();

    try {
        const response = await fetch(url);
        const body = await response.text();

        const $ = cheerio.load(body);
        const videoURL = $('meta[property="og:video"]').attr('content');

        res.send(videoURL);

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

app.listen(port, () => {
    console.log(`connection is running at port : ${port}`);
});

