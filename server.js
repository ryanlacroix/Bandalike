var express = require('express');
var fs = require('fs');
var crawler = require('./lastfmCrawler.js');

var app = express();
var ROOT = './public';

app.use("*", function (req, res, next) {
    console.log(req.url);
    next();
});

app.get('/search/:bandName', function (req, res) {
    console.log('received request for search');
    console.log(req.params.bandName);
    crawler.getBands(req.params.bandName, 250, function (data) {
        console.log(data);
        res.send(data);
    });
});

app.use(express.static(ROOT));

app.get('/', function (req, res) {
    data = fs.readFileSync(ROOT + '/index.html');
    res.send(data);
})

app.listen(process.env.PORT || 2406);
console.log("Server listening for requests");