require( "console.table" );

var Paper = require( "../../js/values/Paper" );
var relevantWords = require( "../../js/researches/relevantWords" )
var getRelevantWords = relevantWords.getRelevantWords;
var getWordCombinations = relevantWords.getWordCombinations;
var calculateOccurrences = relevantWords.calculateOccurrences;
var getRelevantCombinations = relevantWords.getRelevantCombinations;
var WordCombination = require( "../../js/values/WordCombination" );
var formatNumber = function ( number ) {

   if ( Math.round( number ) === number ) {
      return Math.round( number );
   }

   return Math.round( number * 10000 ) / 10000;
};
var getWords = require( "../../js/stringProcessing/getWords" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

var fs = require( "fs" );

var filepath = process.argv[ 2 ];

if ( ! filepath ) {
   filepath = __dirname + "/input.txt";
}
var text = fs.readFileSync( filepath, { "encoding": "utf-8" } );

var relevantWordss = map( getRelevantWords( text ), function( word ) {
   var words = getWords( text );

   var output = {
      "Word": word.getCombination(),
      "Length": word._length,
      "Occurrences": word.getOccurrences(),
      "Relevance": formatNumber( word.getRelevance() ),
      "Multiplier":  formatNumber( word.getMultiplier( word.getRelevantWordPercentage() ) ),
      "Relevant word percentage": formatNumber( word.getRelevantWordPercentage() )
   }

   if ( word._length === 1 ) {
      output[ "Length Bonus" ] = "";
   } else {
      output[ "Length Bonus" ] = WordCombination.lengthBonus[ word._length ];
   }

   output[ "Density" ] = formatNumber( word.getDensity( words.length ) );

   return output;
});

console.table( relevantWordss );
