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
	private $breadcrumb_title;

	/**
	 * @var string
	 */
	private $canonical;

	/**
	 * Meta Values constructor.
	 *
	 * @param string $title            The title.
	 * @param string $description      The description.
	 * @param string $canonical		   The canonical URL.
	 * @param string $breadcrumb_title The breadcrumb title.
	 *
	 */
	public function __construct( $title, $description, $canonical = null, $breadcrumb_title = null ) {
		if ( ! WPSEO_Validator::is_non_empty_string( $title ) ) {
			throw new \InvalidArgumentException( 'Title must be a string and cannot be empty' );
		}

		$this->title = $title;

		if ( ! empty( $description ) && ! WPSEO_Validator::is_string( $description ) ) {
			throw new \InvalidArgumentException( 'Description must be a valid string.' );
		}

		$this->description = $description;

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
			'canonical' 	   => $this->canonical,
			'breadcrumb_title' => $this->breadcrumb_title,
		);
	}
}
