<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the values for a single Yoast Premium extension plugin.
 */
class WPSEO_Extension {

	/**
	 * @var array
	 */
	protected $config = array();

	/**
	 * WPSEO_Extension constructor.
	 *
	 * @param array $config The config to use.
	 */
	public function __construct( array $config ) {
		$this->config = $config;
	}

	/**
	 * Returns the product title.
	 *
	 * @return string The set title.
	 */
	public function get_title() {
		return $this->config['title'];
	}

	/**
	 * Returns the product title to display.
	 *
	 * @return string The title to display on the license page.
	 */
	public function get_display_title() {
		return empty( $this->config['display_title'] ) ? $this->get_title() : $this->config['display_title'];
	}

	/**
	 * Returns URL to the page where the product can be bought.
	 *
	 * @return string The buy url.
	 */
	public function get_buy_url() {
		return $this->config['buyUrl'];
	}

	/**
	 * Returns URL to the page with more info.
	 *
	 * @return string The url to the info page.
	 */
	public function get_info_url() {
		return $this->config['infoUrl'];
	}

	/**
	 * Returns the image.
	 *
	 * @return string The image.
	 */
	public function get_image() {
		return $this->config['image'];
	}

	/**
	 * Returns the buy button value if set, otherwise fallback to the title.
	 *
	 * @return string The buy button.
	 */
	public function get_buy_button() {
		if ( isset( $this->config['buy_button'] ) ) {
			return $this->config['buy_button'];
		}

		return $this->get_title();
	}

	/**
	 * Returns the benefits.
	 *
	 * @return array The array with benefits.
	 */
	public function get_benefits() {
		return $this->config['benefits'];
	}
}
