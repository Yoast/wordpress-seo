<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Manager
 */
abstract class WPSEO_Redirect_Manager {

	/**
	 * @var null
	 */
	protected $option_redirects = null;

	/**
	 * Get the Yoast SEO options
	 *
	 * @return array
	 */
	public static function get_options() {
		return apply_filters( 'wpseo_premium_redirect_options', wp_parse_args( get_option( 'wpseo_redirect', array() ), array(
			'disable_php_redirect' => 'off',
			'separate_file'        => 'off',
		) ) );
	}

	/**
	 * Getting array with the available redirect types
	 *
	 * @return array|void
	 */
	public static function get_redirect_types() {
		$redirect_types = array(
			'301' => '301 Moved Permanently',
			'302' => '302 Found',
			'307' => '307 Temporary Redirect',
			'410' => '410 Content Deleted',
		);

		return apply_filters( 'wpseo_premium_redirect_types', $redirect_types );
	}

	/**
	 * Change if the redirect option is autoloaded
	 *
	 * @param bool $enabled The value of the autoloading option.
	 */
	public function redirects_change_autoload( $enabled ) {
		global $wpdb;

		// Default autoload value.
		$autoload = 'yes';

		// Disable auto loading.
		if ( false === $enabled ) {
			$autoload = 'no';
		}

		// Do update query.
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

		// Skip redirect if WPSEO_DISABLE_PHP_REDIRECTS is true.
		if ( defined( 'WPSEO_DISABLE_PHP_REDIRECTS' ) && WPSEO_DISABLE_PHP_REDIRECTS ) {
			return false;
		}

		// Skip redirect if the 'disable_php_redirect' is set to 'on'.
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
		$redirects = apply_filters( 'wpseo_premium_get_redirects', get_option( $this->option_redirects ) );
		if ( ! is_array( $redirects ) ) {
			$redirects = array();
		}

		return $redirects;
	}

	/**
	 * Save the redirect
	 *
	 * @param array $redirects Array with redirects that will be saved.
	 */
	public function save_redirects( $redirects ) {

		// Update the database option.
		update_option( $this->option_redirects, apply_filters( 'wpseo_premium_save_redirects', $redirects ) );

		// Save the redirect file.
		$this->save_redirect_file();

	}

	/**
	 * Create the redirect file
	 */
	public function save_redirect_file() {

		// Options.
		$options = self::get_options();

		if ( 'on' == $options['disable_php_redirect'] ) {

			// Create the correct file object.
			$file = null;
			if ( WPSEO_Utils::is_apache() ) {

				if ( 'on' == $options['separate_file'] ) {
					$file = new WPSEO_Apache_Redirect_File();
				}
				else {
					$file = new WPSEO_Htaccess_Redirect_File();
				}
			}
			elseif ( WPSEO_Utils::is_nginx() ) {
				$file = new WPSEO_Nginx_Redirect_File();
			}

			// Save the file.
			if ( null !== $file ) {
				$file->save_file();
			}
		}

	}

	/**
	 * Clear the WPSEO added entries added in the .htaccess file
	 */
	public function clear_htaccess_entries() {

		$htaccess = '';
		if ( file_exists( WPSEO_Redirect_File_Manager::get_htaccess_file_path() ) ) {
			$htaccess = file_get_contents( WPSEO_Redirect_File_Manager::get_htaccess_file_path() );
		}

		$htaccess = preg_replace( '`# BEGIN YOAST REDIRECTS.*# END YOAST REDIRECTS' . PHP_EOL . '`is', '', $htaccess );

		// Get the $wp_filesystem object.
		$wp_filesystem = WPSEO_Redirect_File_Manager::get_wp_filesystem_object();

		// Check if the $wp_filesystem is correct.
		if ( null != $wp_filesystem ) {

			// Update the .htaccess file.
			$wp_filesystem->put_contents(
				WPSEO_Redirect_File_Manager::get_htaccess_file_path(),
				$htaccess,
				FS_CHMOD_FILE // Predefined mode settings for WP files.
			);

		}

	}

	/**
	 * Save the redirect
	 *
	 * @todo fix this method to work with the new redirect setup
	 *
	 * @param array $old_redirect_arr Array with values for the old redirect.
	 * @param array $new_redirect_arr Array with values for the new redirect.
	 */
	public function save_redirect( $old_redirect_arr, $new_redirect_arr ) {

		// Get redirects.
		$redirects = $this->get_redirects();

		// Remove old redirect.
		if ( isset( $redirects[ $old_redirect_arr['key'] ] ) ) {

			unset( $redirects[ $old_redirect_arr['key'] ] );

		}

		// Format the URL is it's an URL.
		if ( $this instanceof WPSEO_URL_Redirect_Manager ) {
			$new_redirect_arr['key'] = self::format_url( $new_redirect_arr['key'] );
		}

		// Add new redirect.
		$redirects[ $new_redirect_arr['key'] ] = array(
			'url'  => $new_redirect_arr['value'],
			'type' => $new_redirect_arr['type'],
		);

		// Save redirects.
		$this->save_redirects( $redirects );
	}

