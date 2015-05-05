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
                text: "The keyword density is %s%%, which is a bit low, the keyword was found %s times."
            },
            max: {
                result: 4.5,
                score: -50,
                text: "The keyword density is %s%%, which is over the advised 4.5%% maximum, the keyword was found %s times."
            },
            default: {
                result: 0,
                score: 9,
                text: "The keyword density is %s%%, which is great, the keyword was found %s times."
            }
        }
    },
    {
        scoreName: "fleschReading",
        scoreFunction: "fleschReadingScore",
        scoreArray: [
            {result: 90, operator: ">=", score: 9, text: "very easy"},
            {result: 80, operator: ">=",  score: 9, text: "easy"},
            {result: 70, operator: ">=",  score: 8, text: "fairly easy"},
            {result: 60, operator: ">=",  score: 7, text: "ok"},
            {result: 50, operator: ">=",  score: 6, text: "fairly difficult"},
            {result: 30, operator: ">=",  score: 5, text: "difficult"},
            {result: 0, operator: ">=",  score: 4, text: "very difficult"}
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
