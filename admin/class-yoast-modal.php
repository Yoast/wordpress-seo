<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to implement a React modal.
 */
class Yoast_Modal {

	public function __construct( $config = array() ) {
		$this->config = $config;
		// Todo: should use the action admin_enqueue_scripts
		add_action( 'admin_footer', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues the assets needed for the modal.
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		// $asset_manager->register_assets();
		$asset_manager->enqueue_script( 'yoast-modal' );

		$defaults = $this->get_defaults();
		$config   = wp_parse_args( $this->config, $defaults );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'yoast-modal', 'yoastModalConfig', $config );
	}

	/**
	 * Get the default config for the modal.
	 *
	 * @return array The modal default config.
	 */
	public function get_defaults() {
		$config = array(
			'hook'   => '#wpseo-tab-add-keyword-modal',
			'hide'   => '#wpwrap',
			'labels' => array(
				'open'  => __( 'Open a nice modal', 'wordpress-seo' ),
				'close' => __( 'Close this nice modal', 'wordpress-seo' ),
				'modal' => __( 'Hello, I\'m a nice modal', 'wordpress-seo' ),
			),
		);

		return $config;
	}
}
