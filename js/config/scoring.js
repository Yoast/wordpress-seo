YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.analyzerScoreRating = 9;
/**
 *
 * @param {Jed} i18n
 * @constructor
 */
YoastSEO.AnalyzerScoring = function( i18n ) {
    this.analyzerScoring = [
        {
            scoreName: "wordCount",
            scoreArray: [
                {
                    min: 300,
                    score: 9,

                    /* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is more than the %2$d word recommended minimum.")
                },
                {
                    min: 250,
                    max: 299,
                    score: 7,

                    /* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is slightly below the %2$d word recommended minimum, add a bit more copy.")
                },
                {
                    min: 200,
                    max: 249,
                    score: 5,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 100,
                    max: 199,
                    score: -10,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 0,
                    max: 99,
                    score: -20,

                    /* translators: %1$d expands to the number of words in the text */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words. This is far too low and should be increased.")
                }
            ],
            replaceArray: [
                {name: "wordCount", position: "%1$d", source: "matcher"},
                {name: "recommendedWordcount", position: "%2$d", value: 300}

            ]
        },
        {
            scoreName: "keywordDensity",
            scoreArray: [
                {
                    min: 3.5,
                    score: -50,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is way over the advised 2.5% maximum, the focus keyword was found %2$d times.")
                },
                {
                    min: 2.5,
                    max: 3.49,
                    score: -10,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is over the advised 2.5% maximum, the focus keyword was found %2$d times.")
                },
                {
                    min: 0.5,
                    max: 2.49,
                    score: 9,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is great, the focus keyword was found %2$d times.")
                },
                {
                    min: 0,
                    max: 0.49,
                    score: 4,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is a bit low, the focus keyword was found %2$d times.")
                }
            ],
            replaceArray: [
                {name: "keywordDensity", position: "%1$f", source: "matcher"},
                {name: "keywordCount", position: "%2$d", sourceObj: ".refObj.__store.keywordCount"}
            ]
        },
        {
            scoreName: "linkCount",
            scoreArray: [
                {
                    matcher: "total",
                    min: 0,
                    max: 0,
                    score: 6,
                    text: i18n.dgettext('js-text-analysis', "No outbound links appear in this page, consider adding some as appropriate.")
                },
                {
                    matcher: "totalKeyword",
                    min: 1,
                    score: 2,
                    text: i18n.dgettext('js-text-analysis', "You\'re linking to another page with the focus keyword you want this page to rank for, consider changing that if you truly want this page to rank.")
                },

                /* translators: %2$s expands the number of outbound links */
                {type: "externalAllNofollow", score: 7, text: i18n.dgettext('js-text-analysis', "This page has %2$s outbound link(s), all nofollowed.")},
                {
                    type: "externalHasNofollow",
                    score: 8,

                    /* translators: %2$s expands to the number of nofollow links, %3$s to the number of outbound links */
                    text: i18n.dgettext('js-text-analysis', "This page has %2$s nofollowed link(s) and %3$s normal outbound link(s).")
                },

                /* translators: %1$s expands to the number of outbound links */
                {type: "externalAllDofollow", score: 9, text: i18n.dgettext('js-text-analysis', "This page has %1$s outbound link(s).")}
            ],
            replaceArray: [
                {name: "links", position: "%1$s", sourceObj: ".result.externalTotal"},
                {name: "nofollow", position: "%2$s", sourceObj: ".result.externalNofollow"},
                {name: "dofollow", position: "%3$s", sourceObj: ".result.externalDofollow"}
            ]
        },
        {
            scoreName: "fleschReading",
            scoreArray: [
                {min: 90, score: 9, text: "<%text%>", resultText: "very easy", note: ""},
                {min: 80, max: 89.9, score: 9, text: "<%text%>", resultText: "easy", note: ""},
                {min: 70, max: 79.9, score: 8, text: "<%text%>", resultText: "fairly easy", note: ""},
                {min: 60, max: 69.9, score: 7, text: "<%text%>", resultText: "ok", note: ""},
                {
                    min: 50,
                    max: 59.9,
                    score: 6,
                    text: "<%text%>",
                    resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences to improve readability.")
                },
                {
                    min: 30,
                    max: 49.9,
                    score: 5,
                    text: "<%text%>",
                    resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences, using less difficult words to improve readability.")
                },
                {
                    min: 0,
                    max: 29.9,
                    score: 4,
                    text: "<%text%>",
                    resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences, using less difficult words to improve readability.")
                }
            ],
            replaceArray: [
                {
                    name: "scoreText",
                    position: "<%text%>",

                    /* translators: %1$s expands to the numeric flesh reading ease score, %2$s to a link to the wikipedia article about Flesh ease reading score, %3$s to the easyness of reading, %4$s expands to a note about the flesh reading score. */
                    value: i18n.dgettext('js-text-analysis', "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s")
                },
                {name: "text", position: "%1$s", sourceObj: ".result"},
                {
                    name: "scoreUrl",
                    position: "%2$s",
                    value: "<a href='https://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease' target='new'>Flesch Reading Ease</a>"
                },
                {name: "resultText", position: "%3$s", scoreObj: "resultText"},
                {name: "note", position: "%4$s", scoreObj: "note"}
            ]
        },
        {
            scoreName: "metaDescriptionLength",
            metaMinLength: 120,
            metaMaxLength: 156,
            scoreArray: [
                {
                    max: 0,
                    score: 1,
                    text: i18n.dgettext('js-text-analysis', "No meta description has been specified, search engines will display copy from the page instead.")
                },
                {
                    max: 120,
                    score: 6,

                    /* translators: %1$d expands to the minimum length for the meta description, %2$d to the maximum length for the meta description */
                    text: i18n.dgettext('js-text-analysis', "The meta description is under %1$d characters, however up to %2$d characters are available.")
                },
                {
                    min: 156,
                    score: 6,

                    /* translators: %2$d expands to the maximum length for the meta description */
                    text: i18n.dgettext('js-text-analysis', "The specified meta description is over %2$d characters, reducing it will ensure the entire description is visible")
                },
                {
                    min: 120,
                    max: 156,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?")
                }
            ],
            replaceArray: [
                {name: "minCharacters", position: "%1$d", value: 120},
                {name: "maxCharacters", position: "%2$d", value: 156}
            ]
        },
        {
            scoreName: "metaDescriptionKeyword",
            scoreArray: [
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The meta description contains the focus keyword.")},
                {
                    max: 0,
					min: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "A meta description has been specified, but it does not contain the focus keyword.")
                }
            ]
        }, {
            scoreName: "firstParagraph",
            scoreArray: [
                {
                    max: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "The focus keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately.")
                },
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The focus keyword appears in the first paragraph of the copy.")}
            ]
        }, {
            scoreName: "stopwordKeywordCount",
            scoreArray: [
                {
                    matcher: "count",
                    min: 1,
                    score: 5,

                    /* translators: %1$s expands to a link to the wikipedia article about stop words, %2$s expands to the actual stop words found in the text */
                    text: i18n.dgettext('js-text-analysis', "The focus keyword for this page contains one or more %1$s, consider removing them. Found \'%2$s\'.")
                },
                {matcher: "count", max: 0, score: 0, text: ""}
            ],
            replaceArray: [
                {
                    name: "scoreUrl",
                    position: "%1$s",
                    value: i18n.dgettext( "js-text-analysis", "<a href='https://en.wikipedia.org/wiki/Stop_words' target='new'>stop words</a>" )
                },
                {name: "stopwords", position: "%2$s", sourceObj: ".result.matches"}
            ]
        }, {
            scoreName: "subHeadings",
            scoreArray: [
                {matcher: "count", max: 0, score: 7, text: i18n.dgettext('js-text-analysis', "No subheading tags (like an H2) appear in the copy.")},
                {
                    matcher: "matches",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "You have not used your focus keyword in any subheading (such as an H2) in your copy.")
                },
                {
                    matcher: "matches",
                    min: 1,
                    score: 9,

                    /* translators: %1$d expands to the number of subheadings, %2$d to the number of subheadings containing the focus keyword */
                    text: i18n.dgettext('js-text-analysis', "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. While not a major ranking factor, this is beneficial.")
                }
            ],
            replaceArray: [
                {name: "count", position: "%1$d", sourceObj: ".result.count"},
                {name: "matches", position: "%2$d", sourceObj: ".result.matches"}
            ]
        }, {
            scoreName: "pageTitleLength",
            scoreArray: [
                {max: 0, score: 1, text: i18n.dgettext('js-text-analysis', "Please create a page title.")},
                {
                    max: 40,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %1$d to the minimum number of characters for the title */
                    text: i18n.dgettext('js-text-analysis', "The page title contains %3$d characters, which is less than the recommended minimum of %1$d characters. Use the space to add keyword variations or create compelling call-to-action copy.")
                },
                {
                    min: 70,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %2$d to the maximum number of characters for the title */
                    text: i18n.dgettext('js-text-analysis', "The page title contains %3$d characters, which is more than the viewable limit of %2$d characters; some words will not be visible to users in your listing.")
                },
                {
                    min: 40,
                    max: 70,
                    score: 9,

                    /* translators: %1$d expands to the minimum number of characters in the page title, %2$d to the minimum number of characters */
                    text: i18n.dgettext('js-text-analysis', "The page title is more than %1$d characters and less than the recommended %2$d character limit.")
                }
            ],
            replaceArray: [
                {name: "minLength", position: "%1$d", value: 40},
                {name: "maxLength", position: "%2$d", value: 70},
                {name: "length", position: "%3$d", source: "matcher"}
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
                    text: i18n.dgettext('js-text-analysis', "The focus keyword '%1$s' does not appear in the page title.")
                },
                {
                    matcher: "position",
                    max: 1,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "The page title contains the focus keyword, at the beginning which is considered to improve rankings.")
                },
                {
                    matcher: "position",
                    min: 1,
                    score: 6,
                    text: i18n.dgettext('js-text-analysis', "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.")
                }
            ],
            replaceArray: [
                {name: "keyword", position: "%1$s", sourceObj: ".refObj.config.keyword"}
            ]
        }, {
            scoreName: "urlKeyword",
            scoreArray: [
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The focus keyword appears in the URL for this page.")},
                {
                    max: 0,
                    score: 6,
                    text: i18n.dgettext('js-text-analysis', "The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!")
                }
            ]
        }, {
            scoreName: "urlLength",
            scoreArray: [
                {type: "urlTooLong", score: 5, text: i18n.dgettext('js-text-analysis', "The slug for this page is a bit long, consider shortening it.")}
            ]
        }, {
            scoreName: "urlStopwords",
            scoreArray: [
                {
                    min: 1,
                    score: 5,
                    text: i18n.dgettext('js-text-analysis', "The slug for this page contains one or more <a href='http://en.wikipedia.org/wiki/Stop_words' target='new'>stop words</a>, consider removing them.")
                }
            ]
        }, {
            scoreName: "imageCount",
            scoreArray: [
                {
                    matcher: "total",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "No images appear in this page, consider adding some as appropriate.")
                },
                {matcher: "noAlt", min: 1, score: 5, text: i18n.dgettext('js-text-analysis', "The images on this page are missing alt tags.")},
                {
                    matcher: "alt",
                    min: 1,
                    score: 5,
                    text: i18n.dgettext('js-text-analysis', "The images on this page do not have alt tags containing your focus keyword.")
                },
                {
                    matcher: "altKeyword",
                    min: 1,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "The images on this page contain alt tags with the focus keyword.")
                }
            ]
        }, {
            scoreName: "keywordDoubles",
            scoreArray: [
                {matcher: "count", max: 0, score: 9, text: i18n.dgettext('js-text-analysis', "You've never used this focus keyword before, very good.")},
                {
                    matcher: "count",
                    max: 1,
                    score: 6,

                    /* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
                    text: i18n.dgettext('js-text-analysis', "You've used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword.")
                },
                {
                    matcher: "count",
                    min: 1,
                    score: 1,

                    /* translators: %3$s and $2$s expand to the admin search page for the focus keyword, %4$d expands to the number of times this focus keyword has been used before, %5$s and %6$s expand to a link to an article on yoast.com about cornerstone content */
                    text: i18n.dgettext('js-text-analysis', "You've used this focus keyword %3$s%4$d times before%2$s, it's probably a good idea to read %6$sthis post on cornerstone content%5$s and improve your keyword strategy.")
                }
            ],
            replaceArray: [
                {name: "singleUrl", position: "%1$s", sourceObj: ".refObj.config.postUrl"},
                {name: "endTag", position: "%2$s", value: "</a>"},
                {name: "multiUrl", position: "%3$s", sourceObj: ".refObj.config.searchUrl"},
                {name: "occurrences", position: "%4$d", sourceObj: ".result.count"},
                {name: "endTag", position: "%5$s", value: "</a>"},
                {
                    name: "cornerstone",
                    position: "%6$s",
                    value: "<a href='https://yoast.com/cornerstone-content-rank/' target='new'>"
                },
                {name: "id", position: "{id}", sourceObj: ".result.id"},
                {name: "keyword", position: "{keyword}", sourceObj: ".refObj.config.keyword"}
            ]
        }
    ];
}
