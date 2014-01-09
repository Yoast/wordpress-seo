<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_Page_Redirect {

	/**
	 * Function that outputs the redirect page
	 */
	public static function display() {
		global $wpseo_admin_pages;

		// Get options
		$options = get_wpseo_options();

		// Admin header
		$wpseo_admin_pages->admin_header( false, 'yoast_wpseo_redirects_options', 'wpseo_redirects' );

		// Add new redirect HTML
		echo "<form id='wpseo-new-redirects-form' method='post'>\n";
			echo "<div class='wpseo_redirects_new'>\n";
			echo "<h2>" . __( 'Add new redirect', 'wordpress-seo' ) . "</h2>\n";

			echo "<label class='textinput' for='wpseo_redirects_new_old'>" . __( 'Old URL', 'wordpress-seo' ) . "</label>\n";
			echo "<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='' />\n";
			echo "<br class='clear'/>\n";

			echo "<label class='textinput' for='wpseo_redirects_new_new'>" . __( 'New URL', 'wordpress-seo' ) . "</label>\n";
			echo "<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />\n";
			echo "<br class='clear'/>\n";

			echo "<a href='javascript:;' class='button-primary'>" . __( 'Add redirect', 'wordpress-seo' ) . "</a>\n";

			echo "</div>\n";
		echo "</form>\n";

		// Open <form>
		echo "<form id='wpseo-redirects-table-form' method='post'>\n";

		// AJAX nonce
		echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

		// The list table
		$list_table = new WPSEO_Redirect_Table();
		$list_table->prepare_items();
		$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-redirect-search' );
		$list_table->display();

		// Close <form>
		echo "</form>\n";

		// Admin footer
		$wpseo_admin_pages->admin_footer( false );
	}

	/**
	 * Function that is triggered when the redirect page loads
	 */
	public static function page_load() {
		add_action( 'admin_enqueue_scripts', array( 'WPSEO_Page_Redirect', 'page_scripts' ) );
	}

	/**
	 * Load the admin redirects scripts
	 */
	public static function page_scripts() {
		wp_enqueue_script( 'wp-seo-premium-admin-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-redirects.js', array( 'jquery' ), '1.0.0' );
	}

}