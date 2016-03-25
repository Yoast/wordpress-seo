/**
 *
 * @param {Jed} i18n
 * @constructor
 */
var AnalyzerScoring = function( i18n ) {
    this.analyzerScoring = [
        {
            scoreName: "keywordDoubles",
            scoreArray: [
                {matcher: "count", max: 0, score: 9, text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ) },
                {
                    matcher: "count",
                    max: 1,
                    score: 6,

                    /* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
                    text: i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword." )
                },
                {
                    matcher: "count",
                    min: 1,
                    score: 1,

                    /* translators: %3$s and $2$s expand to the admin search page for the focus keyword, %4$d expands to the number of times this focus keyword has been used before, %5$s and %6$s expand to a link to an article on yoast.com about cornerstone content */
                    text: i18n.dgettext( "js-text-analysis", "You've used this focus keyword %3$s%4$d times before%2$s, it's probably a good idea to read %6$sthis post on cornerstone content%5$s and improve your keyword strategy." )
                }
            ],
            replaceArray: [
                { name: "singleUrl", position: "%1$s", sourceObj: ".refObj.config.postUrl", rawOutput: true },
                { name: "endTag", position: "%2$s", value: "</a>" },
                { name: "multiUrl", position: "%3$s", sourceObj: ".refObj.config.searchUrl", rawOutput: true },
                { name: "occurrences", position: "%4$d", sourceObj: ".result.count" },
                { name: "endTag", position: "%5$s", value: "</a>" },
                {
                    name: "cornerstone",
                    position: "%6$s",
                    value: "<a href='https://yoast.com/cornerstone-content-rank/' target='new'>"
                },
                { name: "id", position: "{id}", sourceObj: ".result.id" },
                { name: "keyword", position: "{keyword}", sourceObj: ".refObj.config.keyword" }
            ]
        }
    ];
};

module.exports = {
    AnalyzerScoring: AnalyzerScoring,
    analyzerScoreRating: 9
};
