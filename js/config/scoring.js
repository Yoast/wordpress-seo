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
        scoreArray: [
            {result: 0, operator: "==", score: 3, text: ""},
            {result: 0, operator: ">", score: 9, text: ""}
        ]
    }
];
