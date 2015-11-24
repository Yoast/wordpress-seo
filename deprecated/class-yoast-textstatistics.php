<?php
/**
 * @package WPSEO\Admin
 *
 * @deprecated 3.0 Removed.
 */

/**
 * @deprecated 3.0 Removed, use javascript instead.
 */
class Yoast_TextStatistics {
	/**
	 * @var string $strEncoding Used to hold character encoding to be used by object, if set
	 *
	 * @deprecated 3.0 Removed.
	 */
	protected $strEncoding = '';
	/**
	 * @var string $blnMbstring Efficiency: Is the MB String extension loaded ?
	 *
	 * @deprecated 3.0 Removed.
	 */
	protected $blnMbstring = true;
	/**
	 * @var bool $normalize Should the result be normalized ?
	 *
	 * @deprecated 3.0 Removed.
	 */
	public $normalize = true;

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strEncoding Optional character encoding.
	 */
	public function __construct( $strEncoding = '' ) {
		_deprecated_constructor( 'Yoast_TextStatistics', 'WPSEO 3.0' );
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param  string $strText Text to be checked.
	 *
	 * @return int|float
	 */
	public function flesch_kincaid_reading_ease( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::flesch_kincaid_reading_ease', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param  string $strText Text to be measured.
	 *
	 * @return int
	 */
	public function text_length( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::text_length', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be measured.
	 *
	 * @return int
	 */
	public function letter_count( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::letter_count', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be transformed.
	 *
	 * @return string
	 */
	protected function clean_text( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::clean_text', 'WPSEO 3.0' );

		return '';
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be transformed.
	 *
	 * @return string
	 */
	protected function lower_case( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::lower_case', 'WPSEO 3.0' );

		return '';
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be transformed.
	 *
	 * @return string
	 */
	protected function upper_case( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::upper_case', 'WPSEO 3.0' );

		return '';
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param   string $strText Text to be measured.
	 *
	 * @return int
	 */
	public function sentence_count( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::sentence_count', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param  string $strText Text to be measured.
	 *
	 * @return int
	 */
	public function word_count( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::word_count', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be measured.
	 *
	 * @return int|float
	 */
	public function average_words_per_sentence( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::average_words_per_sentence', 'WPSEO 3.0' );

		return 0;
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strText Text to be measured.
	 *
	 * @return int|float
	 */
	public function average_syllables_per_word( $strText ) {
		_deprecated_function( 'Yoast_TextStatistics::average_syllables_per_word', 'WPSEO 3.0' );

		return 0;
	}
	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param string $strWord Word to be measured.
	 *
	 * @return int
	 */
	public function syllable_count( $strWord ) {
		_deprecated_function( 'Yoast_TextStatistics::syllable_count', 'WPSEO 3.0' );

		return 0;
	}
	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param    int|float $score Initial score.
	 * @param    int       $min   Minimum score allowed.
	 * @param    int       $max   Maximum score allowed.
	 * @param    int       $dps   Round to # decimals.
	 *
	 * @return    int|float
	 */
	public function normalize_score( $score, $min, $max, $dps = 1 ) {
		_deprecated_function( 'Yoast_TextStatistics::normalize_score', 'WPSEO 3.0' );

		return 0;
	}
}
