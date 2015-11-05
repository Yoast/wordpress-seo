<?php
/**
 * @package WPSEO\Admin\Import
 */

/**
 * Setting the hooks for importing the data the Robots Meta plugin
 */
class WPSEO_Import_Robots_Meta_Hooks extends WPSEO_Import_Hooks {

	/**
	 * @var string The main plugin file.
	 */
	protected $plugin_file = 'robots-meta/robots-meta.php';

	/**
	 * @var string The GET parameter for deactivating the plugin.
	 */
	protected $deactivation_listener = 'deactivate_robots_meta';

	/**
	 * Throw a notice to import settings.
	 *
	 * @since 3.0
	 */
	public function show_import_settings_notice() {
		$url = add_query_arg( array( '_wpnonce' => wp_create_nonce( 'wpseo-import' ) ), admin_url( 'admin.php?page=wpseo_tools&tool=import-export&import=1&importrobotsmeta=1#top#import-other' ) );
		echo '<div class="error"><p>', sprintf( esc_html__( 'The plugin Robots-Meta has been detected. Do you want to %simport its settings%s.', 'wordpress-seo' ), sprintf( '<a href="%s">', esc_url( $url ) ), '</a>' ), '</p></div>';
	}

	/**
	 * Throw a notice to inform the user that the plugin has been deactivated
	 *
	 * @since 3.0
	 */
	public function show_deactivate_notice() {
		echo '<div class="updated"><p>', esc_html__( 'Robots-Meta has been deactivated', 'wordpress-seo' ), '</p></div>';
	}
}
