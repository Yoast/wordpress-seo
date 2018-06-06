<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class Twitter {
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
	 * Twitter constructor.
	 *
	 * @param string $title 	  The OpenGraph title.
	 * @param string $description The OpenGraph description.
	 * @param string $image 	  The OpenGraph image.
	 *
	 * @throws Exception
	 */
	public function __construct( $title, $description, $image ) {
		if ( ! WPSEO_Validator::is_string( $title ) ) {
			throw new \Exception( "Title must be a valid, non-empty string." );
		}

		$this->title = $title;

		if ( ! WPSEO_Validator::is_string( $description ) ) {
			throw new \Exception( "Description must be a valid, non-empty string." );
		}

		$this->description = $description;

		if ( ! WPSEO_Validator::is_string( $image ) ) {
			throw new \Exception( "Image must be a valid, non-empty string." );
		}

		$this->image = $image;
	}

	/**
	 * Returns an array representation of the Twitter object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'twitter_title' 	  => $this->title,
			'twitter_description' => $this->description,
			'twitter_image' 	  => $this->image,
		);
	}
}
