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
		static $options;

		if ( $options === null ) {
			$options = apply_filters(
				'wpseo_premium_redirect_options',
				wp_parse_args(
					get_option( 'wpseo_redirect', array() ),
					array(
						'disable_php_redirect' => 'off',
						'separate_file'        => 'off',
					)
				)
			);
		}

		return $options;
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
	 * @param array $redirects
	 */
	public function save_redirects( $redirects ) {

		// Update the database option.
		update_option( $this->option_redirects, apply_filters( 'wpseo_premium_save_redirects', $redirects ) );

		// Save the redirect file.
		$this->save_redirect_file();
	}

	/**
	 * Saving the redirect file
	 */
	public function save_redirect_file(  ) {
		$options = self::get_options();

		if ( 'on' !== $options['disable_php_redirect'] ) {
			$file_handler = new WPSEO_Redirect_File_Handler( $options['separate_file'] );
			$file_handler->save( $this->get_redirect_managers() );
		}
	}

	/**
	 *
	 * @param bool $autoload_value
	 */
	public function change_autoload( $autoload_value ) {
		$redirect_managers = $this->get_redirect_managers();

		foreach ( $redirect_managers as $redirect_manager ) {
			$redirect_manager->redirects_change_autoload( $autoload_value );
		}
	}

	/**
	 * Save the redirect
	 *
	 * @todo fix this method to work with the new redirect setup
	 *
	 * @param array $old_redirect_arr
	 * @param array $new_redirect_arr
	 */
	public function save_redirect( $old_redirect_arr, $new_redirect_arr ) {

		// Get redirects.
		$redirects = $this->get_redirects();

		// Remove old redirect.
		if ( isset( $redirects[ $old_redirect_arr['key'] ] ) ) {
			unset( $redirects[ $old_redirect_arr['key'] ] );
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
	 * @param string $old_value
	 * @param string $new_value
	 * @param int    $type
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
	 * @param array $delete_redirects
	 */
	public function delete_redirect( $delete_redirects ) {

		$redirects = $this->get_redirects();

		if ( count( $redirects ) > 0 && is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
			foreach ( $delete_redirects as $delete_redirect ) {
				unset( $redirects[ $delete_redirect ] );
			}

			$this->save_redirects( $redirects );
		}
	}

	/**
	 * Format the redirect url
	 *
	 * @param string $url
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
		if ( isset( $parsed_url['query'] ) && '' !== $parsed_url['query'] ) {
			$formatted_url .= '?' . $parsed_url['query'];
		}

		return apply_filters( 'wpseo_premium_format_admin_url', $formatted_url );
	}

	/**
	 * Getting the redirect managers
	 *
	 * @return WPSEO_Redirect_Manager[]
	 */
	protected function get_redirect_managers() {
		return array(
			'url'   => new WPSEO_URL_Redirect_Manager(),
			'regex' => new WPSEO_REGEX_Redirect_Manager(),
		);
	}

	/**
	 * Change if the redirect option is autoloaded
	 *
	 * @param bool $enabled
	 */
	private function redirects_change_autoload( $enabled ) {
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

}
