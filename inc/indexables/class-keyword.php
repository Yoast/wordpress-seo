<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class WPSEO_Keyword {

	/**
	 * @var string
	 */
	private $keyword;

	/**
	 * @var int
	 */
	private $score;

	/**
	 * Object Type constructor.
	 *
	 * @param string $keyword The keyword.
	 * @param int 	 $score   The keyword score.
	 *
	 * @throws Exception
	 */
	public function __construct( $keyword, $score ) {
		if ( ! empty( $keyword ) && ! WPSEO_Validator::is_string( $keyword ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $keyword, 'keyword' );
		}

		$this->keyword = $keyword;

		if ( ! empty( $score ) && ! WPSEO_Validator::is_integer( $score ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $score, 'score' );
		}

		$this->score = $score;
	}

	/**
	 * Returns an array representation of the ObjectType object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'primary_focus_keyword'		  => $this->keyword,
			'primary_focus_keyword_score' => $this->score,
		);
	}
}
