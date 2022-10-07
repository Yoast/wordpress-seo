<?php

namespace Yoast\WP\SEO\Values\Schema;

/**
 * Class Image
 *
 * Value object for a schema Image
 */
class Image {

	/**
	 * The source of the image.
	 *
	 * @var string
	 */
	private $src;

	/**
	 * The ID of the image.
	 *
	 * @var int|null
	 */
	private $id;

	/**
	 * The width of the image (in pixels).
	 *
	 * @var int|null
	 */
	private $width;

	/**
	 * The height of the image (in pixels).
	 *
	 * @var int|null
	 */
	private $height;

	/**
	 * Construct an Image.
	 *
	 * @param string   $src The source of the image.
	 * @param int|null $id The ID of the image.
	 * @param int|null $width The width of the image (in pixels).
	 * @param int|null $height The height of the image (in pixels).
	 */
	public function __construct( $src, $id = null, $width = null, $height = null ) {
		$this->src    = $src;
		$this->id     = $id;
		$this->width  = $width;
		$this->height = $height;
	}

	/**
	 * Get the src attribute.
	 *
	 * @return string
	 */
	public function get_src() {
		return $this->src;
	}

	/**
	 * Set the src attribute.
	 *
	 * @param string $src The new src attribute.
	 * @return void
	 */
	public function set_src( $src ) {
		$this->src = $src;
	}

	/**
	 * Get the id attribute.
	 *
	 * @return int|null
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Set the id attribute.
	 *
	 * @param int $id The new id attribute.
	 * @return void
	 */
	public function set_id( $id ) {
		$this->id = $id;
	}

	/**
	 * Check whether this image has an id set.
	 *
	 * @return bool True when this image has an id set.
	 */
	public function has_id() {
		return isset( $this->id );
	}

	/**
	 * Check whether an image has a registered size.
	 *
	 * @return bool True if width and height are both set, false otherwise.
	 */
	public function has_size() {
		return ! \is_null( $this->width ) && ! \is_null( $this->height );
	}

	/**
	 * Get the image width.
	 *
	 * @return int|null The image width, null if it does not exist.
	 */
	public function get_width() {
		return $this->width;
	}

	/**
	 * Get the image height.
	 *
	 * @return int|null The image height, null if it does not exist.
	 */
	public function get_height() {
		return $this->height;
	}
}
