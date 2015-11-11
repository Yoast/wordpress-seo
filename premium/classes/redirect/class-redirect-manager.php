<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Manager
 */
abstract class WPSEO_Redirect_Manager {

	/**
	 * @var WPSEO_Redirect_Option Model object to handle the redirects.
	 */
	protected $redirect;

	/**
	 * @var string The redirect format, this might be plain or regex.
	 */
	protected $redirect_format;

	/**
	 * @var WPSEO_Redirect_Export[]
	 */
	protected $exporters;

	/**
	 * Returns an instance of the WPSEO_Redirect_Validator
	 *
	 * @return WPSEO_Redirect_Validator
	 */
	abstract public function get_validator();

	/**
	 * Returns the default exporters.
	 *
	 * @return WPSEO_Redirect_Export[]
	 */
	public static function default_exporters() {
		$exporters[] = new WPSEO_Redirect_Export_Option();

		$options = WPSEO_Redirect_Page::get_options();
		if ( 'on' !== $options['disable_php_redirect'] && $file_exporter = WPSEO_Redirect_File_Util::get_file_exporter( $options['separate_file'] ) ) {
			$exporters[] = $file_exporter;
		}

		return $exporters;
	}

	/**
	 * Setting the property with the redirects
	 *
	 * @param WPSEO_Redirect_Export[] $exporters The exporters used to save redirects in files.
	 */
	public function __construct( $exporters = array() ) {
		$this->redirect = new WPSEO_Redirect_Option();

		$this->redirect->set_format( $this->redirect_format );
		$this->redirect->set_redirects();

		$this->exporters = ( ! empty( $exporters ) ) ? $exporters : self::default_exporters();
	}

	/**
	 * Get the redirects
	 *
	 * @return WPSEO_Redirect[]
	 */
	public function get_redirects() {
		return $this->redirect->get_all();
	}

	/**
	 * Export the redirects to the specified sources.
	 */
	public function export_redirects() {
		$this->redirect->set_format( 'all' );

		$redirects = $this->redirect->get_all();
		foreach ( $this->exporters as $exporter ) {
			$exporter->export( $redirects );
		}
	}

	/**
	 * Changing the autoload value for the option
	 *
	 * @param bool $autoload_value The autoload value (true or false).
	 */
	public function change_option_autoload( $autoload_value ) {
		// The autoload value base on given boolean.
		$autoload = ( $autoload_value === false ) ? 'no' : 'yes';

		$this->redirect->change_autoload( $autoload, WPSEO_Redirect_Option::OPTION_PLAIN );
		$this->redirect->change_autoload( $autoload, WPSEO_Redirect_Option::OPTION_REGEX );
	}

	/**
	 * Save the redirect
	 *
	 * @param string $old_redirect_key The old redirect, the value is a key in the redirects array.
	 * @param array  $new_redirect     Array with values for the update redirect.
	 *
	 * @return WPSEO_Redirect|bool
	 */
	public function update_redirect( $old_redirect_key, array $new_redirect ) {
		if ( $redirect = $this->redirect->update( $old_redirect_key, $new_redirect['key'], $new_redirect['value'], $new_redirect['type'] ) ) {
			$this->save_redirects();

			// Always return the updated redirect.
			return $redirect;
		}

		return false;
	}

	/**
	 * Create a new redirect
	 *
	 * @param string $old_value The old value that will be redirected.
	 * @param string $new_value The target where the old value will redirect to.
	 * @param int    $type      Type of the redirect.
	 *
	 * @return WPSEO_Redirect|bool
	 */
	public function create_redirect( $old_value, $new_value, $type ) {
		if ( $redirect = $this->redirect->add( $old_value, $new_value, $type ) ) {
			$this->save_redirects();

			// Always return the added redirect.
			return $redirect;
		}

		return false;
	}

	/**
	 * Delete the redirects
	 *
	 * @param array $delete_redirects Array with the redirects to remove.
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
	 * This method will save the redirect option and if necessary the redirect file.
	 */
	public function save_redirects() {
		// Update the database option.
		$this->redirect->save();

		// Save the redirect file.
		$this->export_redirects();
	}

}
