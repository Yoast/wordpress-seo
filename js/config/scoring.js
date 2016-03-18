/**
 *
 * @param {Jed} i18n
 * @constructor
 */
var AnalyzerScoring = function( i18n ) {
    this.analyzerScoring = [
        {
			scoreName: "keyphraseSizeCheck",
			scoreArray: [
				{
					max: 0,
					score: -999,
					text: i18n.dgettext( "js-text-analysis", "No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.")
				},
				{
					min: 11,
					score: 0,
					text: i18n.dgettext( "js-text-analysis", "Your keyphrase is over 10 words, a keyphrase should be shorter.")
				}
			]
		},
        {
            scoreName: "keywordDensity",
            scoreArray: [
                {
                    min: 3.5,
                    score: -50,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is way over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 2.51,
                    max: 3.49,
                    score: -10,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 0.5,
                    max: 2.50,
                    score: 9,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is great; the focus keyword was found %2$d times.")
                },
                {
                    min: 0,
                    max: 0.49,
                    score: 4,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is a bit low; the focus keyword was found %2$d times.")
                }
            ],
            replaceArray: [
                { name: "keywordDensity", position: "%1$f", source: "matcher" },
                { name: "keywordCount", position: "%2$d", sourceObj: ".refObj.__store.keywordCount" }
            ]
        },
        {
            scoreName: "metaDescriptionLength",
            metaMinLength: 120,
            metaMaxLength: 157,
            scoreArray: [
                {
                    max: 0,
                    score: 1,
                    text: i18n.dgettext( "js-text-analysis", "No meta description has been specified, search engines will display copy from the page instead.")
                },
                {
                    max: 120,
                    score: 6,

                    /* translators: %1$d expands to the minimum length for the meta description, %2$d to the maximum length for the meta description */
                    text: i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters, however up to %2$d characters are available.")
                },
                {
                    min: 157,
                    score: 6,

                    /* translators: %2$d expands to the maximum length for the meta description */
                    text: i18n.dgettext( "js-text-analysis", "The specified meta description is over %2$d characters. Reducing it will ensure the entire description is visible")
                },
                {
                    min: 120,
                    max: 157,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?")
                }
            ],
            replaceArray: [
                { name: "minCharacters", position: "%1$d", value: 120 },
                { name: "maxCharacters", position: "%2$d", value: 156 }
            ]
        },
        {
            scoreName: "metaDescriptionKeyword",
            scoreArray: [
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The meta description contains the focus keyword." ) },
                {
                    max: 0,
					min: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword." )
                }
            ]
        }, {
            scoreName: "firstParagraph",
            scoreArray: [
                {
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword doesn\'t appear in the first paragraph of the copy. Make sure the topic is clear immediately." )
                },
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the first paragraph of the copy." ) }
            ]
        }, {
            scoreName: "subHeadings",
            scoreArray: [
                { matcher: "count", max: 0, score: 7, text: i18n.dgettext( "js-text-analysis", "No subheading tags (like an H2) appear in the copy." ) },
                {
                    matcher: "matches",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "You have not used your focus keyword in any subheading (such as an H2) in your copy." )
                },
                {
                    matcher: "matches",
                    min: 1,
                    score: 9,

                    /* translators: %1$d expands to the number of subheadings, %2$d to the number of subheadings containing the focus keyword */
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. While not a major ranking factor, this is beneficial.")
                }
            ],
            replaceArray: [
                { name: "count", position: "%1$d", sourceObj: ".result.count" },
                { name: "matches", position: "%2$d", sourceObj: ".result.matches" }
            ]
        }, {
            scoreName: "pageTitleLength",
            scoreArray: [
                {max: 0, score: 1, text: i18n.dgettext( "js-text-analysis", "Please create a page title.")},
                {
                    max: 34,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %1$d to the minimum number of characters for the title */
                    text: i18n.dgettext( "js-text-analysis", "The page title contains %3$d characters, which is less than the recommended minimum of %1$d characters. Use the space to add keyword variations or create compelling call-to-action copy.")
                },
                {
                    min: 66,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %2$d to the maximum number of characters for the title */
                    text: i18n.dgettext( "js-text-analysis", "The page title contains %3$d characters, which is more than the viewable limit of %2$d characters; some words will not be visible to users in your listing.")
                },
                {
                    min: 35,
                    max: 65,
                    score: 9,

                    /* translators: %1$d expands to the minimum number of characters in the page title, %2$d to the maximum number of characters */
                    text: i18n.dgettext( "js-text-analysis", "The page title is between the %1$d character minimum and the recommended %2$d character maximum.")
                }
            ],
            replaceArray: [
                { name: "minLength", position: "%1$d", value: 35 },
                { name: "maxLength", position: "%2$d", value: 65 },
                { name: "length", position: "%3$d", source: "matcher" }
            ]
        }, {
            scoreName: "pageTitleKeyword",
            scoreTitleKeywordLimit: 0,
            scoreArray: [
                {
                    matcher: "matches",
                    max: 0,
                    score: 2,

                    /* translators: %1$s expands to the focus keyword */
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does not appear in the page title.")
                },
                {
                    matcher: "position",
                    max: 1,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, at the beginning which is considered to improve rankings.")
                },
                {
                    matcher: "position",
                    min: 1,
                    score: 6,
                    text: i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.")
                }
            ],
            replaceArray: [
                {name: "keyword", position: "%1$s", sourceObj: ".refObj.config.keyword"}
            ]
        }, {
            scoreName: "urlKeyword",
            scoreArray: [
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page.")},
                {
                    max: 0,
                    score: 6,
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" )
                }
            ]
        }, {
            scoreName: "urlLength",
            scoreArray: [
                {type: "urlTooLong", score: 5, text: i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." ) }
            ]
        },  {
            scoreName: "imageCount",
            scoreArray: [
                {
                    matcher: "total",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "No images appear in this page, consider adding some as appropriate." )
                },
                {
					matcher: "noAlt",
					min: 1,
					score: 5,
					text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt tags." )
				},
				{
					matcher: "altNaKeyword",
					min: 1,
					score: 5,
					text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt tags" )
				},
                {
                    matcher: "altKeyword",
                    min: 1,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt tags with the focus keyword." )
                },
                {
                    matcher: "alt",
                    min: 1,
                    score: 5,
                    text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt tags containing your focus keyword." )
                }
            ]
        }, {
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
