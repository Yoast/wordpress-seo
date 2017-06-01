<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the values for a single Yoast Premium extension plugin.
 */
class WPSEO_Extension {

	/** @var array */
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
	 * @return string.
	 */
	public function get_title() {
		return $this->config['title'];
	}

	/**
	 * Returns URL to the page where the product can be bought.
	 *
	 * @return string
	 */
	public function get_buy_url() {
		return $this->config['buyUrl'];
	}

	/**
	 * Returns URL to the page with more info.
	 *
	 * @return string
	 */
	public function get_info_url() {
		return $this->config['infoUrl'];
	}

	/**
	 * Returns the image.
	 *
	 * @return string
	 */
	public function get_image() {
		return $this->config['image'];
	}

	/**
	 * Returns the buy button value if set, otherwise fallback to the title.
	 *
	 * @return string
	 */
	public function get_product_name() {
		if ( isset( $this->config['buy_button'] ) ) {
			return $this->config['buy_button'];
		}

		return $this->get_title();

	}

	/**
	 * Returns the benefits.
	 *
	 * @return array
	 */
	public function get_benefits() {
		return $this->config['benefits'];
	}
}
