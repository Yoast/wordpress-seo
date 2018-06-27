<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class WPSEO_Meta_Values_Validator {

	/**
	 * @var string
	 */
	private $title;

	/**
	 * @var string
	 */
	private $description;

	/**
	 * @var string
	 */
	private $permalink;

	/**
	 * @var int
	 */
	private $readability_score;

	/**
	 * @var bool
	 */
	private $is_cornerstone;

	/**
	 * @var string
	 */
	private $canonical;

	/**
	 * @var string
	 */
	private $breadcrumb_title;

	/**
	 * Meta Values constructor.
	 *
	 * @param string $title             The title.
	 * @param string $description       The description.
	 * @param string $permalink			The permalink.
	 * @param int 	 $readability_score	The readability score.
	 * @param string $canonical		    The canonical URL.
	 * @param bool 	 $is_cornerstone    Whether or not it's a cornerstone article. Defaults to false.
	 * @param string $breadcrumb_title  The breadcrumb title.
	 */
	public function __construct( $title, $description, $permalink, $readability_score, $is_cornerstone = false, $canonical = null, $breadcrumb_title = null ) {
		if ( ! WPSEO_Validator::is_non_empty_string( $title ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $title, 'title' );
		}

		$this->title = $title;

		if ( ! empty( $description ) && ! WPSEO_Validator::is_string( $description ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $description, 'description' );
		}

		$this->description = $description;

		if ( ! empty( $permalink ) && ! WPSEO_Validator::is_string( $permalink ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $permalink, 'permalink' );
		}

		$this->permalink = $permalink;

		if ( ! empty( $readability_score ) && ! WPSEO_Validator::is_integer( $readability_score ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $readability_score, 'readability_score' );
		}

		$this->readability_score = $readability_score;

		if ( ! empty( $is_cornerstone ) && ! WPSEO_Validator::is_boolean( $is_cornerstone ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $is_cornerstone, 'is_cornerstone' );
		}

		$this->is_cornerstone = $is_cornerstone;

		if ( ! empty( $canonical ) && ! WPSEO_Validator::is_string( $canonical ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $canonical, 'canonical' );
		}

		$this->canonical = $canonical;

		if ( ! empty( $breadcrumb_title ) && ! WPSEO_Validator::is_string( $breadcrumb_title ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $breadcrumb_title, 'breadcrumb_title' );
		}

		$this->breadcrumb_title = $breadcrumb_title;
	}

	/**
	 * Returns an array representation of the Meta Values object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'title'	 		   	=> $this->title,
			'metadesc' 	   		=> $this->description,
			'permalink' 	   	=> $this->permalink,
			'readability_score' => $this->readability_score,
			'is_cornerstone' 	=> $this->is_cornerstone,
			'canonical' 	   	=> $this->canonical,
			'breadcrumb_title' 	=> $this->breadcrumb_title,
		);
	}
}
