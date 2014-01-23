<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


class WPSEO_Redirect_Manager {

	const OPTION_REDIRECTS = 'wpseo-premium-redirects';

	/**
	 * Private constructor because this class only contains static functions
	 */
	private function __construct() {
	}

	/**
	 * Get the WordPress SEO options
	 *
	 * @return array
	 */
	public static function get_options() {
		return apply_filters( 'wpseo_premium_redirect_options', wp_parse_args( get_option( 'wpseo_redirect', array() ), array( 'disable_php_redirect' => 'off' ) ) );
	}

	/**
	 * Do the PHP redirect
	 */
	public static function do_redirects() {

		// Skip redirect if WPSEO_DISABLE_PHP_REDIRECTS is true
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && WPSEO_DISABLE_PHP_REDIRECTS ) {
			return;
		}

		// Skip redirect if the 'disable_php_redirect' is set to 'on'
		$options = self::get_options();
		if ( $options['disable_php_redirect'] == 'on' ) {
			return;
		}

		// Load redirects
		$redirects = get_option( self::OPTION_REDIRECTS, array() );

		// Do the actual redirect
		if ( count( $redirects ) > 0 ) {
			if ( isset ( $redirects[$_SERVER['REQUEST_URI']] ) ) {
				wp_redirect( $redirects[$_SERVER['REQUEST_URI']], 301 );
				exit;
			}
		}

	}

	/**
	 * Get the redirects
	 *
	 * @return array
	 */
	public static function get_redirects() {
		return apply_filters( 'wpseo_premium_get_redirects', get_option( self::OPTION_REDIRECTS, array() ) );
	}

	/**
	 * Save the redirect
	 *
	 * @param array $redirects
	 */
	public static function save_redirects( $redirects ) {

		// Update the database option
		update_option( self::OPTION_REDIRECTS, apply_filters( 'wpseo_premium_save_redirects', $redirects ) );

		// Create the correct file object
		$file = null;
		if ( wpseo_is_apache() ) {
			$file = new WPSEO_Apache_Redirect_File();
		} else {
			if ( wpseo_is_nginx() ) {
				$file = new WPSEO_Nginx_Redirect_File();
			}
		}

		// Save the file
		if ( null !== $file ) {
			$file->save_file();
		}
	}

	/**
	 * Save the redirect
	 *
	 * @param $old_redirect
	 * @param $new_redirect
	 */
	public static function save_redirect( $old_redirect_arr, $new_redirect_arr ) {

		// Get redirects
		$redirects = self::get_redirects();

		// Remove old redirect
		if ( isset( $redirects[$old_redirect_arr['key']] ) ) {
			unset( $redirects[$old_redirect_arr['key']] );
		}

		// Add new redirect
		$redirects[self::format_url( $new_redirect_arr['key'] )] = self::format_url( $new_redirect_arr['value'] );

		// Save redirects
		self::save_redirects( $redirects );
	}

	/**
	 * Create a new redirect
	 *
	 * @param String $old_value
	 * @param String $new_value
	 */
	public static function create_redirect( $old_value, $new_value ) {

		// Get redirects
		$redirects = self::get_redirects();

		// Add new redirect
		$redirects[$old_value] = $new_value;

		// Save redirects
		self::save_redirects( $redirects );

	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects
	 */
	public static function delete_redirect( $delete_redirects ) {

		$redirects = self::get_redirects();

		if ( count( $redirects ) > 0 ) {
			if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
				foreach ( $delete_redirects as $delete_redirects ) {
					unset( $redirects[$delete_redirects] );
				}
			}
		}

		self::save_redirects( $redirects );

	}

	/**
	 * Change if the redirect option is autoloaded
	 *
	 * @param bool $enabled
	 */
	public static function redirects_change_autoload( $enabled ) {
		global $wpdb;

		// Default autoload value
		$autoload = 'yes';

		// Disable auto loading
		if ( false === $enabled ) {
			$autoload = 'no';
		}

		// Do update query
		$wpdb->update(
				$wpdb->options,
				array( 'autoload' => $autoload ),
				array( 'option_name' => self::OPTION_REDIRECTS ),
				array( '%s' ),
				array( '%s' )
		);
	}

	/**
	 * Function that handles the AJAX 'wpseo_save_redirect' action
	 */
	public static function ajax_handle_redirect_save() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save the redirect
		if ( isset( $_POST['old_redirect'] ) && isset( $_POST['new_redirect'] ) ) {
			// Save redirects in database
			self::save_redirect( $_POST['old_redirect'], $_POST['new_redirect'] );
		}

		// Response
		echo '1';
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public static function ajax_handle_redirect_delete() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Delete the redirect
		if ( isset( $_POST['redirect'] ) ) {
			self::delete_redirect( array( $_POST['redirect']['key'] ) );
		}

		// Response
		echo '1';
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public static function ajax_handle_redirect_create() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save the redirect
		if ( isset( $_POST['old_redirect'] ) && isset( $_POST['new_redirect'] ) ) {
			self::create_redirect( $_POST['old_redirect'], $_POST['new_redirect'] );
		}

		// Response
		echo '1';
		exit;

	}

	/**
	 * Format the redirect url
	 *
	 * @param $url
	 *
	 * @return mixed
	 */
	public static function format_url( $url ) {
		$url = str_ireplace( site_url( '', 'http' ), '', $url );
		$url = str_ireplace( site_url( '', 'https' ), '', $url );

		return apply_filters( 'wpseo_premium_format_admin_url', $url );
	}

}
