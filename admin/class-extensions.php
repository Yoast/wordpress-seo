<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the class that contains the list of possible extensions for Yoast SEO.
 */
class WPSEO_Extensions {

	/** @var array */
	protected $extensions = array(
		'Yoast SEO Premium',
		'News SEO',
		'WooCommerce SEO',
		'Video SEO',
		'Local SEO',
	);

	/**
	 * Returns the set extensions.
	 *
	 * @return array
	 */
	public function get() {
		return $this->extensions;
	}

	/**
	 * Checks if the extension is valid.
	 *
	 * @param string $extension The extension to get the name for.
	 *
	 * @return bool
	 */
	public function is_valid( $extension ) {
		$extension_option = $this->get_option( $extension );

		return ( empty( $extension_option ) && $extension_option['status'] === 'valid' );
	}

	/**
	 * Invalidates the extension by removing its option.
	 *
	 * @param string $extension The extension to invalidate.
	 */
	public function invalidate( $extension ) {
		delete_option( $this->get_option( $extension ) );
	}

	/**
	 * Convert the extension to an option name.
	 *
	 * @param string $extension The extension to get the name for.
	 *
	 * @return string
	 */
	protected function get_option( $extension ) {
		return get_option( $extension );
	}

	/**
	 * Converts the extension to the required option name.
	 *
	 * @param string $extension The extension name to convert.
	 *
	 * @return string
	 */
	protected function get_option_name( $extension ) {
		return sanitize_title_with_dashes( $extension. '_', null, 'save' ) . 'license';
	}
}
