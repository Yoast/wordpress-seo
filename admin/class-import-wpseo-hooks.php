<?php
/**
 * @package WPSEO\Admin\Import
 */

/**
 * Setting the hooks for importing the data from other SEO plugins
 *
 */
class WPSEO_Import_WPSEO_Hooks {

	/**
	 * @var string The main plugin file.
	 */
	private $plugin_file = 'wpseo/wpseo.php';

	/**
	 * Adding the hooks to show import/deactivate message when needed.
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'show_import_message' ) );
		add_action( 'admin_init', array( $this, 'show_deactivate_message' ) );
	}

	/**
	 * Handle deactivation & import of wpSEO data
	 *
	 * @since 3.0
	 */
	public function show_import_message() {
		if ( filter_input( INPUT_GET, 'page' ) === null ||  filter_input( INPUT_GET, 'page' ) !== 'wpseo_tools' && $this->is_active() ) {
			add_action( 'admin_notices', array( $this, 'show_import_settings_notice' ) );
		}
	}

	/**
	 * Throw a notice to import wpSEO.
	 *
	 * @since 3.0
	 */
	public function show_import_settings_notice() {
		$url = add_query_arg( array( '_wpnonce' => wp_create_nonce( 'wpseo-import' ) ), admin_url( 'admin.php?page=wpseo_tools&tool=import-export&import=1&importwpseo=1#top#import-seo' ) );
		echo '<div class="error"><p>', sprintf( esc_html__( 'The plugin wpSEO has been detected. Do you want to %simport its settings%s?', 'wordpress-seo' ), sprintf( '<a href="%s">', esc_url( $url ) ), '</a>' ), '</p></div>';
	}

	/**
	 * Handle deactivation of wpSEO plugin
	 *
	 * @since 3.0
	 */
	public function show_deactivate_message() {
		if ( filter_input( INPUT_GET, 'deactivate_wpseo' ) === '1' && $this->is_active() ) {
			// Deactivate AIO.
			deactivate_plugins( $this->plugin_file );

			// Show notice that aioseo has been deactivated.
			add_action( 'admin_notices', array( $this, 'show_deactivate_notice' ) );

			// Clean up the referrer url for later use.
			if ( isset( $_SERVER['REQUEST_URI'] ) ) {
				$_SERVER['REQUEST_URI'] = remove_query_arg( array( 'deactivate_wpseo' ), sanitize_text_field( $_SERVER['REQUEST_URI'] ) );
			}
		}
	}

	/**
	 * Throw a notice to inform the user wpSEO has been deactivated
	 *
	 * @since 3.0
	 */
	function show_deactivate_notice() {
		echo '<div class="updated"><p>', esc_html__( 'wpSEO has been deactivated', 'wordpress-seo' ), '</p></div>';
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool
	 */
	private function is_active() {
		return is_plugin_active( $this->plugin_file );
	}

}
