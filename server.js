var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var schedule = require('node-schedule');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

(function() {

    // Step 1: Create & configure a webpack compiler
    var webpack = require('webpack');
    var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
    var compiler = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
})();


var configFile = require('./config.json');

function weatherComponent(callback) {
    var data = [];
    var city = ["turku", "helsinki", "sotkamo/vuokatti", "kolari"];
    var dayNum = configFile.checkingPeriod;
    var info;
    var itemsProcessed = 0;


    city.forEach(function (element, index, array) {
        var temp = {"city": element, "temperature": []};

        request('https://ilmatieteenlaitos.fi/saa/' + element + '?forecast=daily', function (error, response, body) {
            if (error)
                return callback(error || {statusCode: response.statusCode});

            if (body) {

                var $ = cheerio.load(body);


                for (var x = 0; x < dayNum; x++) {


                    var value = $('.local-weather-forecast-day-menu-item .day-' + x).text();

                    // console.log(value);

                    var weekday = value.match(/[a-z]/g);
                    var celcius = value.match(/[-0-9]/g);

                    if (celcius !== null && weekday !== null) {
                        weekday = weekday.join("");
                        celcius = celcius.join("");

                        //  console.log(weekday);
                        //  console.log(celcius);

                        if (celcius < 0) {
                            info = "DANGER";
                        } else {
                            info = "Ok";
                        }

                        temp.temperature.push({"day": weekday, "celcius": celcius, "status": info});


                    } else {
                        var errorText = "no weatherforecast for this location";
                        temp.temperature.push(errorText);

                    }

                }
                itemsProcessed++;
                data.push(temp);

                if (itemsProcessed === array.length) {
                    return callback(data, false);
                }
            }
        });
    });
}


app.get("/weatherByCity", function (req, res) {
    weatherComponent(function (err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

//update logs every minute
setInterval(function() {
    console.log("here we go again");
    weatherComponent(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(util.inspect(data, {showHidden: false, depth: null}));
        }
    });
}, 60 * 1000); // 60 * 1000 milsec


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;