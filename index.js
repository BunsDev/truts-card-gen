const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const app = express()
const port = 5500
const router = express.Router();

// additional modules
const nodeHtmlToImage = require('node-html-to-image');
const axios = require('axios');
//json middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const rid = '627cd482e29d8400112fd0d4';

const generateHtml = (dao_name, description) => {
  let htmlTemplate = `<html>
    <head>
      <title>Parcel Sandbox</title>
      <meta charset="UTF-8" />
      <style>
        html {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        body {
          width: 800px;
          height: 418px;
        }
    
        * {
          box-sizing: border-box;
        }
    
        .con {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 800px;
          height: 418px;
          background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
        }
    
        .review-card {
          display: flex;
          width: 80%;
          height: 50%;
          background: white;
          border-radius: 15px;
          box-shadow: 0 0 15px rgba(128, 128, 128, 0.37);
          padding: 15px;
          flex-direction: column;
        }
    
        h1 {
          font-size: 20px;
        }
      </style>
    </head>
    <body>
      <div class="con">
        <div class="review-card">
          <h1>About ${dao_name}</h1>
          <p>
            ${description}
          </p>
        </div>
      </div>
    </body>
    </html>`

  return htmlTemplate
}


app.get(`/review-card`, async function (req, res) {
  try {
    // let rid = req.query.rid;
    let api_res = await axios.get(`https://7cjecbsr4a.us-west-2.awsapprunner.com/review/get-review-by-id?rid=${rid}`)
    let review = api_res.data;
    let review_text = (review.review_desc.length >= 400) ? review.review_desc.substring(0, 400) + '....' : review.review_desc
    let html_gen = generateHtml(review.dao_name, review_text);

    const image = await nodeHtmlToImage({
      html: html_gen
    });
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } catch (error) {
    console.log(error);
    res.status(404).send()
  }

});

app.get('/gen', async () => {
  try {
    let html_gen = generateHtml("testing", "testing");
    const image = await nodeHtmlToImage({
      html: html_gen
    });
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } catch (error) {
    console.log(error);
    res.status(404).send()
  }
})

app.get('/get-review', async (req, res) => {
  // let rid = req.query.rid;
  let api_res = await axios.get(`https://7cjecbsr4a.us-west-2.awsapprunner.com/review/get-review-by-id?rid=${rid}`)
  console.log(api_res)
  res.send(api_res.data)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})