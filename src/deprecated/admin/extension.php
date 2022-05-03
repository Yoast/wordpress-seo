<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Reason: The class is deprecated.

/**
 * Represents the values for a single Yoast Premium extension plugin.
 *
 * @deprecated 15.4
 */
class WPSEO_Extension {

	/**
	 * Holds the extension config.
	 *
	 * @var array
	 */
	protected $config = [];

	/**
	 * WPSEO_Extension constructor.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param array $config The config to use.
	 */
	public function __construct( array $config ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		$this->config = $config;
	}

	/**
	 * Returns the product title.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The set title.
	 */
	public function get_title() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $this->config['title'];
	}

	/**
	 * Returns the product title to display.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The title to display on the license page.
	 */
	public function get_display_title() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return empty( $this->config['display_title'] ) ? $this->config['title'] : $this->config['display_title'];
	}

	/**
	 * Returns URL to the page where the product can be bought.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The buy url.
	 */
	public function get_buy_url() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $this->config['buyUrl'];
	}

	/**
	 * Returns URL to the page with more info.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The url to the info page.
	 */
	public function get_info_url() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $this->config['infoUrl'];
	}

	/**
	 * Returns the image.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The image.
	 */
	public function get_image() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $this->config['image'];
	}

	/**
	 * Returns the buy button value if set, otherwise fallback to the title.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The buy button.
	 */
	public function get_buy_button() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		if ( isset( $this->config['buy_button'] ) ) {
			return $this->config['buy_button'];
		}

		return $this->config['title'];
	}

	/**
	 * Returns the benefits.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return array The array with benefits.
	 */
	public function get_benefits() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $this->config['benefits'];
	}
}
// phpcs:enable
