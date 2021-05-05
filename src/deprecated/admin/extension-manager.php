<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Reason: The class is deprecated.

/**
 * Represents the class that contains the available extensions for Yoast SEO.
 *
 * @deprecated 15.4
 * @codeCoverageIgnore
 */
class WPSEO_Extension_Manager {

	/**
	 * Adds an extension to the manager.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string               $extension_name The extension name.
	 * @param WPSEO_Extension|null $extension      The extension value object.
	 *
	 * @return void
	 */
	public function add( $extension_name, WPSEO_Extension $extension = null ) {
		_deprecated_function( __METHOD__, '15.4' );
	}

	/**
	 * Removes an extension from the manager.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension_name The name of the extension to remove.
	 *
	 * @return void
	 */
	public function remove( $extension_name ) {
		_deprecated_function( __METHOD__, '15.4' );
	}

	/**
	 * Returns the extension for the given extension name.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension_name The name of the extension to get.
	 *
	 * @return WPSEO_Extension|null The extension object or null when it doesn't exist.
	 */
	public function get( $extension_name ) {
		_deprecated_function( __METHOD__, '15.4' );

		return null;
	}

	/**
	 * Returns all set extension.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_Extension[] Array with the extensions.
	 */
	public function get_all() {
		_deprecated_function( __METHOD__, '15.4' );

		return [];
	}

	/**
	 * Checks if the plugin is activated within My Yoast.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param string $extension_name The extension name to check.
	 *
	 * @return bool True when the plugin is activated.
	 */
	public function is_activated( $extension_name ) {
		_deprecated_function( __METHOD__, '15.4' );

		return false;
	}
}
// phpcs:enable
