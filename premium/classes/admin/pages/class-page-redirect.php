<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Page_Redirect {


	public static function display() {
		global $wpseo_admin_pages;

		// Get options
		$options = get_wpseo_options();

		// Admin header
		$wpseo_admin_pages->admin_header( false, 'yoast_wpseo_redirects_options', 'wpseo_redirects' );

		// Check/set the search
		$search = null;
		if ( isset( $_POST['s'] ) && $_POST['s'] != '' ) {
			$search = $_POST['s'];
		}

		// Open <form>
		echo "<form id='wpseo-redirects-table-form' method='post'>\n";

		// AJAX nonce
		echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

		// The list table
		$list_table = new WPSEO_Redirect_Table();
		$list_table->set_search( $search );
		$list_table->prepare_items();
		$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-redirect-search' );
		$list_table->display();

		// Close <form>
		echo "</form>\n";

		// Admin footer
		$wpseo_admin_pages->admin_footer( false );
	}
	public static function page_load() {
		add_action( 'admin_enqueue_scripts', array( 'WPSEO_Page_Redirect', 'page_scripts' ) );
	}

	public static function page_scripts() {
		wp_enqueue_script( 'recipes', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-redirects.js', array( 'jquery' ), '1.0.0' );
	}

}