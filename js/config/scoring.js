analyzerScoring = [
    {
        scoreName: "wordCount",
        scoreArray: [
            {min: 300, score: 9, text: "There are %1$d words contained in the body copy, this is more than the %2$d word recommended minimum."},
            {min: 250, max: 299, score: 7, text: "There are %1$d words contained in the body copy, this is slightly below the %2$d word recommended minimum, add a bit more copy."},
            {min: 200, max: 249, score: 5, text: "There are %1$d words contained in the body copy, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers."},
            {min: 100, max: 199, score: -10, text: "There are %1$d words contained in the body copy, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers."},
            {min: 0, max: 99, score: -20, text: "There are %1$d words contained in the body copy. This is far too low and should be increased."}
        ],
        replaceArray: [
            {name: "wordCount",position: "%1$d",source: "matcher"},
            {name: "recommendedWordcount",position: "%2$d",value: 300}

        ]
    },
    {
        scoreName: "keywordDensity",
        scoreArray: [
            {min: 4.5, score: -50, text: "The keyword density is %1$f%, which is over the advised 4.5% maximum, the keyword was found %1$d times."},
            {min: 1, max: 4.49, score: 9, text: "The keyword density is %1$f%, which is great, the keyword was found %1$d times."},
            {min: 0, max: 0.99, score: 4, text: "The keyword density is %1$f%, which is a bit low, the keyword was found %1$d times."}
        ],
        replaceArray: [
            {name: "keywordDensity", position: "%1$f", source: "matcher"},
            {name: "keywordCount", position: "%1$d", sourceObj: ".refObj.__store.keywordCount"}
        ]
    },
    {
        scoreName: "linkCount",
        scoreArray: [
            {matcher: "total", min: 0, max: 0, score: 6, text: "No outbound links appear in this page, consider adding some as appropriate."},
            {matcher: "totalKeyword", min: 1, score: 2, text: "You\'re linking to another page with the keyword you want this page to rank for, consider changing that if you truly want this page to rank."},
            {type: "externalAllNofollow", score: 7, text: "This page has %2$s outbound link(s), all nofollowed."},
            {type: "externalHasNofollow", score: 8, text: "This page has %2$s nofollowed link(s) and %3$s normal outbound link(s)."},
            {type: "externalAllDofollow", score: 9, text: "This page has %1$s outbound link(s)."}
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
            {min: 50, max: 59.9, score: 6, text: "<%text%>", resultText: "fairly difficult", note: " Try to make shorter sentences to improve readability."},
            {min: 30, max: 49.9, score: 5, text: "<%text%>", resultText: "difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."},
            {min: 0, max: 29.9, score: 4, text: "<%text%>", resultText: "very difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."}
        ],
        replaceArray: [
            {name: "scoreText", position: "<%text%>", value: "The copy scores %1$s in the %2$s test, which is considered %3$s to read.%4$s"},
            {name: "text", position:"%1$s", sourceObj: ".result"},
            {name: "scoreUrl", position: "%2$s", value: "<a href='https://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease'>Flesch Reading Ease</a>"},
            {name: "resultText", position: "%3$s", scoreObj: "resultText"},
            {name: "note", position: "%4$s", scoreObj: "note"}
        ]
    },
    {
        scoreName: "metaDescriptionLength",
        metaMinLength: 120,
        metaMaxLength: 156,
        scoreArray: [
            {max: 0, score: 1, text: "No meta description has been specified, search engines will display copy from the page instead."},
            {max: 120, score: 6, text: "The meta description is under <%minCharacters%> characters, however up to <%maxCharacters%> characters are available."},
            {min: 156, score: 6, text: "The specified meta description is over <%maxCharacters%> characters, reducing it will ensure the entire description is visible"},
            {min: 120, max: 156, score: 9, text: "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?"}
        ]
    },
    {
        scoreName: "metaDescriptionKeyword",
        scoreArray: [
            {min: 1, score: 9, text: "The meta description contains the primary keyword / phrase."},
            {max: 0, score: 3, text: "A meta description has been specified, but it does not contain the target keyword / phrase."}
        ]
    },{
        scoreName: "firstParagraph",
        scoreArray: [
            {max: 0, score: 3, text: "The keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately."},
            {min: 1, score: 9, text: "The keyword appears in the first paragraph of the copy."}
        ]
    },{
        scoreName: "stopwordKeywordCount",
        scoreArray: [
            {matcher: "count", min: 1, score: 5, text: "The keyword for this page contains one or more <%url%>, consider removing them. Found \'<%stopwords%>\'."},
            {matcher: "count", max: 0, score: 0, text: ""}
        ],
        scoreUrl: "<a href='https://en.wikipedia.org/wiki/Stop_words'>stop words</a>"
    },{
        scoreName: "subHeadings",
        scoreArray: [
            {matcher: "count", max: 0, score: 7, text: "No subheading tags (like an H2) appear in the copy."},
            {matcher: "matches", max: 0, score: 3, text: "You have not used your keyword / keyphrase in any subheading (such as an H2) in your copy."},
            {matcher: "matches", min: 1, score: 9, text: "Keyword / keyphrase appears in <%matches%> (out of <%count%>) subheadings in the copy. While not a major ranking factor, this is beneficial."}
        ]
    },{
        scoreName: "pageTitleLength",
        scoreArray: [
            {max: 0, score: 1, text: "Please create a page title."},
            {max: 40, score: 6, text: "The page title contains <%length%> characters, which is less than the recommended minimum of <%minLength%> characters. Use the space to add keyword variations or create compelling call-to-action copy."},
            {min: 70, score: 6, text: "The page title contains <%length%> characters, which is more than the viewable limit of <%maxLength%> characters; some words will not be visible to users in your listing."},
            {min: 40, max: 70, score: 9, text: "The page title is more than <%minLenght%> characters and less than the recommended <%maxLength%> character limit."}
        ],
        scoreTitleMinLength: 40,
        scoreTitleMaxLength: 70
    },{
        scoreName: "pageTitleKeyword",
        scoreTitleKeywordLimit: 0,
        scoreArray:[
            {matcher: "matches", max: 0, score: 2, text: "The keyword / phrase '<%keyword%>' does not appear in the page title."},
            {matcher: "position", max: 1, score: 9, text: "The page title contains keyword / phrase, at the beginning which is considered to improve rankings."},
            {matcher: "position", min: 1, score: 6, text: "The page title contains keyword / phrase, but it does not appear at the beginning; try and move it to the beginning."}
        ]
    },{
        scoreName: "urlKeyword",
        scoreArray:[
            {min: 1, score: 9, text: "The keyword / phrase appears in the URL for this page."},
            {max: 0, score: 6, text: "The keyword / phrase does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!"}
        ]
    },{
        scoreName: "urlLength",
        scoreArray:[
            {type: "urlTooLong", score: 5, text: "The slug for this page is a bit long, consider shortening it."}
        ]
    },{
        scoreName: "urlStopwords",
        scoreArray:[
            {min: 1, score: 5, text: "The slug for this page contains one or more <a href='http://en.wikipedia.org/wiki/Stop_words'>stop words</a>, consider removing them."}
        ]
    },{
        scoreName: "imageCount",
        scoreArray:[
            {matcher: "total", max: 0, score: 3, text: "No images appear in this page, consider adding some as appropriate."},
            {matcher: "alt", max: 0, score: 5, text: "The images on this page are missing alt tags."},
            {matcher: "noAlt", min: 1, score: 5, text: "The images on this page do not have alt tags containing your keyword / phrase."},
            {matcher: "altKeyword", min: 1, score: 9, text: "The images on this page contain alt tags with the target keyword / phrase."}
        ]
    }
];

wordReplaceConfig = {
    obj: this
};