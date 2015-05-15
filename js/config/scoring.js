analyzerScoring = [
    {
        scoreName: "wordCount",
        scoreFunction: "wordCountScore",
        scoreArray: [
            {result: 300, score: 9, text: ""},
            {result: 250, score: 7, text: ""},
            {result: 200, score: 5, text: ""},
            {result: 100, score: -10, text: ""},
            {result: 0, score: -20, text: ""}
        ]
    },
    {
        scoreName: "keywordDensity",
        scoreFunction: "keywordDensityScore",
        scoreObj: {
            min: {
                result: 1,
                score: 4,
                text: "The keyword density is <%keywordDensity%>%, which is a bit low, the keyword was found <%keywordCount%> times."
            },
            max: {
                result: 4.5,
                score: -50,
                text: "The keyword density is <%keywordDensity%>%, which is over the advised 4.5% maximum, the keyword was found <%keywordCount%> times."
            },
            default: {
                result: 0,
                score: 9,
                text: "The keyword density is <%keywordDensity%>%, which is great, the keyword was found <%keywordCount%> times."
            }
        }
    },
    {
        scoreName: "fleschReading",
        scoreFunction: "fleschReadingScore",
        scoreText: "The copy scores <%testResult%> in the <%scoreUrl%> test, which is considered <%scoreText%> to read.<%note%>",
        scoreUrl: "<a href='http://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease'>Flesch Reading Ease</a>",
        scoreArray: [
            {result: 90, score: 9, text: "very easy", note: ""},
            {result: 80, score: 9, text: "easy", note: ""},
            {result: 70, score: 8, text: "fairly easy", note: ""},
            {result: 60, score: 7, text: "ok", note: ""},
            {result: 50, score: 6, text: "fairly difficult", note: " Try to make shorter sentences to improve readability."},
            {result: 30, score: 5, text: "difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."},
            {result: 0, score: 4, text: "very difficult", note: " Try to make shorter sentences, using less difficult words to improve readability."}
        ]
    },
    {
        scoreName: "firstParagraph",
        scoreFunction:  "firstParagraphScore",
        scoreObj: {
            none: {result: 0, score: 3, text: "The keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately."},
            some: {result: 1, score: 9, text: "The keyword appears in the first paragraph of the copy."}
        }
    },
    {
        scoreName: "metaDescriptionLength",
        scoreFunction: "metaDescriptionLengthScore",
        metaMinLength: 120,
        metaMaxLength: 156,
        scoreObj: {
            none: {result: 0, score: 1, text: "No meta description has been specified, search engines will display copy from the page instead."},
            min: { result: 120, score: 6, text: "The meta description is under <%minCharacters%> characters, however up to <%maxCharacters%> characters are available."},
            max: { result: 156, score: 6, text: "The specified meta description is over <%maxCharacters%> characters, reducing it will ensure the entire description is visible"},
            default: { score: 9, text: "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?"}
        }
    },
    {
        scoreName: "metaDescriptionKeyword",
        scoreFunction: "metaDescriptionKeywordScore",
        scoreArray: [
            {result: 1, score: 9, text: "The meta description contains the primary keyword / phrase."},
            {result: 0, score: 3, text: "A meta description has been specified, but it does not contain the target keyword / phrase."}
        ]
    },
    {
        scoreName: "stopwordKeywordCount",
        scoreFunction: "stopwordKeywordCountScore",
        scoreArray: [
            {result: 1, score: 5, text: "The keyword for this page contains one or more <%url%>, consider removing them. Found \'<%stopwords%>\'."},
            {result: 0, score: 0, text: ""}
        ],
        scoreUrl: "<a href='http://en.wikipedia.org/wiki/Stop_words'>stop words</a>"
    },
    {
        scoreName: "subHeadings",
        scoreFunction: "subHeadingsScore",
        scoreObj: {
            noHeadings: {matches: 0, count: 0, score: 7, text: "No subheading tags (like an H2) appear in the copy."},
            headingsNoKeyword: {matches: 0, count: 1, score: 3, text: "You have not used your keyword / keyphrase in any subheading (such as an H2) in your copy."},
            headingsKeyword: {matches: 1, count: 1, score: 9, text: "Keyword / keyphrase appears in <%matches%> (out of <%count%>) subheadings in the copy. While not a major ranking factor, this is beneficial."}
        }
    },
    {
        scoreName: "pageTitleLength",
        scoreFunction: "pageTitleLengthScore",
        scoreObj: {
            noTitle: {result: 0, score: 1, text: "Please create a page title."},
            titleTooShort: {
                score: 6,
                text: "The page title contains <%length%> characters, which is less than the recommended minimum of <%minLength%> characters. Use the space to add keyword variations or create compelling call-to-action copy."
            },
            titleTooLong: {
                score: 6,
                text: "The page title contains <%length%> characters, which is more than the viewable limit of <%maxLength%> characters; some words will not be visible to users in your listing."
            },
            titleCorrectLength: {
                score: 9,
                text: "The page title is more than <%minLenght%> characters and less than the recommended <%maxLength%> character limit."

            },
            scoreTitleMinLength: 40,
            scoreTitleMaxLength: 70
        }
    },
    {
        scoreName: "pageTitleKeyword",
        scoreFunction: "pageTitleKeywordScore",
        scoreTitleKeywordLimit: 0,
        scoreObj:{
            keywordMissing: {result: 0, score: 2, text: "The keyword / phrase '<%keyword%>' does not appear in the page title."},
            keywordBegin: {result: 1, score: 9, text: "The page title contains keyword / phrase, at the beginning which is considered to improve rankings."},
            keywordEnd: {result: 1, score: 6, text: "The page title contains keyword / phrase, but it does not appear at the beginning; try and move it to the beginning."}
        }
    },
    {
        scoreName: "urlKeyword",
        scoreFunction: "urlKeywordScore",
        scoreObj:{
            urlGood: {result: 1, score: 9, text: "The keyword / phrase appears in the URL for this page."},
            urlMedium: {result: 0, score: 6, text: "The keyword / phrase does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!"}
        }
    },
    {
        scoreName: "urlLength",
        scoreFunction: "urlLengthScore",
        maxLength: 40,
        slugLength: 20,
        scoreObj:{
            longSlug: {score: 5, text: "The slug for this page is a bit long, consider shortening it."}
        }
    },
    {
        scoreName: "urlStopwords",
        scoreFunction: "urlStopwordsScore",
        scoreObj:{
            stopwords: {result: 1, score: 5, text: "The slug for this page contains one or more <a href='http://en.wikipedia.org/wiki/Stop_words'>stop words</a>, consider removing them."}
        }
    },
    {
        scoreName: "imageCount",
        scoreFunction: "imageCountScore",
        scoreObj:{
            noImages: {result: 0, score: 3, text: "No images appear in this page, consider adding some as appropriate."},
            noAlt: {result: 1, score: 5, text: "The images on this page are missing alt tags."},
            altNoKeyword: {result: 1, score: 5, text: "The images on this page do not have alt tags containing your keyword / phrase."},
            altKeyword: {result: 1, score: 9, text: "The images on this page contain alt tags with the target keyword / phrase."}
        }
    },
    {
        scoreName: "linkCount",
        scoreFunction: "linkCountScore",
        scoreObj:{
            noLinks: {result: 0, score: 6, text: "No outbound links appear in this page, consider adding some as appropriate."},
            keywordOutboundLink: {result: 1, score: 2, text: "You\'re linking to another page with the keyword you want this page to rank for, consider changing that if you truly want this page to rank."},
            linksFollow: {result: 1, score: 9, text: "This page has <%links%> outbound link(s)."},
            linksNoFollow: {result: 1, score: 7, text: "This page has <%links%> outbound link(s), all nofollowed."},
            links: {result: 1, score: 8, text: "This page has <%nofollow%> nofollowed link(s) and <%dofollow%> normal outbound link(s)."}
        }
    }
];