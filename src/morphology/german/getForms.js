import { flatten, flattenDeep, uniq as unique } from "lodash-es";
import { getNounForms } from "./getNounForms";
import stem from "./stem";

const checkNounStemsWithUmlaut = function( stemToCheck, morphologyDataNouns ) {
	for ( const stemPair in morphologyDataNouns.stemsWithUmlaut ) {
		 const currentStemPair = morphologyDataNouns.stemsWithUmlaut[ stemPair ];

		 for ( const stem in currentStemPair ) {
			 const stemAtEndOfWord = new RegExp( currentStemPair[ stem ] + "$" );
			 // Check if the stemmed word ends in one of the stems of the exception list.
			 if ( stemAtEndOfWord.test( stemToCheck ) ) {
			 	const unstemmedWord = stemToCheck.replace( stemAtEndOfWord, "" );
			 	/*
			 	 * If the word is e.g. a compound, "unstemming" the word will result in some lexical material to
			 	 * be left over. That lexical material is the base for the stems.
			 	 */
			 	if ( unstemmedWord.length > 0 ) {
				    return currentStemPair.map( currentStem => unstemmedWord.concat( currentStem ) );
			    }
			    /*
			     * Return all possible stems since apparently the word that's being checked is equal to one
			     * of the stems in the exception list.
			     */
				return currentStemPair;
			 }
		 }
	}
	return [];
};

export function getForms( word, morphologyData ) {
	let wordStems = [];

	const initialWordStem = stem( word );
	wordStems.push( initialWordStem );
	wordStems.push( checkNounStemsWithUmlaut( initialWordStem, morphologyData.nouns ) );
	wordStems = unique( flattenDeep( wordStems ) );

	const nounForms = wordStems.map( wordStem => getNounForms( wordStem, morphologyData.nouns ) );
	nounForms.push( word );
	nounForms.push( wordStems );

	const forms = unique( flatten( nounForms ) );

	return forms;
}
