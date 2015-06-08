var args = {
    inputs: {
        text: "textInput",
        keyword: "keywordInput",
        meta: "metaInput",
        url: "urlInput",
        title: "titleInput"
    },
    eventTargets: ["inputForm"],
    typeDelay: 500,
    targets: {
        output: "output",
        overall: "overallScore"
    }
};

var timer;

AnalyzeLoader = function(args){
    window.analyzeLoader = this;
    this.config = args;
    this.inputs = {};
    this.bindEvent();
    this.defineElements();
};

AnalyzeLoader.prototype.defineElements = function(){
    this.target = document.getElementById(this.config.targets.output);

};

AnalyzeLoader.prototype.getInput = function(){
    this.inputs.textString = document.getElementById(this.config.inputs.text).value;
    this.inputs.keyword = document.getElementById(this.config.inputs.keyword).value;
    this.inputs.meta = document.getElementById(this.config.inputs.meta).value;
    this.inputs.url = document.getElementById(this.config.inputs.url).value;
    this.inputs.pageTitle = document.getElementById(this.config.inputs.title).value;
};

AnalyzeLoader.prototype.bindEvent = function(){
    for (var i = 0; i < this.config.eventTargets.length; i++){
        var elem = document.getElementById(this.config.eventTargets[i]);
        elem.__refObj = this;
        elem.addEventListener("input", this.analyzeTimer);
    }
};

AnalyzeLoader.prototype.analyzeTimer = function(){
    var refObj = this.__refObj;
    clearTimeout(window.timer);
    window.timer = setTimeout(refObj.checkInputs, refObj.config.typeDelay);
};

AnalyzeLoader.prototype.checkInputs = function(){
    var refObj = window.analyzeLoader;
    refObj.getInput();
    if(refObj.inputs.keyword === ""){
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }
};

AnalyzeLoader.prototype.showMessage = function(){
    this.target.innerHTML = "";
    var messageDiv = document.createElement("div");
    messageDiv.className = "wpseo_msg";
    messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
    this.target.appendChild(messageDiv);
};

AnalyzeLoader.prototype.runAnalyzer = function(){
    this.pageAnalyzer = new Analyzer(this.inputs);
    this.pageAnalyzer.runQueue();
    this.scoreFormatter = new ScoreFormatter(this.pageAnalyzer, this.config.targets);
};

/**
 *
 * @param scores
 * @param target
 * @constructor
 */
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

/**
 * creates the table for showing the results from the analyzerscorer
 */
ScoreFormatter.prototype.outputScore = function(){
    this.sortScores();
    var outputTarget = document.getElementById(this.outputTarget);
    outputTarget.innerHTML = "";
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
    outputTarget.appendChild(newTable);
};

/**
 * sorts the scores array on ascending scores
 */
ScoreFormatter.prototype.sortScores = function(){
    this.scores = this.scores.sort(function(a, b){
        return a.score - b.score;
    });
};

/**
 *
 */
ScoreFormatter.prototype.outputOverallScore = function(){
    var overallTarget = document.getElementById(this.overallTarget);
    overallTarget.innerHTML = "";
    var newSpan = document.createElement("span");
    newSpan.className = "wpseo-score-icon  "+this.scoreRating(Math.round(this.overallScore));
    overallTarget.appendChild(newSpan);
};

/**
 * retuns a string that is used as a CSSclass, based on the numeric score
 * @param score
 * @returns {scoreRate}
 */
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

loadEvents = function(){
    if(document.readyState === "complete"){
        new AnalyzeLoader(args);
    }else{
        setTimeout(loadEvents, 50);
    }
};
loadEvents();



