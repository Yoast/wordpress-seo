<?php
/**
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents an admin banner.
 */
class WPSEO_Admin_Banner {

	/** @var string */
	private $url;

	/** @var string */
	private $image;

	/** @var integer */
	private $width;

	/** @var integer */
	private $height;

	/** @var string */
	private $alt;

	/**
	 * Sets the attributes for this object.
	 *
	 * @param string  $url    The URL where the banner links to.
	 * @param string  $image  The image filename.
	 * @param integer $width  The width of the image.
	 * @param integer $height The height of the image.
	 * @param string  $alt    The alt text for the image.
	 */
	public function __construct( $url, $image, $width, $height, $alt = '' ) {
		$this->url    = $url;
		$this->image  = $image;
		$this->alt    = $alt;
		$this->width  = $width;
		$this->height = $height;
	}

	/**
	 * Returns the set url.
	 *
	 * @return string
	 */
	public function get_url() {
		return $this->url;
	}

	/**
	 * Returns the image.
	 *
	 * @return string
	 */
	public function get_image() {
		return $this->image;
	}

	/**
	 * Returns the alt-text.
	 *
	 * @return string
	 */
	public function get_alt() {
		return $this->alt;
	}

	/**
	 * Returns the width.
	 *
	 * @return string
	 */
	public function get_width() {
		return $this->width;
	}

	/**
	 * Returns the height.
	 *
	 * @return string
	 */
	public function get_height() {
		return $this->height;
	}
}
