<?php
/**
 * @package WPSEO\admin|google_search_console
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
		require_once 'views/gwt-display.php';
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public function page_load() {

		// Create a new WPSEO GWT Google Client
		$this->service  = new WPSEO_GWT_Service();

		$this->settings = new WPSEO_GWT_Settings( $this->service );

		add_action( 'admin_enqueue_scripts', array( $this, 'page_scripts' ) );

		// Catch bulk action request
		new WPSEO_Crawl_Issue_Bulk();
	}

	/**
	 * Display the table
	 *
	 * @param WPSEO_GWT_Platform_Tabs $platform_tabs
	 */
	public function display_table( WPSEO_GWT_Platform_Tabs $platform_tabs ) {
		// The list table
		$list_table = new WPSEO_Crawl_Issue_Table( $platform_tabs, $this->service );
		$list_table->prepare_items( );
		$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-crawl-issues-search' );
		$list_table->display();
	}

	/**
	 * Load the admin redirects scripts
	 */
	public function page_scripts() {
		wp_enqueue_script( 'wp-seo-admin-gsc', plugin_dir_url( WPSEO_FILE ) . 'js/wp-seo-admin-gsc' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION);
		wp_localize_script( 'wp-seo-admin-gsc', 'wpseo_gsc_strings', $this->strings() );
		add_screen_option( 'per_page', array(
			'label'   => __( 'Crawl errors per page', 'wordpress-seo' ),
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

	private function strings() {
		return array(
			'ajaxurl'               => admin_url( 'admin-ajax.php' ),
		);
	}

}
