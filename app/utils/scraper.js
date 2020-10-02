const puppeteer = require('puppeteer');
const imageToBase64 = require('image-to-base64');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapeMedium = async ( data ) => {
    
    const htmlPath = `./public/html/${data.consignment_number}.html`;
    let $ = cheerio.load( data.label_html );
    let labelPaths = {};
    let labelStrings = [];

    fs.writeFile(htmlPath, data.label_html, ( err ) => {
        if (err) return console.log( err );
    });

    $('body').children('div').each(function(i, elem) {

        let filename = data.parcel_numbers[i];
        
        fs.writeFile( `./public/html/${filename}.html`, $(this).html(), ( err ) => {
            if ( err ) return console.log( err );
        });

        labelPaths[filename] = `./public/html/${filename}.html`;

    });
    
    for (const key in labelPaths) {

        const browser = await puppeteer.launch({
            executablePath: 'google-chrome-unstable'
        });
        
        const page = await browser.newPage();
        
        await page.goto( `http://localhost:3000/html/${key}.html` )
        .catch(function(e) {
            console.error(e);
        });

        await page.screenshot({
            path: `./public/images/${key}.jpeg`
        });

        await browser.close();
        
        const base64 = await imageToBase64( `./public/images/${key}.jpeg` );

        labelStrings.push({
            "parcel_number": key,
            "parcel_label": base64
        });

    }
    
    return {
        "data": {
            "consignment_number": data.consignment_number,
            "base64_images": labelStrings
        } 
    }
}

module.exports.scrapeMedium = scrapeMedium