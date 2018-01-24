<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the class that contains the available extensions for Yoast SEO.
 */
class WPSEO_Extension_Manager {

	/** The transient key to save the cache in */
	const TRANSIENT_CACHE_KEY = 'wpseo_license_active_extensions';

	/** @var WPSEO_Extension[] */
	protected $extensions = array();

	/** @var array List of active plugins */
	static protected $active_extensions;

	/**
	 * Adds an extension to the manager.
	 *
	 * @param string          $extension_name The extension name.
	 * @param WPSEO_Extension $extension      The extension value object.
	 *
	 * @return void
	 */
	public function add( $extension_name, WPSEO_Extension $extension = null ) {
		$this->extensions[ $extension_name ] = $extension;
	}

	/**
	 * Removes an extension from the manager.
	 *
	 * @param string $extension_name The name of the extension to remove.
	 *
	 * @return void
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
	 * Checks if the plugin is activated within My Yoast.
	 *
	 * @param string $extension_name The extension name to check.
	 *
	 * @return bool True when the plugin is activated.
	 */
	public function is_activated( $extension_name ) {
		if ( self::$active_extensions === null ) {
			// Force re-check on license & dashboard pages.
			$current_page = $this->get_current_page();

			// Check whether the licenses are valid or whether we need to show notifications.
			$exclude_cache = ( $current_page === 'wpseo_licenses' || $current_page === 'wpseo_dashboard' );

			// Fetch transient data on any other page.
			if ( ! $exclude_cache ) {
				self::$active_extensions = $this->get_cached_extensions();
			}

			// If the active extensions is still NULL, we need to set it.
			if ( ! is_array( self::$active_extensions ) ) {
				self::$active_extensions = $this->retrieve_active_extensions();

				$this->set_cached_extensions( self::$active_extensions );
			}
		}

		return in_array( $extension_name, self::$active_extensions, true );
	}

	/**
	 * Retrieves the active extensions via an external request.
	 *
	 * @return array Array containing the active extensions.
	 */
	protected function retrieve_active_extensions() {
		return (array) apply_filters( 'yoast-active-extensions', array() );
	}

	/**
	 * Returns the current page.
	 *
	 * @return string The current page.
	 */
	protected function get_current_page() {
		return filter_input( INPUT_GET, 'page' );
	}

	/**
	 * Gets a cached list of active extensions.
	 *
	 * @return boolean|array The cached extensions.
	 */
	protected function get_cached_extensions() {
		return get_transient( self::TRANSIENT_CACHE_KEY );
	}

	/**
	 * Sets the active extensions transient for the set duration.
	 *
	 * @param array $extensions The extensions to add.
	 * @param int   $duration   The duration that the list of extensions needs to remain cached.
	 *
	 * @return void
	 */
	protected function set_cached_extensions( $extensions, $duration = DAY_IN_SECONDS ) {
		set_transient( self::TRANSIENT_CACHE_KEY, $extensions, $duration );
	}
}
