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
		if ( ! empty( $title ) && ! WPSEO_Validator::is_string( $title ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $title, 'title' );
		}

		$this->title = $title;

		if ( ! empty( $description ) && ! WPSEO_Validator::is_string( $description ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $description, 'description' );
		}

		$this->description = $description;

		if ( ! empty( $image ) && ! WPSEO_Validator::is_string( $image ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $image, 'image' );
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
			'opengraph-title' 		 => $this->title,
			'opengraph-description'  => $this->description,
			'opengraph-image' 		 => $this->image,
		);
	}
}
