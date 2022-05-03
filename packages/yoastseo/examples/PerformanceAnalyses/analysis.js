const Paper = require( "../../src/values/Paper" );
const researches = [ "altTagCount", "countSentencesFromText", "findKeywordInFirstParagraph", "findKeywordInPageTitle",
	"findTransitionWords", "functionWordsInKeyphrase", "getFleschReadingScore", "getKeywordDensity", "getLinks",
	"getLinkStatistics", "getParagraphLength", "getPassiveVoice", "getProminentWordsForInsights", "getProminentWordsForInternalLinking",
	"getSentenceBeginnings", "getSubheadingTextLengths", "h1s", "imageCount", "keyphraseDistribution", "keyphraseLength",
	"keywordCount", "keywordCountInSlug", "matchKeywordInSubheadings", "metaDescriptionKeyword", "metaDescriptionLength",
	"morphology", "pageTitleWidth", "readingTime", "sentences", "wordCountInText" ];
const Researcher = require( "../../src/researcher" );
var fs = require( "fs" );

require( "console.table" );

function add( a, b ) {
	return a + b;
}

function Result( research, timeElapsed ) {
	this.research = research;
	this.time = timeElapsed;
	this.percentage = -1;
	this.average = -1;
	this.min = -1;
	this.max = -1;
}

function assess( researcher, research, runs ) {
	// Save all run times
	var times = [];
	// Loop for *run* times
	for ( var i = 0; i < runs; i++ ) {
		var researchStartTime = Date.now();
		researcher.getResearch( research );
		times[ times.length ] = Date.now() - researchStartTime;
	}
	var result = new Result();
	var totalTime = times.reduce( add, 0 );

	result.research = research;
	result.time = totalTime;
	result.average = totalTime / runs;
	result.min = Math.min.apply( null, times );
	result.max = Math.max.apply( null, times );
	return result;
}

function calculatePercentage( results, totalTime ) {
	for ( var i = 0; i < results.length; i++ )        {
		results[ i ].percentage = ( 100 / totalTime ) * results[ i ].time;
	}
	return results;
}

function sortResults( results ) {
	var totalTime = 0;
	for ( var j = 0; j < results.length; j++ ) {
		totalTime += results[ j ].time;
	}
	results = calculatePercentage( results, totalTime );
	results.sort( function( a, b ) {
		return parseFloat( b.percentage ) - parseFloat( a.percentage );
	} );
	return { totalTime, results };
}

function assessAll( paper, runs ) {
	var researcher = new Researcher( paper );
	var results = [];
	var startTime = Date.now();

	for ( var i = 0; i < researches.length; i++ ) {
		results[ results.length ] = assess( researcher, researches[ i ], runs );
	}

	const __ret = sortResults( results );
	var totalTime = __ret.totalTime;
	results = __ret.results;

	console.table( results );
	console.log( "Total Time %d", totalTime );
}

module.exports = {
	doAnalysis: ( { filepath = "", locale = "en_US", runs = 1 } ) => {
		if ( filepath === "" ) {
			filepath = __dirname + "/text1.html";
		}

		const text = fs.readFileSync( filepath, { encoding: "utf-8" } );
		const paper = new Paper( text, { locale: locale } );
		paper.title = "The 100 Best U.S. Colleges and universities by State | The best schools";
		paper.description = "" +
			"The best colleges and universities list includes a full-fledged " +
			"research university and college focused on undergraduate education for every state.";
		paper.keyword = "university";

		assessAll( paper, runs );
	},
};
