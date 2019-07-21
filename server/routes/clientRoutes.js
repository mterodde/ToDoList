'use strict';

module.exports = function routes (app) {
  
    app.get('/', function (req, res) {
        var hompage = "/index.html";
        res.sendFile(hompage);
    });

}
