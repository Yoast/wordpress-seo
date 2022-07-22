import getSentences from "../../../helpers/sentence/getSentences";
import getWords from "../../../helpers/word/getWords";

const informalPronouns = [ "I", "you", "me", "my", "mine", "your", "yours", "myself", "yourself", "yourselves" ];
const formalPronouns = [ "we", "they",   "their", "theirs", "themselves", "us", "our", "ours", "ourselves",  "it", "its", "itself" ];

/**
 * Calculates the average length of units in an array.
 *
 * @param {Array} array     The array to calculate.
 * @returns {number} The total length of a units in the array.
 */
function calculateTotalLength( array ) {
	return array.map( unit => unit.length ).reduce( ( a, b ) => a + b );
}

/**
 * Gets the array of pronouns occurrences in the text.
 *
 * @param {Array} wordsArray    The array of words in the text to check.
 * @param {Array} pronouns      The array of pronouns.
 * @returns {Array} The array of pronouns found.
 */
function getPronouns( wordsArray, pronouns ) {
	return wordsArray.filter( word => pronouns.includes( word ) );
}

/**
 * Checks if a text is formal or informal.
 *
 * @param {Object} paper        The paper to analyze.
 * @param {Object} researcher   The researcher object.
 *
 * @returns {string} The string "Formal" if the text is formal, and the string "Informal" if the text is informal.
 */
export default function( paper, researcher ) {
	const passiveSentences = researcher.getResearch( "getPassiveVoiceResult" ).passives;
	const text = paper.getText();
	const sentences = getSentences( text );
	const words = getWords( text );

	// Calculate the average letter length per sentence.
	// The total number of characters in the sentences in the text / the total number of the sentences.
	// 0.
	const totalCharactersInSentences = calculateTotalLength( sentences );
	const averageSentenceLength = totalCharactersInSentences / sentences.length;
	// Calculate the average word length per sentence = the total number of words in the text divided by the total number of the sentences.
	// 1.
	const averageWordLengthPerSentence = words.length / sentences.length;
	// Calculate the average word length = the total number of characters in the words in the text / the total number of words in the text.
	// 2.
	const averageWordLength = calculateTotalLength( words ) / words.length;
	// Calculate normalized passive voice size = the number of passives occurrences in the text / the total number of sentences.
	// 3.
	const averagePassives = passiveSentences.length / sentences.length;
	// Calculate the average number of formal pronouns = the number of occurrences of formal pronouns / the total number of words in the text.
	// 4.
	const averageFormalPronouns = getPronouns( words, formalPronouns ).length / words.length;
	// 5.
	// Calculate the average number of informal pronouns = the number of occurrences of informal pronouns / the total number of words in the text.
	const averageInformalPronouns = getPronouns( words, informalPronouns ).length / words.length;
	if ( averageWordLength <= 5.948 ) {
		if ( averageInformalPronouns <= 0.029 ) {
			if ( averageWordLengthPerSentence <= 31.439 ) {
				if ( averageSentenceLength <= 169.375 ) {
					return "Formal";
				}
				return "Informal";
			}
			return "Informal";
		}
		if ( averagePassives <= 0.25 ) {
			return "Informal";
		}
		return "Formal";
	}
	if ( averageWordLengthPerSentence <= 12.731 || averageSentenceLength <= 88.721 ) {
		return "Informal";
	}
	if ( averageInformalPronouns <= 0.006 ) {
		return "Formal";
	}
	if ( averageWordLength <= 6.129 ) {
		if ( averageFormalPronouns <= 0.024 ) {
			return "Informal";
		}
		return "Formal";
	}
	return "Formal";
}
