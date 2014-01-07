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

}