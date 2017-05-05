var express = require('express');
var fs = require('fs');

var app = express();
var ROOT = './public';

app.use("*", function (req, res, next) {
    console.log(req.url);
    next();
});

app.use(express.static(ROOT));

app.get('/', function (req, res) {
    data = fs.readFileSync(ROOT + '/index.html');
    res.end(data);
})

app.listen(2406);
console.log("Server listening on port 2406");