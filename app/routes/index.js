var express = require('express');
var router = express.Router();
const scraper = require('../utils/scraper');

router.use(express.static('public'))

router.get('/', function(req, res, next) {
  res.send("Welcome! Go to /generate-image");
});

router.get('/generate-image', function(req, res, next) {
  console.log(req.body);
  res.json({ 
    "request": {
      "consignment_number": "545335962",
      "label_html": "http://localhost:8000/labels/html/545335962.html",
    },
    "response": {
      "success": {
        "data": {
          "consignment_number": "545335962",
          "base64_images": { 
            "parcel_number": "15501687827922",
            "parcel_label": "<Base64 string>" 
          },
        }
      },
      "failure": {
        "error": {
          "message": "Error response object"
        }
      }
    } 
  });
});

router.post('/generate-image', function(req, res, next) {

  const mediumArticles = new Promise((resolve, reject) => {
    
    scraper
      .scrapeMedium( req.body )
      .then(data => {
        
        resolve(data)

      })
      .catch(err => reject(err))

  })

  Promise.resolve( mediumArticles )
  .then(data => {
    
    res.json( data );

  })
  .catch(err => res.status(422).json({ 
    "error": { 
      "message":  err > 0 ? err : "No data"
    }
  })
  )

});

module.exports = router;