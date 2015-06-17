/**
 * inits the analyzerscorer used for scoring of the output from the textanalyzer
 * @constructor
 */
AnalyzeScorer = function( refObj ) {
    this.__score = [];
    this.refObj = refObj;
    this.init();
};

/**
 * loads the analyzerScoring from the config file.
 */
AnalyzeScorer.prototype.init = function() {
    this.scoring = analyzerScoring;
};

/**
 * Starts the scoring by taking the resultObject from the analyzer. Then runs the scorequeue.
 * @param resultObj
 */
AnalyzeScorer.prototype.score = function( resultObj ) {
    this.resultObj = resultObj;
    this.runQueue();
};

/**
 * runs the queue and saves the result in the __score-object.
 */
AnalyzeScorer.prototype.runQueue = function() {
    for ( var i = 0; i < this.resultObj.length; i++ ){
        var subScore = this.genericScore( this.resultObj[i] );
        if( typeof subScore !== "undefined" ) {
            this.__score = this.__score.concat( subScore );
        }
    }
    this.__totalScore = this.totalScore();
};

/**
 * scoring function that returns results based on the resultobj from the analyzer matched with
 * the scorearrays in the scoring config.
 * @param obj
 * @returns {{name: (analyzerScoring.scoreName), score: number, text: string}}
 */
AnalyzeScorer.prototype.genericScore = function( obj ){
    if( typeof obj !== "undefined" ) {
        var scoreObj = this.scoreLookup( obj.test );
        var score = { name: scoreObj.scoreName, score: 0, text: "" };
        for ( var i = 0; i < scoreObj.scoreArray.length; i++ ) {
            this.setMatcher( obj, scoreObj, i );
            switch ( true ) {
                case ( typeof scoreObj.scoreArray[i].type === "string" && this.result[scoreObj.scoreArray[i].type] ):
                    return this.returnScore( score, scoreObj, i );
                case ( typeof scoreObj.scoreArray[i].min === "undefined" && this.matcher <= scoreObj.scoreArray[i].max ):
                    return this.returnScore( score, scoreObj, i );
                case ( typeof scoreObj.scoreArray[i].max === "undefined" && this.matcher >= scoreObj.scoreArray[i].min ):
                    return this.returnScore( score, scoreObj, i );
                case ( this.matcher >= scoreObj.scoreArray[i].min && this.matcher <= scoreObj.scoreArray[i].max ):
                    return this.returnScore( score, scoreObj, i );
                default:
                    break;
            }
        }
        return score;
    }
};

/**
 * sets matcher and resultvariables so the scorefunction can use this.
 * @param obj
 * @param scoreObj
 * @param i
 */
AnalyzeScorer.prototype.setMatcher = function( obj, scoreObj, i ) {
    this.matcher = parseFloat( obj.result );
    this.result = obj.result;
    if( typeof scoreObj.scoreArray[i].matcher !== "undefined" ){
        this.matcher = parseFloat( this.result[scoreObj.scoreArray[i].matcher] );
    }
};

/**
 * finds the scoringobject by scorename for the current result.
 * @param name
 * @returns scoringObject
 */
AnalyzeScorer.prototype.scoreLookup = function( name ) {
    for ( var ii = 0; ii < this.scoring.length; ii++ ){
        if ( name === this.scoring[ii].scoreName ){
            return this.scoring[ii];
        }
    }
};

/**
 * fills the score with score and text from the scoreArray and runs the textformatter.
 * @param score
 * @param scoreObj
 * @param i
 * @returns scoreObject
 */
AnalyzeScorer.prototype.returnScore = function( score, scoreObj, i ) {
    score.score = scoreObj.scoreArray[i].score;
    score.text = this.scoreTextFormat( scoreObj.scoreArray[i], scoreObj.replaceArray );
    return score;
};

/**
 * Formats the resulttexts with variables. Uses a value, source, sourceObj or scoreObj for the replacement source
 * replaces the position from the replaceArray with the replacement source.
 * @param scoreObj
 * @param replaceArray
 * @returns formatted resultText
 */
AnalyzeScorer.prototype.scoreTextFormat = function( scoreObj, replaceArray ) {
    var resultText = scoreObj.text;
    if( typeof replaceArray !== "undefined" ) {
        for ( var i = 0; i < replaceArray.length; i++ ) {
            switch( true ) {
                case ( typeof replaceArray[i].value !== "undefined" ):
                    resultText = resultText.replace( replaceArray[i].position, replaceArray[i].value );
                    break;
                case ( typeof replaceArray[i].source !== "undefined" ):
                    resultText = resultText.replace( replaceArray[i].position, this[replaceArray[i].source] );
                    break;
                case ( typeof replaceArray[i].sourceObj !== "undefined" ):
                    var replaceWord = this.parseReplaceWord( replaceArray[i].sourceObj );
                    resultText = resultText.replace( replaceArray[i].position, replaceWord );
                    break;
                case ( typeof replaceArray[i].scoreObj !== "undefined" ):
                    resultText = resultText.replace( replaceArray[i].position, scoreObj[replaceArray[i].scoreObj] );
                    break;
                default:
                    break;
            }
        }
    }
    return resultText;
};

/**
 * converts the string to the correct object and returns the string to be used in the text.
 * @param replaceWord
 * @returns {AnalyzeScorer}
 */
AnalyzeScorer.prototype.parseReplaceWord = function( replaceWord ) {
    var parts = replaceWord.split( "." );
    var source = this;
    for ( var i = 1; i < parts.length; i++ ){
        source = source[ parts[i] ];
    }
    return source;
};

AnalyzeScorer.prototype.totalScore = function() {
    var scoreAmount = this.__score.length;
    var totalScore = 0;
    for( var i = 0; i < this.__score.length; i++ ){
        if( typeof this.__score[i] !== "undefined" ) {
            totalScore += this.__score[i].score;
        } else {
            scoreAmount--;
        }
    }
    var totalAmount = scoreAmount * analyzerScoreRating;
    return Math.round( ( totalScore / totalAmount ) * 10 );
};