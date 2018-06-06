<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class Meta_Values {

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
	 * @param string	  $permalink	The permalink.
	 * @param int 	 $readability_score	The readability score.
	 * @param string $canonical		    The canonical URL.
	 * @param bool 	 $is_cornerstone    Whether or not it's a cornerstone article. Defaults to false.
	 * @param string $breadcrumb_title  The breadcrumb title.
	 */
	public function __construct( $title, $description, $permalink, $readability_score, $is_cornerstone = false, $canonical = null, $breadcrumb_title = null ) {
		if ( ! WPSEO_Validator::is_non_empty_string( $title ) ) {
			throw new \InvalidArgumentException( 'Title must be a string and cannot be empty' );
		}

		$this->title = $title;

		if ( ! empty( $description ) && ! WPSEO_Validator::is_string( $description ) ) {
			throw new \InvalidArgumentException( 'Description must be a valid string.' );
		}

		$this->description = $description;


		if ( ! WPSEO_Validator::is_non_empty_string( $permalink ) ) {
			throw new \InvalidArgumentException( 'Permalink must be a string and cannot be empty.' );
		}

		$this->permalink = $permalink;

		if ( ! empty( $readability_score ) && ! WPSEO_Validator::is_integer( $readability_score ) ) {
			throw new \InvalidArgumentException( 'Canonical must be a valid string.' );
		}

		$this->readability_score = $readability_score;

		if ( ! empty( $canonical ) && ! WPSEO_Validator::is_string( $canonical ) ) {
			throw new \InvalidArgumentException( 'Canonical must be a valid string.' );
		}

		$this->canonical = $canonical;

		if ( ! empty( $breadcrumb_title ) && ! WPSEO_Validator::is_string( $breadcrumb_title ) ) {
			throw new \InvalidArgumentException( 'Breadcrumb title must be a valid string.' );
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
			'title'	 		   => $this->title,
			'description' 	   => $this->description,
			'permalink' 	   => $this->permalink,
			'canonical' 	   => $this->canonical,
			'breadcrumb_title' => $this->breadcrumb_title,
		);
	}
}
