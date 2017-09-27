var express = require('express');
var request = require('request');

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static('public'));
app.set('views', './src/views');

app.set('view engine', 'ejs');

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});

app.get('/', function (req, res) {
    res.render('index', { title: 'Hello from render', list: ['a', 'b'] });
});

app.get('/books', function (req, res) {
    res.send('Hello, Book');
});

// Format to 3 decimals
var formatter = function (number) {
    if (typeof (number) === 'number') {
        return parseFloat(Math.round(number * 100) / 100).toFixed(3);
    } else {
        return number;
    }
};

var printer = function (count, obj) {
    function n(n) {
        return n > 9 ? '' + n : '0' + n;
    }
    console.log(n(count) + ' ' + obj.companyName + ' ' + formatter(obj.dividendYield) + ' ' + formatter(obj.priceToBookRatio) + ' ' + formatter(obj.dividendYield / obj.priceToBookRatio));
};

app.get('/sf', function (req, res) {
    request.post(
        'https://sgx-premium.wealthmsi.com/sgx/search',
        { json: { criteria: [] } },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body.companies.sort(function (a, b) {
                    return (b.dividendYield / b.priceToBookRatio) - (a.dividendYield / a.priceToBookRatio);
                });
                var count = 0;
                (body.companies).forEach(function (obj) {
                    if (obj.dividendYield > 7) {
                        printer(++count, obj);
                    }
                });
                res.sendStatus(200);
            }
        }
    );
});