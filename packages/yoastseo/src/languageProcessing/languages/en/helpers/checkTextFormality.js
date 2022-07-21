import getSentences from "../../../helpers/sentence/getSentences";
import getWords from "../../../helpers/word/getWords";


function calculateAverageLength( array ) {
	return array.map( unit => unit.length ).reduce( ( a, b ) => a + b );
}

function getInformalPronouns( words ) {
	const informalPronouns = [ "I", "you", "me", "my", "mine", "your", "yours", "myself", "yourself", "yourselves" ];

	return words.map( word => informalPronouns.includes( word ) );
}

export default function( text, passiveSentences ) {
	/*
	 * 0 = average letter length per sentence
	 * 1 = average word length per sentence
	 * 2 = average word length
	 * 3 = normalized passive voice size
	 * 5 = average number of informal pronouns
	 */
	const sentences = getSentences( text );
	const words = getWords( text );

	// Calculate the average letter length per sentence = the total number of characters in the sentences in the text / the total number of the sentences.
	const totalCharactersInSentences = calculateAverageLength( sentences );
	const averageSentenceLength = totalCharactersInSentences / sentences.length;
	// Calculate the average word length per sentence = the total number of words in the text divided by the total number of the sentences.
	const averageWordLengthPerSentence = words.length / sentences.length;
	// Calculate the average word length = the total number of characters in the words in the text / the total number of words in the text.
	const averageWordLength = calculateAverageLength( words );
	// Calculate the average number of informal pronouns = the number of occurrences of informal pronouns / the total number of words in the text.
	const averageInformalPronouns = getInformalPronouns( words ) / words.length;
}
