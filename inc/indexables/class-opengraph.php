<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class OpenGraph {

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
	private $image;

	/**
	 * OpenGraph constructor.
	 *
	 * @param string $title 	  The OpenGraph title.
	 * @param string $description The OpenGraph description.
	 * @param string $image 	  The OpenGraph image.
	 *
	 * @throws Exception
	 */
	public function __construct( $title, $description, $image ) {
		if ( ! WPSEO_Validator::is_non_empty_string( $title ) ) {
			throw new \Exception( "Title must be a valid, non-empty string." );
		}

		$this->title = $title;

		if ( ! WPSEO_Validator::is_non_empty_string( $description ) ) {
			throw new \Exception( "Description must be a valid, non-empty string." );
		}

		$this->description = $description;

		if ( ! empty( $image ) && ! WPSEO_Validator::is_string( $image ) ) {
			throw new \Exception( "Image must be a valid string." );
		}

		$this->image = $image;
	}

	/**
	 * Returns an array representation of the OpenGraph object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'og_title' 		 => $this->title,
			'og_description' => $this->description,
			'og_image' 		 => $this->image,
		);
	}
}
