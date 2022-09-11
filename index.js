const fs = require('fs');
const http = require('http');
const url = require('url');


//Server
const replaceTemplate = (temp, prodcut) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, prodcut.productName);
    output = output.replace(/{%IMAGE%}/g, prodcut.image);
    output = output.replace(/{%PRICE%}/g, prodcut.price);
    output = output.replace(/{%FROM%}/g, prodcut.from);
    output = output.replace(/{%TYPE%}/g, prodcut.type);
    output = output.replace(/{%QUANTITY%}/g, prodcut.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, prodcut.description);
    output = output.replace(/{%ID%}/g, prodcut.id);

    if(!prodcut.promotion) output = output.replace(/{%NOT_PROMOTION%}/g, 'not-promotion');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    
    const pathName = req.url;

    // Overview
    if (pathName == '/' || pathName == '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml) ;
        res.end(output);

    
    // Product
    }else if (pathName == '/product') {
        res.end('This is the PRODUCT');

    // API
    }else if (pathName == '/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);  

    // Not found
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello-world'
        });
        res.end('<h1>Page not found</h1>');

    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})

