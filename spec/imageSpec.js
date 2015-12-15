require("./helpers/i18n.js");
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var imgArgs = {
    text: "Lorem ipsum dolor sit amet, <a href='http://yoast.com'>consectetur</a> adipiscing elit. <a href='http://google.com'>urabitur aliquet</a> vel ipsum non feugiat. Aenean purus turpis, rhoncus a vestibulum at, ornare et enim. <img src='http://domein.tld/plaatje.jpg' alt='Donec' /> et imperdiet sem. Mauris in efficitur odio, sit amet aliquam eros. <a href='ftp://Morbi.com'>suscipit</a>, leo tincidunt malesuada rhoncus, odio sem ornare erat, sed aliquet magna odio sed lectus. Quisque tempus iaculis enim, in dignissim diam elementum sit amet. Proin elit augue, varius sed diam sed, iaculis varius risus. Morbi fringilla eleifend gravida.Integer nec magna ex. <a href='http://Suspendisse.nl' target='blank'>ornare</a> ultrices tellus, sit amet consequat libero faucibus a. <img src='http://Lorem.jpg' /> ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt, orci eu lacinia maximus, ex arcu ultricies turpis, elementum feugiat est neque eget risus. Nam pulvinar sagittis arcu vitae <a href='http://yoast.com' rel='nofollow'>iaculis.</a> In leo augue, congue sit amet molestie eget, aliquet vitae tellus. Suspendisse at nisl a velit eleifend posuere. Nulla vulputate, lorem sit amet facilisis condimentum, eros orci vulputate urna, vitae ullamcorper elit velit et lectus. <img src='http://' alt='' />Sed accumsan magna et ultrices tempor. Vivamus euismod mi <a href='http://example.com' rel='nofollow'>sed</a> nunc semper dapibus.",
    queue: ["imageCount"],
    keyword: "keyword"
};

describe("a test to extract the images from a given textstring", function(){
   it("returns the number of images found in the textstring", function(){
       imageAnalyzer = Factory.buildAnalyzer(imgArgs);
       var result = imageAnalyzer.imageCount();
       expect(result[0].result.total).toBe(3);
       expect(result[0].result.alt).toBe(1);
       expect(result[0].result.noAlt).toBe(2);

   });
});
