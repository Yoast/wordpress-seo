<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


abstract class WPSEO_Redirect_Manager {

	protected $option_redirects = null;

	/**
	 * Get the WordPress SEO options
	 *
	 * @return array
	 */
	public static function get_options() {
		return apply_filters( 'wpseo_premium_redirect_options', wp_parse_args( get_option( 'wpseo_redirect', array() ), array(
					'disable_php_redirect' => 'off',
					'separate_file'        => 'off'
				) ) );
	}

	public static function get_redirect_types() {
		return apply_filters( 'wpseo_premium_redirect_types', array( '301', '302', '307' ) );
	}

	/**
	 * Change if the redirect option is autoloaded
	 *
	 * @param bool $enabled
	 */
	public function redirects_change_autoload( $enabled ) {
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
			array( 'option_name' => $this->option_redirects ),
			array( '%s' ),
			array( '%s' )
		);
	}

	/**
	 * Do the PHP redirect
	 *
	 * @return array
	 */
	protected function is_php_redirects_enabled() {

		// Skip redirect if WPSEO_DISABLE_PHP_REDIRECTS is true
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && WPSEO_DISABLE_PHP_REDIRECTS ) {
			return false;
		}

		// Skip redirect if the 'disable_php_redirect' is set to 'on'
		$options = self::get_options();
		if ( $options['disable_php_redirect'] == 'on' ) {
			return false;
		}

		return true;
	}

	/**
	 * Get the redirects
	 *
	 * @return array
	 */
	public function get_redirects() {
		return apply_filters( 'wpseo_premium_get_redirects', get_option( $this->option_redirects, array() ) );
	}

	/**
	 * Save the redirect
	 *
	 * @param array $redirects
	 */
	public function save_redirects( $redirects ) {

		// Update the database option
		update_option( $this->option_redirects, apply_filters( 'wpseo_premium_save_redirects', $redirects ) );

		// Options
		$options = self::get_options();

		if ( 'on' == $options['disable_php_redirect'] ) {

			// Create the correct file object
			$file = null;
			if ( wpseo_is_apache() ) {

				if ( 'on' == $options['separate_file'] ) {
					$file = new WPSEO_Apache_Redirect_File();
				}else {
					$file = new WPSEO_Htaccess_Redirect_File();
				}

			} elseif ( wpseo_is_nginx() ) {
				$file = new WPSEO_Nginx_Redirect_File();
			}

			// Save the file
			if ( null !== $file ) {
				$file->save_file();
			}

		}


	}

	/**
	 * Save the redirect
	 *
	 * @todo fix this method to work with the new redirect setup
	 *
	 * @param $old_redirect_arr
	 * @param $new_redirect_arr
	 *
	 * @return bool
	 */
	public function save_redirect( $old_redirect_arr, $new_redirect_arr ) {

		// Get redirects
		$redirects = $this->get_redirects();

		// Remove old redirect
		if ( isset( $redirects[ $old_redirect_arr['key'] ] ) ) {

			unset( $redirects[ $old_redirect_arr['key'] ] );

		}

		// Format the URL is it's an URL
		if ( $this instanceof WPSEO_URL_Redirect_Manager ) {
			$new_redirect_arr['key'] = self::format_url( $new_redirect_arr['key'] );
		}

		// Add new redirect
		$redirects[ $new_redirect_arr['key'] ] = $new_redirect_arr['value'];


		// Save redirects
		$this->save_redirects( $redirects );
	}

	/**
	 * Create a new redirect
	 *
	 * @param String $old_value
	 * @param String $new_value
	 * @param $type
	 *
	 * @return bool
	 */
	public function create_redirect( $old_value, $new_value, $type ) {

		// Get redirects
		$redirects = $this->get_redirects();

		// Don't add redirect if already exists
		if ( isset ( $redirects[ $old_value ] ) ) {
			return false;
		}

		// Add new redirect
		$redirects[ $old_value ] = array( 'url' => $new_value, 'type' => $type );

		// Save redirects
		$this->save_redirects( $redirects );

		// Return true if success
		return true;
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects
	 */
	public function delete_redirect( $delete_redirects ) {

		$redirects = $this->get_redirects();

		if ( count( $redirects ) > 0 ) {
			if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
				foreach ( $delete_redirects as $delete_redirects ) {
					unset( $redirects[ $delete_redirects ] );
				}
			}
		}

		$this->save_redirects( $redirects );

	}

	/**
	 * Function that handles the AJAX 'wpseo_save_redirect' action
	 */
	public function ajax_handle_redirect_save() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save the redirect
		if ( isset( $_POST['old_redirect'] ) && isset( $_POST['new_redirect'] ) ) {

			// Decode old redirect
			$old_redirect = array(
				'key'   => urldecode( $_POST['old_redirect']['key'] ),
				'value' => urldecode( $_POST['old_redirect']['value'] )
			);

			// Decode new redirect
			$new_redirect = array(
				'key'   => urldecode( $_POST['new_redirect']['key'] ),
				'value' => urldecode( $_POST['new_redirect']['value'] )
			);

			// Save redirects in database
			$this->save_redirect( $old_redirect, $new_redirect );
		}

		// Response
		echo '1';
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_delete() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Delete the redirect
		if ( isset( $_POST['redirect'] ) ) {
			$redirect = urldecode( $_POST['redirect']['key'] );
			$this->delete_redirect( array( $redirect ) );
		}

		// Response
		echo '1';
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_create() {

		// Check nonce
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		// Permission check
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}

		// Save the redirect
		if ( isset( $_POST['old_url'] ) && isset( $_POST['new_url'] ) && isset( $_POST['type'] ) ) {
			$old_url = urldecode( $_POST['old_url'] );
			$new_url = urldecode( $_POST['new_url'] );
			$type    = $_POST['type'];

			$this->create_redirect( $old_url, $new_url, $type );
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
		$parsed_url = parse_url( $url );

		// Prepend a slash if first char != slash
		if ( stripos( $parsed_url['path'], '/' ) !== 0 ) {
			$parsed_url['path'] = '/' . $parsed_url['path'];
		}

		return apply_filters( 'wpseo_premium_format_admin_url', $parsed_url['path'] );
	}

}
