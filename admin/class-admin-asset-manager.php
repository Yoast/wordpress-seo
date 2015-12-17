<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Created by PhpStorm.
 * User: boblinthorst
 * Date: 16/12/15
 * Time: 14:21
 */
class WPSEO_Admin_Asset_Manager {


	/**
	 *  Prefix for naming the assets.
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * WPSEO_Admin_Asset_Manager constructor.
	 */
	public function __construct() {
	}

	/**
	 * Enqueues scripts.
	 *
	 * @param string $script The name of the script to enqueue.
	 */
	public function enqueue_script ( $script ) {
		wp_enqueue_script( self::PREFIX . $script );
	}

	/**
	 * Enqueues styles.
	 *
	 * @param string $style The name of the style to enqueue.
	 */
	public function enqueue_style ($style) {
		wp_enqueue_style( self::PREFIX . $style );
	}

	/**
	 * Calls the functions that register admin-scripts and admin-styles.
	 */
	public function register_assets() {
		$this->register_scripts();
		$this->register_styles();
	}

	/**
	 * Registers admin-scripts. Can be enqueued when they are needed.
	 */
	private function register_scripts() {
		wp_register_script( self::PREFIX . 'admin-script', plugins_url( 'js/wp-seo-admin' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
			'jquery',
			'jquery-ui-core',
		), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'admin-media', plugins_url( 'js/wp-seo-admin-media' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
			'jquery',
			'jquery-ui-core',
		), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'bulk-editor', plugins_url( 'js/wp-seo-bulk-editor' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'export', plugins_url( 'js/wp-seo-export' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'dismissible', plugins_url( 'js/wp-seo-dismissible' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'admin-global-script', plugins_url( 'js/wp-seo-admin-global' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '2.2.1', true );
		wp_register_script( self::PREFIX . 'metabox', plugins_url( 'js/wp-seo-metabox' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
			'jquery',
			'jquery-ui-core',
		), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'featured-image', plugins_url( 'js/wp-seo-featured-image' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array( 'jquery' ), WPSEO_VERSION, true );

		wp_register_script( self::PREFIX . 'metabox-taxonomypage', plugins_url( 'js/wp-seo-metabox' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
			'jquery',
			'jquery-ui-core',
			'jquery-ui-autocomplete',
		), WPSEO_VERSION, true );
		wp_register_script( self::PREFIX . 'admin-gsc', plugin_dir_url( WPSEO_FILE ) . 'js/wp-seo-admin-gsc' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
	}

	/**
	 * Registers admin-styles. Can be enqueued when they are needed.
	 */
	private function register_styles() {
		wp_register_style( self::PREFIX . 'admin-css', plugins_url( 'css/yst_plugin_tools' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'rtl', plugins_url( 'css/wpseo-rtl' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'dismissible', plugins_url( 'css/wpseo-dismissible' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'edit-page', plugins_url( 'css/edit-page' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'featured-image', plugins_url( 'css/featured-image' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'jquery-qtip.js', plugins_url( 'css/jquery.qtip.min.css', WPSEO_FILE ), array(), '2.2.1' );
		wp_register_style( self::PREFIX . 'metabox-css', plugins_url( 'css/metabox' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
		wp_register_style( self::PREFIX . 'wp-dashboard', plugins_url( 'css/dashboard' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
	}

}
