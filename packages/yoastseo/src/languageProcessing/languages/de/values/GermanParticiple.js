import { languageProcessing, values } from "yoastseo";
const { indices } = languageProcessing;
const { getIndicesByWord, getIndicesByWordList } = indices;
const { Participle } = values;

import exceptionsParticiplesActive from "../config/internal/exceptionsParticiplesActive.js";

import { participleLike as auxiliaries } from "../config/internal/passiveVoiceAuxiliaries.js";

const exceptionsRegex =
	/\S+(apparat|arbeit|dienst|haft|halt|keit|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t.,'()"+-;!?:/»«‹›<>])/ig;

import { includes } from "lodash-es";
import { map } from "lodash-es";

/**
 * Creates an Participle object for the German language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
const GermanParticiple = function(  participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.setSentencePartPassiveness( this.isPassive() );
};

require( "util" ).inherits( GermanParticiple, Participle );

/**
 * Checks if the text is passive based on the participle exceptions.
 *
 * @returns {boolean} Returns true if there is no exception, and the sentence is passive.
 */
GermanParticiple.prototype.isPassive = function() {
	return 	! this.hasNounSuffix() &&
				! this.isInExceptionList() &&
				! this.hasHabenSeinException() &&
				! this.isAuxiliary();
};

/**
 * Checks whether a found participle is in the exception list.
 * If a word is in the exceptionsParticiplesActive list, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is in the exception list, otherwise returns false.
 */
GermanParticiple.prototype.isInExceptionList = function() {
	return includes( exceptionsParticiplesActive, this.getParticiple() );
};

/**
 * Checks whether a found participle ends in a noun suffix.
 * If a word ends in a noun suffix from the exceptionsRegex, it isn't a participle.
 *
 * @returns {boolean} Returns true if it ends in a noun suffix, otherwise returns false.
 */
GermanParticiple.prototype.hasNounSuffix = function() {
	return this.getParticiple().match( exceptionsRegex ) !== null;
};

/**
 * Checks whether a participle is followed by 'haben' or 'sein'.
 * If a participle is followed by one of these, the sentence is not passive.
 *
 * @returns {boolean} Returns true if it is an exception, otherwise returns false.
 */
GermanParticiple.prototype.hasHabenSeinException = function() {
	const participleIndices = getIndicesByWord( this.getParticiple(), this.getSentencePart() );
	let habenSeinIndices = getIndicesByWordList( [ "haben", "sein" ], this.getSentencePart() );

	// Don't check further if there is no participle or no haben/sein.
	if ( participleIndices.length === 0 || habenSeinIndices.length === 0 ) {
		return false;
	}

	habenSeinIndices = map( habenSeinIndices, "index" );
	const currentParticiple = participleIndices[ 0 ];
	return includes( habenSeinIndices, currentParticiple.index + currentParticiple.match.length + 1 );
};

/**
 * Checks whether a found participle is an auxiliary.
 * If a word is an auxiliary, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is an auxiliary, otherwise returns false.
 */
GermanParticiple.prototype.isAuxiliary = function() {
	return includes( auxiliaries, this.getParticiple() );
};


export default GermanParticiple;
