<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

/**
 * Modified (Reduced) TextStatistics Class
 *
 * Mostly removed functionality that isn't needed within the WordPress SEO plugin.
 *
 * @link    http://code.google.com/p/php-text-statistics/
 * @license http://www.opensource.org/licenses/bsd-license.php New BSD license
 */

class Yoast_TextStatistics {

	/**
	 * @var string $strEncoding Used to hold character encoding to be used by object, if set
	 */
	protected $strEncoding = '';

	/**
	 * Constructor.
	 *
	 * @param string  $strEncoding    Optional character encoding.
	 */
	public function __construct( $strEncoding = '' ) {
		if ( $strEncoding <> '' ) {
			// Encoding is given. Use it!
			$this->strEncoding = $strEncoding;
		}
	}

	/**
	 * Gives the Flesch-Kincaid Reading Ease of text entered rounded to one digit
	 *
	 * @param  string $strText         Text to be checked
	 * @return float
	 */
	function flesch_kincaid_reading_ease( $strText ) {
		$strText = $this->clean_text( $strText );
		return round( ( 206.835 - ( 1.015 * $this->average_words_per_sentence( $strText ) ) - ( 84.6 * $this->average_syllables_per_word( $strText ) ) ), 1 );
	}

	/**
	 * Gives string length.
	 *
	 * @param  string $strText      Text to be measured
	 * @return int
	 */
	public function text_length( $strText ) {
		return strlen( utf8_decode( $strText ) );
	}

	/**
	 * Gives letter count (ignores all non-letters).
	 *
	 * @todo make this work for utf8 text ?
	 *
	 * @param string $strText      Text to be measured
	 * @return int
	 */
	public function letter_count( $strText ) {
		$strText       = $this->clean_text( $strText ); // To clear out newlines etc
		$intTextLength = preg_match_all( '`[A-Za-z]`', $strText, $matches );
		return $intTextLength;
	}

