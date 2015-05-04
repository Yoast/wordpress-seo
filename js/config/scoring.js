analyzerScoring = {
    wordCount: {
        scoreArray: [
            {result: 100, operator: "<", score: -20, text: ""},
            {result: 200, operator: "<", score: -10, text: ""},
            {result: 250, operator: "<", score: 5, text: ""},
            {result: 300, operator: "<", score: 7, text: ""},
            {result: 300, operator: ">=", score: 9, text: ""}
        ]
    },
    keywordDensity: {
        scoreArray: [
            {result: 1, operator: "<", score: 4, text: ""},
            {result: 4.5, operator: ">", score: -50, text: ""},
            {result: 0, operator: "default", score: 9, text: ""}
        ]    
    },
    fleschReading: {
        scoreArray: [
            {result: 90, operator: ">=", score: 9, text: "very easy"},
            {result: 90, operator: "<", score: 9, text: "easy"},
            {result: 80, operator: "<", score: 8, text: "fairly easy"},
            {result: 70, operator: "<", score: 7, text: "ok"},
            {result: 60, operator: "<", score: 6, text: "fairly difficult"},
            {result: 50, operator: "<", score: 5, text: "difficult"},
            {result: 30, operator: "<",  score: 4, text: "very difficult"}
        ]
    }/*,
    firstParagraph: {
        scoreArray: [
            {result: 0, operator: "==", score: 3, text: ""},
            {result: 0, operator: ">", score: 9, text: ""}
        ]
    }
*/
};