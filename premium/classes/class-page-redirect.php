<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Page_Redirect
 */
class WPSEO_Page_Redirect {

	/**
	 * Function that outputs the redirect page
	 */
	public static function display() {
		// Extracting the vars
		extract( self::get_view_vars() );

		require_once( WPSEO_PATH . 'premium/views/redirects.php' );
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
		wp_enqueue_script( 'wpseo-premium-yoast-overlay', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wpseo-premium-yoast-overlay' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		wp_enqueue_script( 'wp-seo-premium-admin-redirects', plugin_dir_url( WPSEO_PREMIUM_FILE ) . 'assets/js/wp-seo-premium-admin-redirects' . WPSEO_CSSJS_SUFFIX . '.js', array( 'jquery' ), WPSEO_VERSION );
		wp_localize_script( 'wp-seo-premium-admin-redirects', 'wpseo_premium_strings', WPSEO_Premium_Javascript_Strings::strings() );

		add_screen_option( 'per_page', array(
			'label'   => __( 'Redirects per page', 'wordpress-seo-premium' ),
			'default' => 25,
			'option'  => 'redirects_per_page',
		) );
	}

	/**
	 * Catch redirects_per_page
	 *
	 * @param string $status
	 * @param string $option
	 * @param string $value
	 *
	 * @return string|void
	 */
	public static function set_screen_option( $status, $option, $value ) {
		if ( 'redirects_per_page' === $option ) {
			return $value;
		}
	}

	/**
	 * Getting the variables for the view
	 *
	 * @return array
	 */
	private static function get_view_vars() {
		return array(
			'redirect_types'  => WPSEO_Redirect_Manager::get_redirect_types(),
			'nonce'           => wp_create_nonce( 'wpseo-redirects-ajax-security' ),
			'old_url'         => self::get_old_url(),
			'pre_settings'    => self::writable_redirect_file(),
		);
	}

	/**
	 * Check if it is possible to write to the files
	 *
	 * @return string
	 */
	private static function writable_redirect_file() {
		// Get redirect options.
		$redirect_options = WPSEO_Redirect_Manager::get_options();

		if ( 'on' !== $redirect_options['disable_php_redirect'] ) {
			return '';
		}

		// Do file checks.
		$file_path      = WPSEO_Redirect_File_Manager::get_file_path();
		$file_can_write = file_exists( $file_path );

		if ( WPSEO_Utils::is_apache() ) {
			if ( 'on' === $redirect_options['separate_file'] ) {
				if ( $file_can_write ) {
					$return  = '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
					$return .= '<p>' . __( "As you're on Apache, you should add the following include to the website httpd config file:", 'wordpress-seo-premium' ) . '</p>';
					$return .= '<pre>Include ' . $file_path . '</pre>';
					$return .= '</div>';

					return $return;
				}
			}
			else {
				if ( ! is_writable( WPSEO_Redirect_File_Manager::get_htaccess_file_path() ) ) {
					/* translators: %s: '.htaccess' file name */
					return "<div class='error'><p><strong>" . sprintf( __( 'We\'re unable to save the redirects to your %s file. Please make the file writable.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' ) . "</strong></p></div>\n";
				}
			}
		}

		if ( WPSEO_Utils::is_nginx() && $file_can_write ) {
			$return  = '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
			$return .= '<p>' . __( 'As you\'re on Nginx, you should add the following include to the NGINX config file:', 'wordpress-seo-premium' ) . '</p>';
			$return .= '<pre>include ' . $file_path . ';</pre>';
			$return .= '</div>';

			return $return;
		}

		return "<div class='error'><p><strong>" . __( sprintf( "We're unable to save the redirect file to %s", $file_path ), 'wordpress-seo-premium' ) . "</strong></p></div>\n";
	}

	/**
	 * Get the old url from the URL
	 *
	 * @return string
	 */
	private static function get_old_url() {
		// Check if there's an old URL set.
		if ( ( $old_url = filter_input( INPUT_GET, 'old_url', FILTER_DEFAULT, array( 'default' => '' ) ) ) !== '' ) {
			return esc_attr( urldecode( $old_url ) );
		}

		return '';
	}

}
