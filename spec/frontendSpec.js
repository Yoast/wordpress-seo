require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
//require("../js/outputter.js");

var jsdom = require("jsdom");
jsdom.env("../html/score.html", ["../js/outputter.js"], function(errors, window){});
window = jsdom.jsdom().defaultView;
window.onModulesLoaded = function () {
    console.log ('modules loaded');
};
describe("a test to open a .html page for testing the frontend", function(){

});