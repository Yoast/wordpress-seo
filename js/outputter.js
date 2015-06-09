var args = {
    inputs: {
        text: "textInput",
        keyword: "keywordInput",
        meta: "metaInput",
        url: "urlInput",
        title: "titleInput"
    },
    eventTargets: ["inputForm"],
    typeDelay: 100,
    typeDelayStep: 100,
    maxTypeDelay: 1500,
    dynamicDelay: true,
    targets: {
        output: "output",
        overall: "overallScore"
    }
};

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 * @param args
 * @constructor
 */
AnalyzeLoader = function( args ) {
    window.analyzeLoader = this;
    this.config = args;
    this.inputs = {};
    this.bindEvent();
    this.defineElements();
};

/**
 * defines the target element to be used for the output on the page
 */
AnalyzeLoader.prototype.defineElements = function() {
    this.target = document.getElementById( this.config.targets.output );
};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the analyzer.
 */
AnalyzeLoader.prototype.getInput = function() {
    this.inputs.textString = document.getElementById( this.config.inputs.text ).value;
    this.inputs.keyword = document.getElementById( this.config.inputs.keyword ).value;
    this.inputs.meta = document.getElementById( this.config.inputs.meta ).value;
    this.inputs.url = document.getElementById( this.config.inputs.url ).value;
    this.inputs.pageTitle = document.getElementById( this.config.inputs.title ).value;
};

/**
 * binds the 'input'event to the targetform/input. This will trigger the analyzeTimer function.
 */
AnalyzeLoader.prototype.bindEvent = function() {
    for ( var i = 0; i < this.config.eventTargets.length; i++ ){
        var elem = document.getElementById( this.config.eventTargets[i] );
        elem.__refObj = this;
        elem.addEventListener( "input", this.analyzeTimer );
    }
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won' be executed at every keystroke
 */
AnalyzeLoader.prototype.analyzeTimer = function() {
    var refObj = this.__refObj;
    clearTimeout( window.timer );
    window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retreive values from inputs. If the keyword is empty calls message, if keyword is filled, runs the analyzer
 */
AnalyzeLoader.prototype.checkInputs = function() {
    var refObj = window.analyzeLoader;

    refObj.getInput();
    if( refObj.inputs.keyword === "" ){
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }

};

/**
 * used when no keyword is filled in, it will display a message in the target element
 */
AnalyzeLoader.prototype.showMessage = function() {
    this.target.innerHTML = "";
    var messageDiv = document.createElement( "div" );
    messageDiv.className = "wpseo_msg";
    messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
    this.target.appendChild( messageDiv );
};

/**
 * sets the startTime timestamp
 */
AnalyzeLoader.prototype.startTime = function() {
    this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
AnalyzeLoader.prototype.endTime = function() {
    this.endTimestamp = new Date().getTime();
    if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
        if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
            this.config.typeDelay += this.config.typeDelayStep;
        }
    }
};

/**
 * inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter to format outputs.
 */
AnalyzeLoader.prototype.runAnalyzer = function() {
    if( this.config.dynamicDelay ){
        this.startTime();
    }
    this.pageAnalyzer = new Analyzer( this.inputs );
    this.pageAnalyzer.runQueue();
    this.scoreFormatter = new ScoreFormatter( this.pageAnalyzer, this.config.targets );
    if( this.config.dynamicDelay ){
        this.endTime();
    }
};

/**
 * defines the variables used for the scoreformatter, runs the outputScore en overallScore functions.
 * @param scores
 * @param target
 * @constructor
 */
ScoreFormatter = function ( scores, target ) {
    this.scores = scores.analyzeScorer.__score;
    this.overallScore = scores.analyzeScorer.__totalScore;
    this.outputTarget = target.output;
    this.overallTarget = target.overall;
    this.totalScore = 0;
    this.outputScore();
    this.outputOverallScore();
};

/**
 * creates the table for showing the results from the analyzerscorer
 */
ScoreFormatter.prototype.outputScore = function() {
    this.sortScores();
    var outputTarget = document.getElementById( this.outputTarget );
    outputTarget.innerHTML = "";
    var newTable = document.createElement( "table" );
    newTable.className = "wpseoanalysis";
    for ( var i = 0; i < this.scores.length; i++ ){
        if( this.scores[i].text !== "" ) {
            var newTR = document.createElement( "tr" );
            var newTDScore = document.createElement( "td" );
            newTDScore.className = "score";
            var scoreDiv = document.createElement( "div" );
            scoreDiv.className = "wpseo-score-icon " + this.scoreRating( this.scores[i].score );
            newTDScore.appendChild( scoreDiv );
            var newTD = document.createElement( "td" );
            newTD.innerHTML = this.scores[i].text;
            newTR.appendChild( newTDScore );
            newTR.appendChild( newTD );
            newTable.appendChild( newTR );
        }
    }
    outputTarget.appendChild( newTable );
};

/**
 * sorts the scores array on ascending scores
 */
ScoreFormatter.prototype.sortScores = function() {
    this.scores = this.scores.sort( function( a, b ){
        return a.score - b.score;
    });
};

/**
 * outputs the overallScore in the overallTarget element.
 */
ScoreFormatter.prototype.outputOverallScore = function() {
    var overallTarget = document.getElementById( this.overallTarget );
    overallTarget.innerHTML = "";
    var newSpan = document.createElement( "span" );
    newSpan.className = "wpseo-score-icon  "+this.scoreRating( Math.round( this.overallScore ) );
    overallTarget.appendChild( newSpan );
};

/**
 * retuns a string that is used as a CSSclass, based on the numeric score
 * @param score
 * @returns {scoreRate}
 */
ScoreFormatter.prototype.scoreRating = function( score ){
    var scoreRate;
    switch( score ) {
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

/**
 * run at pageload to init the analyzeLoader for pageAnalysis.
 */
loadEvents = function(){
    if( document.readyState === "complete" ){
        new AnalyzeLoader( args );
    }else{
        setTimeout( loadEvents, 50 );
    }
};
loadEvents();



