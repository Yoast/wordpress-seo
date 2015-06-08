var args, pageAnalysis, timer;
var time = 500;


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
 * sorts the scores array on ascending scores
 */
ScoreFormatter.prototype.sortScores = function(){
    this.scores = this.scores.sort(function(a, b){
        return a.score - b.score;
    });
};

ScoreFormatter.prototype.outputOverallScore = function(){
    this.overallTarget.innerHTML = "";
    var newSpan = document.createElement("span");
    newSpan.className = "wpseo-score-icon  "+this.scoreRating(Math.round(this.overallScore));
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
    console.log('get input');
    var start = new Date().getTime();
    args = {
        pageTitle: document.getElementById("titleInput").value,
        textString: document.getElementById("textInput").value,
        keyword: document.getElementById("keywordInput").value,
        url: document.getElementById("urlInput").value,
        meta: document.getElementById("metaInput").value

    };

    var targets = {
        output: document.getElementById("output"),
        overall: document.getElementById("overallScore")
    };

    if(args.keyword !== "") {
        pageAnalysis = new Analyzer(args);
        pageAnalysis.runQueue();
        new ScoreFormatter(pageAnalysis, targets);
    }else{
        targets.output.innerHTML = "";
        var messageDiv = document.createElement("div");
        messageDiv.className = "wpseo_msg";
        messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
        targets.output.appendChild(messageDiv);
    }
    var end = new Date().getTime();
    document.getElementById("debug").innerHTML = (end - start);
};

loadAnalyzer = function(){
    clearTimeout(timer);
    timer = setTimeout(getInput, time);
};




loadEvents = function(){
    if(document.readyState === "complete"){
        document.getElementById('inputForm').addEventListener('input', function(){ loadAnalyzer(); });
    }else{
        setTimeout(loadEvents, 50);
    }
};
loadEvents();

