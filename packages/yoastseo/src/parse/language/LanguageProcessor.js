import Sentence from "../structure/Sentence";
import Token from "../structure/Token";
import { punctuationRegexStart, punctuationRegexEnd } from "../../languageProcessing/helpers/sanitize/removePunctuation";

const whitespaceRegex = /^\s+$/;

/*
 * The following regex matches a word separator. A word separator is either a whitespace, a slash, a backslash, a
 * tab or a non-breaking space.
 * The regex is used to split a text into tokens.
 * Do not add punctuation marks to this regex, as they are handled separately inside splitIntoTokens().
 * The word separator explicitly only contains characters that split two words and not a word and a space.
 * A space is a word separator because it separates two words if it occurs between two words. For example: "foo bar"
 * A slash is a word separator because it separates two words if it directly borders those words. For example: "foo/bar"
 * A backslash is a word separator because it separates two words if it occurs between two words. For example: "foo\bar"
 * A tab is a word separator because it separates two words if it occurs between two words. For example: "foo	bar"
 * A non-breaking space is a word separator because it separates two words if it occurs between two words. For example: "foo\u00A0bar"
 */
const wordSeparatorsRegex = /([\s\t\u00A0])/;

/**
 * Contains language-specific logic for splitting a text into sentences and tokens.
 */
class LanguageProcessor {
	/**
	 * Creates a new language processor.
	 *
	 * @param {Researcher} researcher The researcher to use.
	 */
	constructor( researcher ) {
		this.researcher = researcher;
	}

	/**
	 * Split text into sentences.
	 *
	 * @param {string} text The text to split into sentences.
	 *
	 * @returns {Sentence[]} The sentences.
	 */
	splitIntoSentences( text ) {
		const memoizedTokenizer = this.researcher.getHelper( "memoizedTokenizer" );
		/*
		 * Set the `trimSentences` flag to false. We want to keep whitespaces to be able to correctly assess the
		 * position of sentences within the source code.
		 */
		const sentences = memoizedTokenizer( text, false );

		/*
		 * If the last element in the array of sentences contains only whitespaces, remove it.
		 * This will be the case if the text ends in a whitespace - that whitespace ends up being tokenized as a
		 * separate sentence. A space at the end of the text is not needed for calculating the position of
		 * sentences, so it can be safely removed.
		 */
		if ( whitespaceRegex.test( sentences[ sentences.length - 1 ] ) ) {
			sentences.pop();
		}

		return sentences.map( function( sentence ) {
			return new Sentence( sentence );
		} );
	}

	/**
	 * Split sentence into tokens.
	 *
	 * @param {Sentence} sentence The sentence to split.
	 *
	 * @returns {Token[]} The tokens.
	 */
	splitIntoTokens( sentence ) {
		// Retrieve sentence from sentence class
		const sentenceText = sentence.text;

		// Split the sentence string into tokens. Those tokens are unrefined as they may contain punctuation.
		const rawTokens = sentenceText.split( wordSeparatorsRegex ).filter( x => x !== "" );

		const tokenTexts = [];
		rawTokens.forEach( token => {
			if ( token === "" ) {
				return;
			}
			// Pretokens contains all that occurs before the first letter of the token.
			const preTokens = [];
			// Posttokens contains all that occurs after the last letter of the token.
			const postTokens = [];

			// Add all punctuation marks that occur before the first letter of the token to the pretokens array.
			while ( punctuationRegexStart.test( token ) ) {
				preTokens.push( token[ 0 ] );
				token = token.slice( 1 );
			}
			// Add all punctuation marks that occur after the last letter of the token to the posttokens array.
			while ( punctuationRegexEnd.test( token ) ) {
				// Using unshift here because we are iterating from the end of the string to the beginning,
				// and we want to keep the order of the punctuation marks.
				// Therefore, we add them to the start of the array.
				postTokens.unshift( token[ token.length - 1 ] );
				token = token.slice( 0, -1 );
			}

			let currentTokens = [ ...preTokens, token, ...postTokens ];
			currentTokens = currentTokens.filter( x => x !== "" );
			tokenTexts.push( ...currentTokens );
		} );

		return tokenTexts.map( tokenText => new Token( tokenText ) );
	}
}
export default LanguageProcessor;
