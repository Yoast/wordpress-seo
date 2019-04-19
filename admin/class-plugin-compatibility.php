<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Plugin_Compatibility
 */

/**
 * Class WPSEO_Plugin_Compatibility.
 */
class WPSEO_Plugin_Compatibility {

	/**
	 * @var string
	 */
	protected $current_wpseo_version;

	/**
	 * @var WPSEO_Plugin_Availability
	 */
	protected $availability_checker;

	/**
	 * @var array
	 */
	protected $installed_plugins;

	/**
	 * WPSEO_Plugin_Compatibility constructor.
	 *
	 * @param string     $version              The version to check against.
	 * @param null|class $availability_checker The checker to use.
	 */
	public function __construct( $version, $availability_checker = null ) {
		// We trim off the patch version, as this shouldn't break the comparison.
		$this->current_wpseo_version = $this->get_major_minor_version( $version );
		$this->availability_checker  = $this->retrieve_availability_checker( $availability_checker );
		$this->installed_plugins     = $this->availability_checker->get_installed_plugins();
	}

	/**
	 * Retrieves the availability checker.
	 *
	 * @param null|object $checker The checker to set.
	 *
	 * @return WPSEO_Plugin_Availability The checker to use.
	 */
	private function retrieve_availability_checker( $checker ) {
		if ( is_null( $checker ) || ! is_object( $checker ) ) {
			$checker = new WPSEO_Plugin_Availability();
			$checker->register();
		}

		return $checker;
	}

	/**
	 * Wraps the availability checker's get_installed_plugins method.
	 *
	 * @return array Array containing all the installed plugins.
	 */
	public function get_installed_plugins() {
		return $this->installed_plugins;
	}

	/**
	 * Creates a list of installed plugins and whether or not they are compatible.
	 *
	 * @return array Array containing the installed plugins and compatibility.
	 */
	public function get_installed_plugins_compatibility() {
		foreach ( $this->installed_plugins as $key => $plugin ) {

			$this->installed_plugins[ $key ]['compatible'] = $this->is_compatible( $key );
		}

		return $this->installed_plugins;
	}

	/**
	 * Checks whether or not a plugin is compatible.
	 *
	 * @param string $plugin The plugin to look for and match.
	 *
	 * @return bool Whether or not the plugin is compatible.
	 */
	public function is_compatible( $plugin ) {
		$plugin = $this->availability_checker->get_plugin( $plugin );

		// If we are not syncing versions, we are always compatible.
		if ( ! isset( $plugin['version_sync'] ) || $plugin['version_sync'] !== true ) {
			return true;
		}

		$plugin_version = $this->availability_checker->get_version( $plugin );
		return $this->get_major_minor_version( $plugin_version ) === $this->current_wpseo_version;
	}

	/**
	 * Gets the major/minor version of the plugin for easier comparing.
	 *
	 * @param string $version The version to trim.
	 *
	 * @return string The major/minor version of the plugin.
	 */
	protected function get_major_minor_version( $version ) {
		return substr( $version, 0, 3 );
	}
}
