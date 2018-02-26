<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to implement a React modal.
 */
class Yoast_Modal {

	private static $config = array();

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_footer', array( $this, 'print_localized_config' ) );
	}

	/**
	 * Enqueues the assets needed for the modal.
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'yoast-modal' );
	}

	/**
	 * Prints the modals configuration.
	 */
	public function print_localized_config() {
		$config = self::$config;
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'yoast-modal', 'yoastModalConfig', $config );
	}

	/**
	 * Adds a single modal configuration to the modals configuration.
	 */
	public static function add( $args ) {
		$defaults = self::get_defaults();

		$single   = array_replace_recursive( $defaults, $args );
		self::$config[] = $single;
	}

	/**
	 * Gets the modals configuration.
	 */
	public function get_config() {
		return self::$config;
	}

	/**
	 * Gets the default config for a modal.
	 *
	 * @return array The modal default config.
	 */
	public static function get_defaults() {
		$config = array(
			'hook'   => '',
			'hide'   => 'body',
			'labels' => array(
				'open'  => __( 'Open a nice modal', 'wordpress-seo' ),
				'close' => __( 'Close this nice modal', 'wordpress-seo' ),
				'modal' => __( 'Hello, I\'m a nice modal', 'wordpress-seo' ),
			),
		);

		return $config;
	}
}
