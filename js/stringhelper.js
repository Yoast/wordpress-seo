/**helper functions*/
StringHelper = function() {};
/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
StringHelper.prototype.replaceString = function( textString, stringsToRemove, replacement ){
    if( typeof replacement === "undefined" ){
        replacement = " ";
    }
    textString = textString.replace( this.stringToRegex(stringsToRemove), replacement );
    return this.stripSpaces( textString );
};

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
StringHelper.prototype.matchString = function( textString, stringsToMatch ){
    return textString.match( this.stringToRegex( stringsToMatch ) );
};

/**
 * matches string with regex, returns the number of matches
 * @param textString
 * @param regex
 * @returns {number}
 */
StringHelper.prototype.countMatches = function( textString, regex ){
    var count = 0;
    var matches = textString.match( regex );
    if( matches !== null ){
        count = matches.length;
    }
    return count;
};

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
StringHelper.prototype.stringToRegex = function( stringArray, disableWordBoundary ){
    var regexString = "";
    var wordBoundary = "\\b";
    if( disableWordBoundary ){
        wordBoundary = "";
    }
    for( var i = 0; i < stringArray.length; i++ ){
        if(regexString.length > 0){ regexString += "|"; }
        regexString += stringArray[i]+wordBoundary;
    }
    return new RegExp( regexString, "g" );
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
StringHelper.prototype.stripSpaces = function( textString ) {
    //replace multiple spaces with single space
    textString = textString.replace( / {2,}/g, " " );
    //remove first/last character if space
    textString = textString.replace( /^\s+|\s+$/g, "" );
    return textString;
};



/**
 * Checks if the preprocessor is already initialized and if so if the textstring differs from the input.
 * @param inputString
 * @returns {yst_preProcessor}
 */
preProcessor = function( inputString ) {
    if ( typeof yst_preProcessor !== "object" || yst_preProcessor.inputText !== inputString ) {
        yst_preProcessor = new PreProcessor( inputString );
    }
    return yst_preProcessor;
};

/**
 * Checks if the stringhelper is already initialized. Returns stringHelper.
 * @returns {StringHelper}
 */
stringHelper = function() {
    if ( typeof yst_stringHelper !== "object" ){
        yst_stringHelper = new StringHelper();
    }
    return yst_stringHelper;
};
