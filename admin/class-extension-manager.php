<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the class that contains the available extensions for Yoast SEO.
 */
class WPSEO_Extension_Manager {

	/** @var WPSEO_Extension[] */
	protected $extensions = array();

	/**
	 * Adds an extension to the manager.
	 *
	 * @param string          $extension_name The extension name.
	 * @param WPSEO_Extension $extension      The extension value object.
	 */
	public function add( $extension_name, WPSEO_Extension $extension = null ) {
		$this->extensions[ $extension_name ] = $extension;
	}

	/**
	 * Removes an extension from the manager.
	 *
	 * @param string $extension_name The name of the extension to remove.
	 */
	public function remove( $extension_name ) {
		if ( array_key_exists( $extension_name, $this->extensions ) ) {
			unset( $this->extensions[ $extension_name ] );
		}
	}

	/**
	 * Returns the extension for the given extension name.
	 *
	 * @param string $extension_name The name of the extension to get.
	 *
	 * @return null|WPSEO_Extension The extension object or null when it doesn't exist.
	 */
	public function get( $extension_name ) {
		if ( array_key_exists( $extension_name, $this->extensions ) ) {
			return $this->extensions[ $extension_name ];
		}

		return null;
	}

	/**
	 * Returns all set extension.
	 *
	 * @return WPSEO_Extension[] Array with the extensions.
	 */
	public function get_all() {
		return $this->extensions;
	}

	/**
	 * Checks if the plugin is activated.

	 * @param string $extension_name The extension name to check.
	 *
	 * @return bool True when the plugin is activated.
	 */
	public function is_activated( $extension_name ) {
		static $active_extensions;

		if ( ! $active_extensions ) {
			$active_extensions = apply_filters( 'yoast-active-extensions', array() );
		}

		return in_array( $extension_name, $active_extensions, true );
	}
}
