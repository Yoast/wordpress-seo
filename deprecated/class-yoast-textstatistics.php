<?php
/**
 * @package WPSEO\Admin
 *
 * @deprecated 3.0 Removed.
 */

_deprecated_file( __FILE__, 'WPSEO 3.0' );

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
		_deprecated_constructor( __CLASS__, 'WPSEO 3.0' );
	}

	/**
	 * @deprecated 3.0 Removed, use javascript instead.
	 *
	 * @param  string $strText Text to be checked.
	 *
	 * @return int|float
	 */
	public function flesch_kincaid_reading_ease( $strText ) {
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

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
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

		return 0;
	}
}