	/**
	 * Create a new redirect
	 *
	 * @param string $old_value The url that will be redirected.
	 * @param string $new_value The url where the old_url redirects to.
	 * @param int    $type      The type of the redirect.
	 *
	 * @return bool
	 */
	public function create_redirect( $old_value, $new_value, $type ) {

		// Get redirects.
		$redirects = $this->get_redirects();

		// Don't add redirect if already exists.
		if ( isset( $redirects[ $old_value ] ) ) {
			return false;
		}

		// Add new redirect.
		$redirects[ $old_value ] = array( 'url' => $new_value, 'type' => $type );

		// Save redirects.
		$this->save_redirects( $redirects );

		// Return true if success.
		return true;
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects Array with redirects that will be deleted.
	 */
	public function delete_redirect( $delete_redirects ) {

		$redirects = $this->get_redirects();

		if ( count( $redirects ) > 0 ) {
			if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
				foreach ( $delete_redirects as $delete_redirect ) {
					unset( $redirects[ $delete_redirect ] );
				}
			}
		}

		$this->save_redirects( $redirects );

	}

	/**
	 * Function that handles the AJAX 'wpseo_save_redirect' action
	 */
	public function ajax_handle_redirect_save() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Save the redirect.
		if ( $old_redirect_post = filter_input( INPUT_POST, 'old_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY )  && $new_redirect_post = filter_input( INPUT_POST, 'new_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) {

			// Decode old redirect.
			$old_redirect = array(
				'key'   => trim( htmlspecialchars_decode( urldecode( $old_redirect_post['key'] ) ) ),
				'value' => trim( htmlspecialchars_decode( urldecode( $old_redirect_post['value'] ) ) ),
				'type'  => urldecode( $old_redirect_post['type'] ),
			);

			// Decode new redirect.
			$new_redirect = array(
				'key'   => trim( htmlspecialchars_decode( urldecode( $new_redirect_post['key'] ) ) ),
				'value' => trim( htmlspecialchars_decode( urldecode( $new_redirect_post['value'] ) ) ),
				'type'  => urldecode( $new_redirect_post['type'] ),
			);

			// Save redirects in database.
			$this->save_redirect( $old_redirect, $new_redirect );
		}

		// Response.
		echo '1';
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_delete() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Delete the redirect.
		if ( $redirect_post = filter_input( INPUT_POST, 'redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) {
			$redirect = htmlspecialchars_decode( urldecode( $redirect_post['key'] ) );

			$this->delete_redirect( array( trim( $redirect ) ) );
		}

		// Response.
		echo esc_attr( strip_tags( filter_input( INPUT_POST, 'id' ) ) );
		exit;

	}

	/**
	 * Function that handles the AJAX 'wpseo_delete_redirect' action
	 */
	public function ajax_handle_redirect_create() {

		// Check nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$this->permission_check();

		// Save the redirect.
		if ( ( $old_url_post = filter_input( INPUT_POST, 'old_url' ) ) != '' && ( $new_url_post = filter_input( INPUT_POST, 'new_url' ) ) != '' && ( $type = filter_input( INPUT_POST, 'type' ) ) != '' ) {
			$old_url = htmlspecialchars_decode( urldecode( $old_url_post ) );
			$new_url = htmlspecialchars_decode( urldecode( $new_url_post ) );

			$this->create_redirect( trim( $old_url ), trim( $new_url ), $type );
		}

		$response = array(
			'id'      => filter_input( INPUT_POST, 'id' ),
			'old_url' => $old_url_post,
			'new_url' => $new_url_post,
		);

		// Response.
		echo json_encode( $response );
		exit;

	}

	/**
	 * Format the redirect url
	 *
	 * @param string $url The url that will be formatted.
	 *
	 * @return string
	 */
	public static function format_url( $url ) {
		$parsed_url = parse_url( $url );

		$formatted_url = '';
		if ( ! empty( $parsed_url['path'] ) ) {
			$formatted_url = $parsed_url['path'];
		}

		// Prepend a slash if first char != slash.
		if ( stripos( $formatted_url, '/' ) !== 0 ) {
			$formatted_url = '/' . $formatted_url;
		}

		// Append 'query' string if it exists.
		if ( isset( $parsed_url['query'] ) && '' != $parsed_url['query'] ) {
			$formatted_url .= '?' . $parsed_url['query'];
		}

		return apply_filters( 'wpseo_premium_format_admin_url', $formatted_url );
	}

	/**
	 * Checks whether the current user is allowed to do what he's doing
	 */
	private function permission_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			echo '0';
			exit;
		}
	}
}
