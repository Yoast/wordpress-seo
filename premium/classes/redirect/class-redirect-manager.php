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
	 * @var array
	 */
	private $redirects = array();

	/**
	 * Setting the property with the redirects
	 */
	public function __construct() {
		$this->set_redirects();
	}

	/**
	 * Get the redirects
	 *
	 * @return array
	 */
	public function get_redirects() {
		return ( is_array( $this->redirects ) ) ? $this->redirects : array();
	}

	/**
	 * Saving the redirect file
	 */
	public function save_redirect_file() {
		$options = WPSEO_Redirect::get_options();

		if ( 'on' !== $options['disable_php_redirect'] ) {
			$file_handler = new WPSEO_Redirect_File_Handler( $options['separate_file'] );
			$file_handler->save( $this->get_redirect_managers() );
		}
	}

	/**
	 * Changing the autoload value for the option
	 *
	 * @param bool $autoload_value
	 */
	public function change_option_autoload( $autoload_value ) {
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
	public function save_redirect( array $old_redirect_arr, array $new_redirect_arr ) {
		// Remove old redirect.
		if ( isset( $this->redirects[ $old_redirect_arr['key'] ] ) ) {
			unset( $this->redirects[ $old_redirect_arr['key'] ] );
		}

		// Add new redirect.
		$this->redirects[ $new_redirect_arr['key'] ] = array(
			'url'  => $new_redirect_arr['value'],
			'type' => $new_redirect_arr['type'],
		);

		// Save redirects.
		$this->save_redirects();
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
		// Don't add redirect if already exists.
		if ( isset( $this->redirects[ $old_value ] ) ) {
			return false;
		}

		// Add new redirect.
		$this->redirects[ $old_value ] = array( 'url' => $new_value, 'type' => $type );

		// Save redirects.
		$this->save_redirects();

		// Return true if success.
		return true;
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects
	 *
	 * @return bool
	 */
	public function delete_redirects( $delete_redirects ) {
		$redirects_deleted = false;

		if ( count( $this->redirects ) > 0 && is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
			foreach ( $delete_redirects as $delete_redirect ) {
				$this->delete_redirect( $delete_redirect );
			}

			$this->save_redirects();
		}

		return $redirects_deleted;
	}

	/**
	 * Delete the redirects
	 *
	 * @param string $delete_redirect
	 *
	 * @return bool
	 */
	public function delete_redirect( $delete_redirect ) {
		$delete_redirect = trim( $delete_redirect );
		if ( !empty( $this->redirects[ $delete_redirect ] ) ) {
			unset( $this->redirects[ $delete_redirect ] );

			return true;
		}

		return false;
	}

	/**
	 * Upgrade routine from Yoast SEO premium 1.2.0
	 */
	public function upgrade_1_2_0() {
		// Loop through the redirects.
		foreach ( $this->redirects as $old_url => $redirect ) {
			// Check if the redirect is not an array yet.
			if ( ! is_array( $redirect ) ) {
				$this->redirects[ $old_url ] = array( 'url' => $redirect, 'type' => '301' );
			}
		}

		// Save the URL redirects.
		$this->save_redirects();
	}

	/**
	 * Setting the redirects property
	 */
	protected function set_redirects() {
		$redirects = apply_filters( 'wpseo_premium_get_redirects', get_option( $this->option_redirects ) );
		if ( ! is_array( $redirects ) ) {
			$redirects = array();
		}

		$this->redirects =  $redirects;
	}

	/**
	 * Save the redirect
	 */
	protected function save_redirects() {
		// Update the database option.
		update_option( $this->option_redirects, apply_filters( 'wpseo_premium_save_redirects', $this->redirects ) );

		// Save the redirect file.
		$this->save_redirect_file();
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
