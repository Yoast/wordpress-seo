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
	 * @var WPSEO_Redirect
	 */
	protected $redirect;

	/**
	 * Setting the property with the redirects
	 */
	public function __construct() {
		$this->redirect = new WPSEO_Redirect( $this->option_redirects );
	}

	/**
	 * Returns an instance of the WPSEO_Redirect_Validator
	 * @return WPSEO_Redirect_Validator
	 */
	abstract public function get_validator();

	/**
	 * Get the redirects
	 *
	 * @return array
	 */
	public function get_redirects() {
		return $this->redirect->get_all();
	}

	/**
	 * Saving the redirect file
	 */
	public function save_redirect_file() {
		$options = WPSEO_Redirect_Page::get_options();

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
	 * Search for given redirect
	 *
	 * @param string $redirect
	 *
	 * @return array|bool
	 */
	public function search( $redirect ) {
		if ( $found = $this->redirect->search( $redirect ) ) {
			return array_merge( array( 'redirect' => $redirect ), $found );
		}

		return false;
	}

	/**
	 * Save the redirect
	 *
	 * @todo fix this method to work with the new redirect setup
	 *
	 * @param string $old_redirect_key
	 * @param array  $new_redirect
	 *
	 * @return array|bool
	 */
	public function update_redirect( $old_redirect_key, array $new_redirect ) {
		if ( $this->redirect->update( $old_redirect_key, $new_redirect['key'], $new_redirect['value'], $new_redirect['type'] ) ) {
			$this->save_redirects();

			// Always return the updated redirect.
			return $this->search( $new_redirect['key'] );
		}

		return false;
	}

	/**
	 * Create a new redirect
	 *
	 * @param string $old_value
	 * @param string $new_value
	 * @param int    $type
	 *
	 * @return bool|array
	 */
	public function create_redirect( $old_value, $new_value, $type ) {
		if ( $this->redirect->add( $old_value, $new_value, $type ) ) {
			$this->save_redirects();

			// Always return the added redirect.
			return $this->search( $old_value );
		}

		return false;
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects
	 *
	 * @return bool
	 */
	public function delete_redirects( array $delete_redirects ) {
		$redirects_deleted = false;

		if ( is_array( $delete_redirects ) && count( $delete_redirects ) > 0 ) {
			foreach ( $delete_redirects as $delete_redirect ) {
				$redirects_deleted = $this->redirect->delete( $delete_redirect );
			}

			$this->save_redirects();
		}

		return $redirects_deleted;
	}

	/**
	 * Upgrade routine from Yoast SEO premium 1.2.0
	 */
	public function upgrade_1_2_0() {
		// Getting the redirects.
		$redirects = $this->redirect->get_all();

		// Loop through the redirects.
		foreach ( $redirects as $old_url => $redirect ) {
			// Check if the redirect is not an array yet.
			if ( ! is_array( $redirect ) ) {
				$redirects[ $old_url ] = $this->redirect->format( $redirect, '301' );
			}
		}
		// Set the redirect value with the reformated redirects.
		$this->redirect->set( $redirects );

		// Save the URL redirects.
		$this->save_redirects();
	}

	/**
	 * Save the redirect
	 */
	public function save_redirects() {
		// Update the database option.
		$this->redirect->save();

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
			'url'   => new WPSEO_Redirect_URL_Manager(),
			'regex' => new WPSEO_Redirect_Regex_Manager(),
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
