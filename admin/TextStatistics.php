<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'Yoast_TextStatistics' ) ) {
	/**
	 * Modified (Reduced) TextStatistics Class
	 *
	 * Mostly removed functionality that isn't needed within the WordPress SEO plugin.
	 *
	 * @link    http://code.google.com/p/php-text-statistics/
	 * @link	https://github.com/DaveChild/Text-Statistics (new repo location)
	 * @license http://www.opensource.org/licenses/bsd-license.php New BSD license
	 *
	 * @todo [JRF => whomever] Research if a class/library can be found which will offer
	 * this functionality to a broader scope of languages/charsets.
	 * Now basically limited to English.
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
			$score   = wpseo_calc( 206.835, '-', wpseo_calc( wpseo_calc( 1.015, '*', $this->average_words_per_sentence( $strText ) ), '-', wpseo_calc( 84.6, '*', $this->average_syllables_per_word( $strText ) ) ), true, 1 );
			if ( $score > 0 ) {
				return $score;
			}
			else {
				return 0;
			}
		}

		/**
		 * Gives string length.
		 *
		 * @todo [JRF => whomever] allow for non-utf8 text ? or does that already work this way
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
		 * @todo [JRF => whomever] make this work for utf8 text/text in other charsets ?
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
			static $clean = array();

			if (isset($clean[$strText])) {
				return $clean[$strText];
			}

			$key = $strText;

			// all these tags should be preceeded by a full stop.
			$fullStopTags = array( 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd' );
			foreach ( $fullStopTags as $tag ) {
				$strText = str_ireplace( '</' . $tag . '>', '.', $strText );
			}
			$strText = strip_tags( $strText );
			$strText = preg_replace( '`[",:;\(\)-]`', ' ', $strText ); // Replace commas, hyphens etc (count them as spaces)
			$strText = preg_replace( '`[\.!?]`', '.', $strText ); // Unify terminators
			$strText = trim( $strText ) . '.'; // Add final terminator, just in case it's missing.
			$strText = preg_replace( '`[ ]*[\n\r]+[ ]*`', ' ', $strText ); // Replace new lines with spaces
			$strText = preg_replace( '`([\.])[\. ]+`', '$1', $strText ); // Check for duplicated terminators
			$strText = trim( preg_replace( '`[ ]*([\.])`', '$1 ', $strText ) ); // Pad sentence terminators
			$strText = preg_replace( '` [0-9]+ `', ' ', ' ' . $strText . ' '); // Remove "words" comprised only of numbers
			$strText = preg_replace( '`[ ]+`', ' ', $strText ); // Remove multiple spaces
			$strText = preg_replace_callback( '`\. [^ ]+`', create_function( '$matches', 'return strtolower($matches[0]);' ), $strText ); // Lower case all words following terminators (for gunning fog score)

			$strText = trim($strText);

			// Cache it and return
			$clean[$key] = $strText;
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
			if ( strlen( trim( $strText ) ) == 0 ) {
				return 0;
			}

			$strText = $this->clean_text( $strText );
			// Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
			// [JRF] Will also be tripped up by ... or ?!
			// @todo [JRF => whomever] May be replace with something along the lines of this - will at least provide better count in ... and ?! situations:
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
			if ( strlen( trim( $strText ) ) == 0 ) {
				return 0;
			}

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
			return ( wpseo_calc( $intWordCount, '/', $intSentenceCount ) );
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
			return ( wpseo_calc( $intSyllableCount, '/', $intWordCount ) );
		}

		/**
		 * Returns the number of syllables in the word.
		 * Based in part on Greg Fast's Perl module Lingua::EN::Syllables
		 *
		 * @param string  $strWord Word to be measured
		 * @return int
		 */
		public function syllable_count( $strWord ) {
			if ( strlen( trim( $strWord ) ) == 0 ) {
				return 0;
			}

			// Should be no non-alpha characters
			$strWord = preg_replace( '`[^A_Za-z]`', '', $strWord );

			$intSyllableCount = 0;
			$strWord          = $this->lower_case( $strWord );

			// Specific common exceptions that don't follow the rule set below are handled individually
			// Array of problem words (with word as key, syllable count as value)
			$arrProblemWords = array(
				'simile'    => 3,
				'forever'   => 3,
				'shoreline' => 2,
			);
			if ( isset( $arrProblemWords[$strWord] ) ) {
				$intSyllableCount = $arrProblemWords[$strWord];
			}
			if ( $intSyllableCount > 0 ) {
				return $intSyllableCount;
			}

			// These syllables would be counted as two but should be one
			$arrSubSyllables = array(
				'cial',
				'tia',
				'cius',
				'cious',
				'giu',
				'ion',
				'iou',
				'sia$',
				'[^aeiuoyt]{2,}ed$',
				'.ely$',
				'[cg]h?e[rsd]?$',
				'rved?$',
				'[aeiouy][dt]es?$',
				'[aeiouy][^aeiouydt]e[rsd]?$',
				'^[dr]e[aeiou][^aeiou]+$', // Sorts out deal, deign etc
				'[aeiouy]rse$', // Purse, hearse
			);

			// These syllables would be counted as one but should be two
			$arrAddSyllables = array(
				'ia',
				'riet',
				'dien',
				'iu',
				'io',
				'ii',
				'[aeiouym]bl$',
				'[aeiou]{3}',
				'^mc',
				'ism$',
				'([^aeiouy])\1l$',
				'[^l]lien',
				'^coa[dglx].',
				'[^gq]ua[^auieo]',
				'dnt$',
				'uity$',
				'ie(r|st)$',
			);

			// Single syllable prefixes and suffixes
			$arrPrefixSuffix = array(
				'`^un`',
				'`^fore`',
				'`ly$`',
				'`less$`',
				'`ful$`',
				'`ers?$`',
				'`ings?$`',
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

	} /* End of class */
} /* End of class-exists wrapper */