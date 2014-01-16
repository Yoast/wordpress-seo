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

		// Admin header
		$wpseo_admin_pages->admin_header( false, 'yoast_wpseo_redirects_options', 'wpseo_redirects' );
		?>
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<a class="nav-tab" id="redirects-tab" href="#top#redirects"><?php _e( 'Redirects', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="settings-tab" href="#top#settings"><?php _e( 'Settings', 'wordpress-seo' ); ?></a>
		</h2>

		<div class="tabwrapper>">
			<div id="redirects" class="wpseotab">
				<?php
				echo '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
				if ( wpseo_is_nginx() ) {
					echo '<p>' . __( "As you're on NGINX, you should add the following include to the website Nginx config file:", 'wordpress-seo' ) . '</p>';
					echo '<pre>include ' . WPSEO_Redirect_File_Manager::get_file_path() . ';</pre>';
				} else {
					if ( wpseo_is_apache() ) {
						echo '<p>' . __( "As you're on Apache, you should add the following include to the website httpd config file:", 'wordpress-seo' ) . '</p>';
						echo '<pre>Include ' . WPSEO_Redirect_File_Manager::get_file_path() . '</pre>';
					}
				}
				echo '</div>';

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

				echo "<p class='desc'>&nbsp;</p>\n";

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
				?>
			</div>
			<div id="settings" class="wpseotab">
				<h2>Redirect Settings</h2>

				<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
					<?php
					settings_fields( 'yoast_wpseo_redirect_options' );
					$wpseo_admin_pages->currentoption = 'wpseo_redirect';

					echo $wpseo_admin_pages->checkbox( 'disable_php_redirect', __( 'Disable PHP redirects', 'wordpress-seo' ) );
					echo '<p class="desc">' . __( "WordPress SEO will generates redirect files that can be included in your website configuration, you can disable PHP redirect if this is done correctly. Only check this option if you know what your doing!", 'wordpress-seo' ) . '</p>';
					?>
					<p class="submit">
						<input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'wordpress-seo' ); ?>">
					</p>
				</form>
			</div>
		</div>
		<br class="clear">
		<?php

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

		add_screen_option( 'per_page', array( 'label' => 'Redirects per page', 'default' => 25, 'option' => 'redirects_per_page' ) );
	}

	public static function set_screen_option( $status, $option, $value ) {
		if ( 'redirects_per_page' == $option ) {
			return $value;
		}
	}

}