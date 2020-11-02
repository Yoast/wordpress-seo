<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Reason: The class is deprecated.

/**
 * Represents the class that contains the list of possible extensions for Yoast SEO.
 *
 * @deprecated 15.4
 * @codeCoverageIgnore
 */
class WPSEO_Extensions {

	/**
	 * Checks if the plugin has been installed.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension The name of the plugin to check.
	 *
	 * @return bool Returns true when installed.
	 */
	public function is_installed( $extension ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return false;
	}

	/**
	 * Invalidates the extension by removing its option.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension The extension to invalidate.
	 */
	public function invalidate( $extension ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );
	}

	/**
	 * Checks if the extension is valid.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension The extension to get the name for.
	 *
	 * @return bool Returns true when valid.
	 */
	public function is_valid( $extension ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return false;
	}

	/**
	 * Returns the set extensions.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return array All the extension names.
	 */
	public function get() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return [];
	}
}
// phpcs:enable
