var args, pageAnalysis;


ScoreFormatter = function ( scores, target ){
    this.scores = scores.analyzeScorer.__score;
    this.overallScore = scores.analyzeScorer.__totalScore;
    this.outputTarget = target.output;
    this.overallTarget = target.overall;
    this.totalScore = 0;
    this.tests = scores.length;
    this.outputScore();
    this.outputOverallScore();
};

ScoreFormatter.prototype.outputScore = function(){
    this.sortScores();
    this.outputTarget.innerHTML = "";
    var newTable = document.createElement("table");
    newTable.className = "wpseoanalysis";
    for (var i = 0; i < this.scores.length; i++ ){
        if(this.scores[i].text !== "") {
            var newTR = document.createElement("tr");
            var newTDScore = document.createElement("td");
            newTDScore.className = "score";
            var scoreDiv = document.createElement("div");
            scoreDiv.className = "wpseo-score-icon " + this.scoreRating(this.scores[i].score);
            newTDScore.appendChild(scoreDiv);
            var newTD = document.createElement("td");
            newTD.innerHTML = this.scores[i].text;
            newTR.appendChild(newTDScore);
            newTR.appendChild(newTD);
            newTable.appendChild(newTR);
        }
    }
    this.outputTarget.appendChild(newTable);
};

/**
 * sorts the scores array on descending scores
 */
ScoreFormatter.prototype.sortScores = function(){
    this.scores = this.scores.sort(function(a, b){
        return b.score - a.score;
    });
};

ScoreFormatter.prototype.outputOverallScore = function(){
    this.overallTarget.innerHTML = "";
    var newSpan = document.createElement("span");
    newSpan.className = "seoScore "+this.scoreRating(Math.round(this.overallScore));
    this.overallTarget.appendChild(newSpan);
};


ScoreFormatter.prototype.scoreRating = function(score){
    var scoreRate;
    switch(score) {
        case 0:
            scoreRate = "na";
            break;
        case 4:
        case 5:
            scoreRate = "poor";
            break;
        case 6:
        case 7:
            scoreRate = "ok";
            break;
        case 8:
        case 9:
        case 10:
            scoreRate = "good";
            break;
        default:
            scoreRate = "bad";
            break;
    }
    return scoreRate;
};

getInput = function(){
    args = {
        pageTitle: document.getElementById("titleInput").value,
        textString: document.getElementById("textInput").value,
        keyword: document.getElementById("keywordInput").value,
        url: document.getElementById("urlInput").value,
        meta: document.getElementById("metaInput").value
    };
};

runAnalyzer = function() {
    var targets = {
        output:  document.getElementById("output"),
        overall: document.getElementById("overallScore")
    };
    pageAnalysis = new Analyzer(args);
    pageAnalysis.runQueue();
    var outputter = new ScoreFormatter(pageAnalysis, targets);
};