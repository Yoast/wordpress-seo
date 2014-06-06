<?php
/**
 * @package Premium\Redirect
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


class WPSEO_Page_Redirect {

	/**
	 * Function that outputs the redirect page
	 */
	public static function display() {
		global $wpseo_admin_pages;

		// Check if there's an old URL set
		$old_url = '';
		if ( isset( $_GET['old_url'] ) ) {
			$old_url = urldecode( $_GET['old_url'] );
		}

		// Get the redirect types
		$redirect_types = WPSEO_Redirect_Manager::get_redirect_types();

		// Admin header
		$wpseo_admin_pages->admin_header( false, 'yoast_wpseo_redirects_options', 'wpseo_redirects' );
		?>
		<h2 class="nav-tab-wrapper" id="wpseo-tabs">
			<a class="nav-tab" id="tab-url-tab" href="#top#tab-url"><?php _e( 'Redirects', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="tab-regex-tab" href="#top#tab-regex"><?php _e( 'Regex Redirects', 'wordpress-seo' ); ?></a>
			<a class="nav-tab" id="settings-tab" href="#top#settings"><?php _e( 'Settings', 'wordpress-seo' ); ?></a>
		</h2>

		<div class="tabwrapper>">
			<div id="tab-url" class="wpseotab redirect-table-tab">
				<?php
				// Add new redirect HTML
				echo "<form class='wpseo-new-redirect-form' method='post'>\n";
				echo "<div class='wpseo_redirects_new'>\n";
				//				echo "<h2>" . __( 'Add New Redirect', 'wordpress-seo' ) . "</h2>\n";

				echo "<label class='textinput' for='wpseo_redirects_new_old'>" . __( 'Old URL', 'wordpress-seo' ) . "</label>\n";
				echo "<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='{$old_url}' />\n";
				echo "<br class='clear'/>\n";

				echo "<label class='textinput' for='wpseo_redirects_new_new'>" . __( 'New URL', 'wordpress-seo' ) . "</label>\n";
				echo "<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />\n";
				echo "<br class='clear'/>\n";

				echo "<label class='textinput' for='wpseo_redirects_new_type'>" . __( 'Type', 'wordpress-seo' ) . "</label>\n";

				// Redirect type select element
				echo "<select name='wpseo_redirects_new_type' id='wpseo_redirects_new_type' class='select'>" . PHP_EOL;

				// Loop through the redirect types
				if ( count( $redirect_types ) > 0 ) {
					foreach ( $redirect_types as $type => $desc ) {
						echo "<option value='" . $type . "'>" . $desc . "</option>" . PHP_EOL;
					}

				}

				echo "</select>" . PHP_EOL;

				echo '<img src="' . plugins_url( 'images/question-mark.png', WPSEO_FILE ) . '" class="yoast_help" style="margin:17px 0 0 5px" alt="'. __( sprintf( 'The redirect type is de HTTP response code send to the browser telling the browser what type of redirect is served.<br/><br/>Read <a href=\'%s\'>this page</a> for more info.', 'http://kb.yoast.com/article/121-redirect-types/#utm_source=wordpress-seo-premium-redirects&amp;utm_medium=inline-help&amp;utm_campaign=redirect-types' ), 'wordpress-seo' ) . '">';

				echo "<br class='clear'/>\n";

				echo "<a href='javascript:;' class='button-primary'>" . __( 'Add Redirect', 'wordpress-seo' ) . "</a>\n";

				echo "</div>\n";
				echo "</form>\n";

				echo "<p class='desc'>&nbsp;</p>\n";

				// Open <form>
				echo "<form id='url' class='wpseo-redirects-table-form' method='post' action=''>\n";

				// AJAX nonce
				echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

				// The list table
				$list_table = new WPSEO_Redirect_Table( 'URL' );
				$list_table->prepare_items();
				$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-redirect-search' );
				$list_table->display();

				// Close <form>
				echo "</form>\n";
				?>
			</div>
			<div id="tab-regex" class="wpseotab redirect-table-tab">
				<?php
				// Add new redirect HTML
				echo "<form class='wpseo-new-redirect-form' method='post'>\n";
				echo "<div class='wpseo_redirects_new'>\n";
				//				echo "<h2>" . __( 'Add New Regex Redirect', 'wordpress-seo' ) . "</h2>\n";

				echo "<label class='textinput' for='wpseo_redirects_new_old'>" . __( 'REGEX', 'wordpress-seo' ) . "</label>\n";
				echo "<input type='text' class='textinput' name='wpseo_redirects_new_old' id='wpseo_redirects_new_old' value='{$old_url}' />\n";
				echo "<br class='clear'/>\n";

				echo "<label class='textinput' for='wpseo_redirects_new_new'>" . __( 'URL', 'wordpress-seo' ) . "</label>\n";
				echo "<input type='text' class='textinput' name='wpseo_redirects_new_new' id='wpseo_redirects_new_new' value='' />\n";
				echo "<br class='clear'/>\n";


				echo "<label class='textinput' for='wpseo_redirects_new_type'>" . __( 'Type', 'wordpress-seo' ) . "</label>\n";
				// Redirect type select element
				echo "<select name='wpseo_redirects_new_type' id='wpseo_redirects_new_type' class='select'>" . PHP_EOL;

				// Loop through the redirect types
				if ( count( $redirect_types ) > 0 ) {
					foreach ( $redirect_types as $key => $desc ) {
						echo "<option value='" . $key . "'>" . $desc . "</option>" . PHP_EOL;
					}

				}

				echo "</select>" . PHP_EOL;

				echo '<img src="' . plugins_url( 'images/question-mark.png', WPSEO_FILE ) . '" class="yoast_help" style="margin:17px 0 0 5px" alt="'. __( sprintf( 'The redirect type is de HTTP response code send to the browser telling the browser what type of redirect is served.<br/><br/>Read <a href=\'%s\'>this page</a> for more info.', 'http://kb.yoast.com/article/121-redirect-types/#utm_source=wordpress-seo-premium-redirects&amp;utm_medium=inline-help&amp;utm_campaign=redirect-types' ), 'wordpress-seo' ) . '">';

				echo "<br class='clear'/>\n";

				echo "<a href='javascript:;' class='button-primary'>" . __( 'Add Regex Redirect', 'wordpress-seo' ) . "</a>\n";

				echo "</div>\n";
				echo "</form>\n";

				echo "<p class='desc'>&nbsp;</p>\n";

				// Open <form>
				echo "<form id='regex' class='wpseo-redirects-table-form' method='post' action=''>\n";

				// AJAX nonce
				echo "<input type='hidden' class='wpseo_redirects_ajax_nonce' value='" . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . "' />\n";

				// The list table
				$list_table = new WPSEO_Redirect_Table( 'REGEX' );
				$list_table->prepare_items();
				$list_table->search_box( __( 'Search', 'wordpress-seo' ), 'wpseo-redirect-search' );
				$list_table->display();

				// Close <form>
				echo "</form>\n";
				?>
			</div>
			<div id="settings" class="wpseotab">
				<?php

				// Get redirect options
				$redirect_options = WPSEO_Redirect_Manager::get_options();

				// Do file checks
				if ( 'on' == $redirect_options['disable_php_redirect'] ) {

					$file_write_error = false;

					if ( wpseo_is_apache() ) {

						if ( 'on' == $redirect_options['separate_file'] ) {
							if ( file_exists( WPSEO_Redirect_File_Manager::get_file_path() ) ) {
								echo '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
								echo '<p>' . __( "As you're on Apache, you should add the following include to the website httpd config file:", 'wordpress-seo' ) . '</p>';
								echo '<pre>Include ' . WPSEO_Redirect_File_Manager::get_file_path() . '</pre>';
								echo '</div>';
							} else {
								$file_write_error = true;
							}
						} else {
							if ( !is_writable( WPSEO_Redirect_File_Manager::get_htaccess_file_path() ) ) {
								echo "<div class='error'><p><b>" . __( "We're unable to save the redirects to your .htaccess file, please make the file writable.", 'wordpress-seo' ) . "</b></p></div>\n";
							}
						}

					} else if ( wpseo_is_nginx() ) {
						if ( file_exists( WPSEO_Redirect_File_Manager::get_file_path() ) ) {
							echo '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
							echo '<p>' . __( "As you're on NGINX, you should add the following include to the website Nginx config file:", 'wordpress-seo' ) . '</p>';
							echo '<pre>include ' . WPSEO_Redirect_File_Manager::get_file_path() . ';</pre>';
							echo '</div>';
						} else {
							$file_write_error = true;
						}
					}

					if ( $file_write_error ) {
						echo "<div class='error'><p><b>" . __( sprintf( "We're unable to save the redirect file to %s", WPSEO_Redirect_File_Manager::get_file_path() ), 'wordpress-seo' ) . "</b></p></div>\n";
					}

				}



				?>
				<h2>Redirect Settings</h2>

				<form action="<?php echo admin_url( 'options.php' ); ?>" method="post">
					<?php
					settings_fields( 'yoast_wpseo_redirect_options' );
					$wpseo_admin_pages->currentoption = 'wpseo_redirect';



					if ( wpseo_is_apache() ) {

						echo $wpseo_admin_pages->checkbox( 'disable_php_redirect', __( 'Disable PHP redirects', 'wordpress-seo' ) );
						echo '<p class="desc">' . __( "Write redirects to the .htaccess file. Make sure the .htaccess file is writable!", 'wordpress-seo' ) . '</p>';

						echo $wpseo_admin_pages->checkbox( 'separate_file', __( 'Generate a separate redirect file', 'wordpress-seo' ) );
						echo '<p class="desc">' . __( "By default we write the redirects to your .htaccess file, check this if you want a the redirects written to a separate file. Only check this option if you know what your doing!", 'wordpress-seo' ) . '</p>';
					}else {
						echo $wpseo_admin_pages->checkbox( 'disable_php_redirect', __( 'Disable PHP redirects', 'wordpress-seo' ) );
						echo '<p class="desc">' . __( "WordPress SEO will generate redirect files that can be included in your website configuration, you can disable PHP redirect if this is done correctly. Only check this option if you know what your doing!", 'wordpress-seo' ) . '</p>';
					}

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
		wp_enqueue_script( 'jquery-qtip', plugins_url( 'js/jquery.qtip.min.js', WPSEO_FILE ), array( 'jquery' ), '1.0.0-RC3', true );
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wpseo-premium-yoast-overlay.js', array( 'jquery' ), '1.0.0' );
		wp_enqueue_script( 'wp-seo-premium-admin-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . '/assets/js/wp-seo-premium-admin-redirects.js', array( 'jquery' ), '1.0.0' );
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );

		add_screen_option( 'per_page', array(
			'label'   => __( 'Redirects per page', 'wordpress-seo' ),
			'default' => 25,
			'option'  => 'redirects_per_page'
		) );
	}

	/**
	 * Catch redirects_per_page
	 *
	 * @param $status
	 * @param $option
	 * @param $value
	 *
	 * @return mixed
	 */
	public static function set_screen_option( $status, $option, $value ) {
		if ( 'redirects_per_page' == $option ) {
			return $value;
		}
	}

}