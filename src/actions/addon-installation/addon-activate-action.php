<?php

namespace Yoast\WP\SEO\Actions\Addon_Installation;

/**
 * Represents the endpoint for activating a specific Yoast Plugin on WordPress.
 */
class Addon_Activate_Action {

	/**
	 * The addon manager.
	 *
	 * @var \WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * Addon_Activate_Action constructor.
	 *
	 * @param \WPSEO_Addon_Manager $addon_manager The addon manager.
	 */
	public function __construct( \WPSEO_Addon_Manager $addon_manager ) {
		$this->addon_manager = $addon_manager;
	}

	/**
	 * @return bool
	 */
	public function can_activate() {
		return current_user_can( 'activate_plugins' );
	}

	/**
	 * Activates the plugin based on the given plugin file.
	 *
	 * @param string $plugin_slug The plugin slug to get download url for.
	 *
	 * @return bool True when activation is successful.
	 */
	public function activate_addon( $plugin_slug, $plugin_name ) {
		if ( ! $this->can_activate() ) {
			// todo: throw exception
		}

		if ( $this->addon_manager->is_installed( $plugin_slug ) ) {
			// Already installed.
			return;
		}

		$this->load_wordpress_classes();

		$plugin_file       = $this->get_plugin_file( $plugin_slug );
		$activation_result = $this->activate_plugin( $plugin_file );

		if ( $activation_result !== null && is_wp_error( $activation_result ) ) {
			// todo: throw exception
			return;
		}

		printf( '<p>Addon %s succcesfully activated!</p>', $plugin_name );

		return true;
	}

	/**
	 * Finds the plugin file.
	 *
	 * @param string $plugin_slug The plugin slug to search.
	 *
	 * @return boolean|string Plugin file when installed, False when plugin isn't installed.
	 **/
	protected function get_plugin_file( $plugin_slug ) {
		$plugins            = get_plugins();
		$plugin_files       = array_keys( $plugins );
		$target_plugin_file = array_search( $plugin_slug, $this->addon_manager->get_addon_filenames(), true );

		foreach ( $plugin_files as $plugin_file ) {
			if ( strpos( $plugin_file, $target_plugin_file ) !== false ) {
				return $plugin_file;
			}
		}

		return false;
	}

	/**
	 * Requires the files needed from WordPress itself.
	 *
	 * @codeCoverageIgnore Only loads a WordPress file.
	 *
	 * @return void
	 */
	protected function load_wordpress_classes() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
	}

	/**
	 * Runs the activation by using the WordPress activation routine.
	 *
	 * @param string $plugin_file The plugin to activate.
	 *
	 * @codeCoverageIgnore Contains WordPress specific logic.
	 *
	 * @return bool|WP_Error True when success, WP_Error when something went wrong.
	 */
	protected function activate_plugin( $plugin_file ) {
		return activate_plugin( $plugin_file );
	}
}
