<?php

namespace Yoast\WP\SEO\Actions\Addon_Installation;

/**
 * Represents the endpoint for downloading and installing a zip-file from MyYoast.
 */
class Addon_Install_Action {

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
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @codeCoverageIgnore Only contains a WordPress function.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_install_plugins() {
		return current_user_can( 'install_plugins' );
	}

	/**
	 * Installs the plugin based on the given slug.
	 *
	 * @param string $plugin_slug  The plugin slug to install.
	 * @param string $download_url The plugin download URL.
	 *
	 * @return bool True when install is successful.
	 */
	public function install_addon( $plugin_slug, $download_url ) {
		if ( $this->is_installed( $plugin_slug ) ) {
			return true;
		}

		$this->load_wordpress_classes();

		$install_result = $this->install( $download_url );
		if ( is_wp_error( $install_result ) ) {
			// todo: Throw exception.
			return false;
		}

		return $install_result;
	}

	/**
	 * Requires the files needed from WordPress itself.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function load_wordpress_classes() {
		if ( ! class_exists( 'WP_Upgrader' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		}

		if ( ! class_exists( 'Plugin_Upgrader' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
		}

		if ( ! class_exists( 'WP_Upgrader_Skin' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php';
		}

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
	}

	/**
	 * Checks is a plugin is installed.
	 *
	 * @param string $plugin_slug The plugin to check.
	 *
	 * @return bool True when plugin is installed.
	 */
	protected function is_installed( $plugin_slug ) {
		return $this->get_plugin_file( $plugin_slug ) !== false;
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
	 * Runs the installation by using the WordPress installation routine.
	 *
	 * @param string $plugin_download The url to the download.
	 *
	 * @codeCoverageIgnore Contains WordPress specific logic.
	 *
	 * @return bool|WP_Error True when success, WP_Error when something went wrong.
	 */
	protected function install( $plugin_download ) {
		$plugin_upgrader = new \Plugin_Upgrader();

		return $plugin_upgrader->install( $plugin_download );
	}
}
