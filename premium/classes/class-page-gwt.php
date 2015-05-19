<?php
/**
 * @package Premium\Redirect
 * @subpackage premium
 */

/**
 * Class WPSEO_Page_GWT
 */
class WPSEO_Page_GWT {

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * Function that outputs the redirect page
	 */
	public function display() {
		require_once WPSEO_PREMIUM_PATH . 'views/gwt-display.php';
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {

		// Create a new WPSEO GWT Google Client
		$this->service  = new WPSEO_GWT_Service();

		$this->settings = new WPSEO_GWT_Settings( $this->service );

		// Counting the issues
		new WPSEO_Crawl_Issue_Count( $this->service );

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );
	}

	/**
	 * Display the table
	 *
	 * @param WPSEO_GWT_Platform_Tabs $platform_tabs
	 */
	public function display_table( WPSEO_GWT_Platform_Tabs $platform_tabs ) {
		// The list table
		$list_table = new WPSEO_Crawl_Issue_Table( $platform_tabs );
		$list_table->prepare_items( );
		$list_table->search_box( __( 'Search', 'wordpress-seo-premium' ), 'wpseo-crawl-issues-search' );
		$list_table->display();
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wpseo-premium-yoast-overlay' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), '1.0.0' );
		wp_enqueue_script( 'wp-seo-premium-admin-gwt', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-gwt' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), '1.0.0' );
		wp_localize_script( 'wp-seo-premium-admin-gwt', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );
		add_screen_option( 'per_page', array(
			'label'   => __( 'Crawl errors per page', 'wordpress-seo-premium' ),
			'default' => 100,
			'option'  => 'errors_per_page',
		) );
	}
	/**
	 * Set the screen options
	 *
	 * @param string $status
	 * @param string $option
	 * @param string $value
	 *
	 * @return mixed
	 */
	public function set_screen_option( $status, $option, $value ) {
		if ( 'errors_per_page' == $option ) {
			return $value;
		}
	}

}
