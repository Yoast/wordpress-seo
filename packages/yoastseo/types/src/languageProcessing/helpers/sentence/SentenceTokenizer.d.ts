/**
 * Class for tokenizing a (html) text into sentences.
 */
export default class SentenceTokenizer {
    sentenceDelimiters: string;
    /**
     * Gets the sentence delimiters.
     *
     * @returns {string} The sentence delimiters.
     */
    getSentenceDelimiters(): string;
    /**
     * Returns whether or not a certain character is a number.
     *
     * @param {string} character The character to check.
     * @returns {boolean} Whether or not the character is a capital letter.
     */
    isNumber(character: string): boolean;
    /**
     * Returns whether or not a given HTML tag is a break tag.
     *
     * @param {string} htmlTag The HTML tag to check.
     * @returns {boolean} Whether or not the given HTML tag is a break tag.
     */
    isBreakTag(htmlTag: string): boolean;
    /**
     * Returns whether or not a given character is quotation mark.
     *
     * @param {string} character The character to check.
     * @returns {boolean} Whether or not the given character is a quotation mark.
     */
    isQuotation(character: string): boolean;
    /**
     * A mock definition of this function. This function is only used in extensions for languages that use an ordinal dot.
     *
     * @returns {boolean} Always returns false as it is a language specific implementation if a language has an ordinal dot.
     */
    endsWithOrdinalDot(): boolean;
    /**
     * Returns whether or not a given character is a punctuation mark that can be at the beginning
     * of a sentence, like ¿ and ¡ used in Spanish.
     *
     * @param {string} character The character to check.
     * @returns {boolean} Whether or not the given character is a punctuation mark.
     */
    isPunctuation(character: string): boolean;
    /**
     * Removes duplicate whitespace from a given text.
     *
     * @param {string} text The text with duplicate whitespace.
     * @returns {string} The text without duplicate whitespace.
     */
    removeDuplicateWhitespace(text: string): string;
    /**
     * Returns whether or not a certain character is a capital letter.
     *
     * @param {string} character The character to check.
     * @returns {boolean} Whether or not the character is a capital letter.
     */
    isCapitalLetter(character: string): boolean;
    /**
     * Checks whether the given character is a smaller than sign.
     *
     * This function is used to make sure that tokenizing the content after
     * the smaller than sign works as expected.
     * E.g. 'A sentence. < Hello world!' = ['A sentence.', '< Hello world!'].
     *
     * @param {string} character The character to check.
     * @returns {boolean} Whether the character is a smaller than sign ('<') or not.
     */
    isSmallerThanSign(character: string): boolean;
    /**
     * Retrieves the next two characters from an array with the two next tokens.
     *
     * @param {Array} nextTokens The two next tokens. Might be undefined.
     * @returns {string} The next two characters.
     */
    getNextTwoCharacters(nextTokens: any[]): string;
    /**
     * Checks whether a character is from a language that's written from right to left.
     * These languages don't have capital letter forms. Therefore any letter from these languages is a
     * potential sentence beginning.
     *
     * @param {string} letter The letter to check.
     *
     * @returns {boolean} Whether the letter is from an LTR language.
     */
    isLetterFromSpecificLanguage(letter: string): boolean;
    /**
     * Checks if the sentenceBeginning beginning is a valid beginning.
     *
     * @param {string} sentenceBeginning The beginning of the sentence to validate.
     * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
     */
    isValidSentenceBeginning(sentenceBeginning: string): boolean;
    /**
     * Checks if the token is a valid sentence start.
     *
     * @param {Object} token The token to validate.
     * @returns {boolean} Returns true if the token is valid sentence start, false if it is not.
     */
    isSentenceStart(token: Object): boolean;
    /**
     * Checks if the token is a valid sentence ending. A valid sentence ending is either a full stop or another
     * delimiter such as "?", "!", etc.
     *
     * @param {Object} token The token to validate.
     * @returns {boolean} Returns true if the token is valid sentence ending, false if it is not.
     */
    isSentenceEnding(token: Object): boolean;
    /**
     * Checks if a full stop is part of a person's initials.
     *
     * Tests if tokens exist. Then tests if the tokens are of the right type.
     * For previous token, it checks if the sentence ends with a single letter.
     * For nextToken it checks if it is a single letter.
     * Checks if next token is followed by a full stop.
     *
     * @param {object} token The current token (must be a full stop).
     * @param {object} previousToken The token before the full stop.
     * @param {object} nextToken The token following the full stop.
     * @param {object} secondToNextToken The second token after the full stop.
     * @returns {boolean} True if a full stop is part of a person's initials, False if the full stop is not part of a person's initials.
     */
    isPartOfPersonInitial(token: object, previousToken: object, nextToken: object, secondToNextToken: object): boolean;
    /**
     * Tokens that represent a '<', followed by content until it enters another '<' or '>'
     * gets another pass by the tokenizer.
     *
     * @param {Object} token A token of type 'smaller-than-sign-content'.
     * @param {string[]} tokenSentences The current array of found sentences. Sentences may get added by this method.
     * @param {string} currentSentence The current sentence. Sentence parts may get appended by this method.
     * @returns {{tokenSentences, currentSentence}} The found sentences and the current sentence, appended when necessary.
     */
    tokenizeSmallerThanContent(token: Object, tokenSentences: string[], currentSentence: string): {
        tokenSentences: any;
        currentSentence: any;
    };
    /**
     * Creates a tokenizer.
     *
     * @returns {Object} The tokenizer and the tokens.
     */
    createTokenizer(): Object;
    /**
     * Tokenizes the given text using the given tokenizer.
     *
     * @param {Object} tokenizer The tokenizer to use.
     * @param {string} text The text to tokenize.
     * @returns {void}
     */
    tokenize(tokenizer: Object, text: string): void;
    /**
     * Checks if a string ends with an abbreviation.
     * @param {string} currentSentence A (part of) a sentence.
     * @returns {boolean} True if the string ends with an abbreviation that is in abbreviations.js. Otherwise, False.
     */
    endsWithAbbreviation(currentSentence: string): boolean;
    /**
     * Checks whether the given tokens are a valid html tag pair.
     * Note that this method is not a full html tag validator. It should be replaced with a better solution once the html parser is implemented.
     *
     * @param {object} firstToken   The first token to check. It is asserted that this token contains/is an opening html tag.
     * @param {object} lastToken    The last token to check. It is asserted that this token contains/is a closing html tag.
     *
     * @returns {boolean} True if the tokens are a valid html tag pair. Otherwise, False.
     */
    isValidTagPair(firstToken: object, lastToken: object): boolean;
    /**
     * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
     *
     * @param {Object[]} tokenArray The tokens from the sentence tokenizer.
     * @param {boolean} [trimSentences=true] Whether to trim the sentences at the end or not.
     *
     * @returns {string[]} A list of sentences.
     */
    getSentencesFromTokens(tokenArray: Object[], trimSentences?: boolean | undefined): string[];
    /**
     * Gets the current sentence when:
     * a) There is a next sentence, and the next character is a valid sentence beginning preceded by a white space, OR
     * b) The next token is a sentence start
     *
     * @param {boolean} hasNextSentence     Whether the next characters are more than two.
     * @param {string} nextSentenceStart    The second character of the next characters.
     * @param {string} nextCharacters       The string values of the next two tokens.
     * @param {object} nextToken            The next token object.
     * @param {array} tokenSentences        The array of pushed valid sentences.
     * @param {string} currentSentence      The current sentence.
     *
     * @returns {string} The current sentence.
     */
    getValidSentence(hasNextSentence: boolean, nextSentenceStart: string, nextCharacters: string, nextToken: object, tokenSentences: array, currentSentence: string): string;
    /**
     * Checks if the character is a whitespace.
     *
     * @param {string} character    The character to check.
     * @returns {boolean}   Whether the character is a whitespace.
     */
    isCharacterASpace(character: string): boolean;
}