	/**
	 * Trims, removes line breaks, multiple spaces and generally cleans text before processing.
	 *
	 * @param string $strText      Text to be transformed
	 * @return string
	 */
	protected function clean_text( $strText ) {
		// all these tags should be preceeded by a full stop.
		$fullStopTags = array( 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd' );
		foreach ( $fullStopTags as $tag ) {
			$strText = str_ireplace( '</' . $tag . '>', '.', $strText );
		}
		$strText = strip_tags( $strText );
		$strText = preg_replace( '`[,:;\(\)-]`', ' ', $strText ); // Replace commans, hyphens etc (count them as spaces)
		$strText = preg_replace( '`[\.!?]`', '.', $strText ); // Unify terminators
		$strText = trim( $strText ) . '.'; // Add final terminator, just in case it's missing.
		$strText = preg_replace( '`[ ]*[\n\r]+[ ]*`', ' ', $strText ); // Replace new lines with spaces
		$strText = preg_replace( '`([\.])[\. ]+`', '$1', $strText ); // Check for duplicated terminators
		$strText = trim( preg_replace( '`[ ]*([\.])`', '$1 ', $strText ) ); // Pad sentence terminators
		$strText = preg_replace( '`[ ]+`', ' ', $strText ); // Remove multiple spaces
		$strText = preg_replace_callback( '`\. [^ ]+`', create_function( '$matches', 'return strtolower($matches[0]);' ), $strText ); // Lower case all words following terminators (for gunning fog score)
		return $strText;
	}

	/**
	 * Converts string to lower case. Tries mb_strtolower and if that fails uses regular strtolower.
	 *
	 * @param string $strText      Text to be transformed
	 * @return string
	 */
	protected function lower_case( $strText ) {
		return strtolower( $strText );
	}

	/**
	 * Converts string to upper case. Tries mb_strtoupper and if that fails uses regular strtoupper.
	 *
	 * @param string $strText      Text to be transformed
	 * @return string
	 */
	protected function upper_case( $strText ) {
		return strtoupper( $strText );
	}

	/**
	 * Returns sentence count for text.
	 *
	 * @param   string $strText      Text to be measured
	 * @return int
	 */
	public function sentence_count( $strText ) {
		$strText = $this->clean_text( $strText );
		// Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
		// [JRF] Will also be tripped up by ... or ?!
		// @todo May be replace with something along the lines of this - will at least provide better count in ... and ?! situations:
		// $intSentences = max( 1, preg_match_all( '`[^\.!?]+[\.!?]+([\s]+|$)`u', $strText, $matches ) ); [/JRF]
		$intSentences = max( 1, $this->text_length( preg_replace( '`[^\.!?]`', '', $strText ) ) );
		return $intSentences;
	}

	/**
	 * Returns word count for text.
	 *
	 * @param  string $strText      Text to be measured
	 * @return int
	 */
	public function word_count( $strText ) {
		$strText = $this->clean_text( $strText );
		// Will be tripped by em dashes with spaces either side, among other similar characters
		$intWords = 1 + $this->text_length( preg_replace( '`[^ ]`', '', $strText ) ); // Space count + 1 is word count
		return $intWords;
	}

	/**
	 * Returns average words per sentence for text.
	 *
	 * @param string $strText      Text to be measured
	 * @return int
	 */
	public function average_words_per_sentence( $strText ) {
		$strText          = $this->clean_text( $strText );
		$intSentenceCount = $this->sentence_count( $strText );
		$intWordCount     = $this->word_count( $strText );
		return ( $intWordCount / $intSentenceCount );
	}

	/**
	 * Returns average syllables per word for text.
	 *
	 * @param string  $strText      Text to be measured
	 * @return int
	 */
	public function average_syllables_per_word( $strText ) {
		$strText          = $this->clean_text( $strText );
		$intSyllableCount = 0;
		$intWordCount     = $this->word_count( $strText );
		$arrWords         = explode( ' ', $strText );
		for ( $i = 0; $i < $intWordCount; $i++ ) {
			$intSyllableCount += $this->syllable_count( $arrWords[$i] );
		}
		return ( $intSyllableCount / $intWordCount );
	}

	/**
	 * Returns the number of syllables in the word.
	 * Based in part on Greg Fast's Perl module Lingua::EN::Syllables
	 *
	 * @param string  $strWord Word to be measured
	 * @return int
	 */
	public function syllable_count( $strWord ) {

		$intSyllableCount = 0;
		$strWord          = $this->lower_case( $strWord );

		// Specific common exceptions that don't follow the rule set below are handled individually
		// Array of problem words (with word as key, syllable count as value)
		$arrProblemWords = Array(
			'simile'  => 3
		, 'forever'   => 3
		, 'shoreline' => 2
		);
		if ( isset( $arrProblemWords[$strWord] ) ) {
			$intSyllableCount = $arrProblemWords[$strWord];
		}
		if ( $intSyllableCount > 0 ) {
			return $intSyllableCount;
		}

		// These syllables would be counted as two but should be one
		$arrSubSyllables = Array(
			'cial'
		, 'tia'
		, 'cius'
		, 'cious'
		, 'giu'
		, 'ion'
		, 'iou'
		, 'sia$'
		, '[^aeiuoyt]{2,}ed$'
		, '.ely$'
		, '[cg]h?e[rsd]?$'
		, 'rved?$'
		, '[aeiouy][dt]es?$'
		, '[aeiouy][^aeiouydt]e[rsd]?$'
		, '^[dr]e[aeiou][^aeiou]+$' // Sorts out deal, deign etc
		, '[aeiouy]rse$' // Purse, hearse
		);

		// These syllables would be counted as one but should be two
		$arrAddSyllables = Array(
			'ia'
		, 'riet'
		, 'dien'
		, 'iu'
		, 'io'
		, 'ii'
		, '[aeiouym]bl$'
		, '[aeiou]{3}'
		, '^mc'
		, 'ism$'
		, '([^aeiouy])\1l$'
		, '[^l]lien'
		, '^coa[dglx].'
		, '[^gq]ua[^auieo]'
		, 'dnt$'
		, 'uity$'
		, 'ie(r|st)$'
		);

		// Single syllable prefixes and suffixes
		$arrPrefixSuffix = Array(
			'`^un`'
		, '`^fore`'
		, '`ly$`'
		, '`less$`'
		, '`ful$`'
		, '`ers?$`'
		, '`ings?$`'
		);

		// Remove prefixes and suffixes and count how many were taken
		$strWord = preg_replace( $arrPrefixSuffix, '', $strWord, -1, $intPrefixSuffixCount );

		// Removed non-word characters from word
		$strWord          = preg_replace( '`[^a-z]`is', '', $strWord );
		$arrWordParts     = preg_split( '`[^aeiouy]+`', $strWord );
		$intWordPartCount = 0;
		foreach ( $arrWordParts as $strWordPart ) {
			if ( $strWordPart <> '' ) {
				$intWordPartCount++;
			}
		}

		// Some syllables do not follow normal rules - check for them
		// Thanks to Joe Kovar for correcting a bug in the following lines
		$intSyllableCount = $intWordPartCount + $intPrefixSuffixCount;
		foreach ( $arrSubSyllables as $strSyllable ) {
			$intSyllableCount -= preg_match( '`' . $strSyllable . '`', $strWord );
		}
		foreach ( $arrAddSyllables as $strSyllable ) {
			$intSyllableCount += preg_match( '`' . $strSyllable . '`', $strWord );
		}
		$intSyllableCount = ( $intSyllableCount == 0 ) ? 1 : $intSyllableCount;
		return $intSyllableCount;
	}

}