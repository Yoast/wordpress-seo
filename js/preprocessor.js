/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * YoastSEO.PreProcessor object definition. Creates __store object and calls init.
 * @params textString
 */
YoastSEO.PreProcessor = function( text ) {

	//create __store object to store data
	this.__store = {};
	this.__store.originalText = text;
	this.stringHelper = YoastSEO.getStringHelper();
	this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
YoastSEO.PreProcessor.prototype.init = function() {

	//call function to clean text
	this.textFormat();

	//call function to count words
	this.countStore();
};

/**
 * formats the original text from __store and save as cleantext, cleantextSomeTags en
 * cleanTextNoTags
 */
YoastSEO.PreProcessor.prototype.textFormat = function() {
	this.__store.cleanText = this.cleanText( this.__store.originalText );
	this.__store.cleanTextSomeTags = this.stringHelper.stripSomeTags( this.__store.cleanText );
	this.__store.cleanTextNoTags = this.stringHelper.stripAllTags( this.__store.cleanTextSomeTags );
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the __store
 * object
 */
YoastSEO.PreProcessor.prototype.countStore = function() {

	/*wordcounters*/
	this.__store.wordcount = this.__store.cleanText === "" ?
		0 :
		this.__store.cleanText.split( " " ).length;

	this.__store.wordcountNoTags = this.__store.cleanTextNoTags === "" ?
		0 :
		this.__store.cleanTextNoTags.split( " " ).length;

	/*sentencecounters*/
	this.__store.sentenceCount = this.sentenceCount( this.__store.cleanText );
	this.__store.sentenceCountNoTags = this.sentenceCount( this.__store.cleanTextNoTags );

	/*syllablecounters*/
	this.__store.syllablecount = this.syllableCount( this.__store.cleanTextNoTags );
};

/**
 * counts the number of sentences in a textstring by splitting on a period. Removes sentences that
 * are empty or have only a space.
 * @param textString
 */
YoastSEO.PreProcessor.prototype.sentenceCount = function( textString ) {
	var sentences = textString.split( "." );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
YoastSEO.PreProcessor.prototype.syllableCount = function( textString ) {
	this.syllableCount = 0;
	textString = textString.replace( /[.]/g, " " );
	textString = this.removeWords( textString );
	var words = textString.split( " " );
	var subtractSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.subtractSyllables,
		true
	);
	var addSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.addSyllables,
		true
	);
	for ( var i = 0; i < words.length; i++ ) {
		this.basicSyllableCount( words[ i ].split( /[^aeiouy]/g ) );
		this.advancedSyllableCount( words[ i ], subtractSyllablesRegexp, "subtract" );
		this.advancedSyllableCount( words[ i ], addSyllablesRegexp, "add" );
	}
	return this.syllableCount;
};

/**
 * counts the syllables by splitting on consonants
 * @param splitWordArray
 */

YoastSEO.PreProcessor.prototype.basicSyllableCount = function( splitWordArray ) {
	for ( var j = 0; j < splitWordArray.length; j++ ) {
		if ( splitWordArray[ j ].length > 0 ) {
			this.syllableCount++;
		}
	}
};

/**
 * counts the syllables by validating against regexxes, and adding and subtracting the number of
 * matches.
 * @param inputString
 * @param regex
 * @param operator
 */
YoastSEO.PreProcessor.prototype.advancedSyllableCount = function( inputString, regex, operator ) {
	var match = inputString.match( regex );
	if ( match !== null ) {
		if ( operator === "subtract" ) {
			this.syllableCount -= match.length;
		} else if ( operator === "add" ) {
			this.syllableCount += match.length;
		}
	}
};

/**
 * removes words from textstring and count syllables. Used for words that fail against regexes.
 * @param textString
 * @returns textString with exclusionwords removed
 */
YoastSEO.PreProcessor.prototype.removeWords = function( textString ) {
	var config = YoastSEO.preprocessorConfig;

	for ( var i = 0; i < config.syllables.exclusionWords.length; i++ ) {
		var exclusionRegex = new RegExp(
			config.syllables.exclusionWords[ i ].word,
			"g"
		);
		var matches = textString.match( exclusionRegex );
		if ( matches !== null ) {
			this.syllableCount += config.syllables.exclusionWords[ i ].syllables;
			textString = textString.replace( exclusionRegex, "" );
		}
	}
	return textString;
};

/**
 * cleans text by removing special characters, numberonly words and replacing all terminators by
 * periods
 * @param textString
 * @returns textString
 */
YoastSEO.PreProcessor.prototype.cleanText = function( textString ) {
	if ( textString !== "" ) {
		textString = this.replaceDiacritics( textString );
		textString = textString.toLocaleLowerCase();

		// replace comma', hyphens etc with spaces
		textString = textString.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

		// remove apostrophe
		textString = textString.replace( /[\’]/g, "" );

		// unify all terminators
		textString = textString.replace( /[.?!]/g, "." );

		textString = this.stringHelper.stripSpaces( textString );

		// add period in case it is missing
		textString += ".";

		// replace newlines with spaces
		textString = textString.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

		// remove duplicate terminators
		textString = textString.replace( /([\.])[\. ]+/g, "$1" );

		// pad sentence terminators
		textString = textString.replace( /[ ]*([\.])+/g, "$1 " );

		// Remove "words" comprised only of numbers
		textString = textString.replace( /[0-9]+[ ]/g, "" );

		textString = this.stringHelper.stripSpaces( textString );
	}

	return textString;
};

/**
 * replaces all diacritics with standard characters following the diacritics removal map from the
 * config.
 * @param textString
 * @returns textString
 */
YoastSEO.PreProcessor.prototype.replaceDiacritics = function( textString ) {
	var config = YoastSEO.preprocessorConfig;

	for ( var i = 0; i < config.diacriticsRemovalMap.length; i++ ) {
		textString = textString.replace(
			config.diacriticsRemovalMap[ i ].letters,
			config.diacriticsRemovalMap[ i ].base
		);
	}
	return textString;
};

/**
 * Checks if the preprocessor is already initialized and if so if the textstring differs from the
 * input.
 *
 * @param inputString
 * @returns {YoastSEO.PreProcessor}
 */
YoastSEO.getPreProcessor = function( inputString ) {
	if (
		typeof YoastSEO.cachedPreProcessor !== "object" ||
		YoastSEO.cachedPreProcessor.inputText !== inputString
	) {
		YoastSEO.cachedPreProcessor = new YoastSEO.PreProcessor( inputString );
	}
	return YoastSEO.cachedPreProcessor;
};
