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
		if ( ! WPSEO_Validator::is_string( $keyword ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $keyword, 'keyword', 'string' );
		}

		$this->keyword = $keyword;

		if ( ! WPSEO_Validator::is_integer( $score ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $score, 'score', 'integer' );
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
