<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Manager
 */
class WPSEO_Redirect_Manager {

	/**
	 * @var WPSEO_Redirect_Option Model object to handle the redirects.
	 */
	protected $redirect_option;

	/**
	 * @var string The redirect format, this might be plain or regex.
	 */
	protected $redirect_format;

	/**
	 * @var WPSEO_Redirect_Export[]
	 */
	protected $exporters;

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
	 * @param string $redirect_format The format for the redirects.
	 */
	public function __construct( $redirect_format = WPSEO_Redirect::FORMAT_PLAIN ) {
		$this->redirect_option = new WPSEO_Redirect_Option();
		$this->redirect_format = $redirect_format;

		$this->redirect_option->set_format( $this->redirect_format );
		$this->redirect_option->set_redirects();
	}

	/**
	 * Setting the exporters
	 *
	 * @param WPSEO_Redirect_Export[] $exporters The exporters used to save redirects in files.
	 */
	public function set_exporters( $exporters ) {
		$this->exporters = $exporters;
	}

	/**
	 * Get the redirects
	 *
	 * @return WPSEO_Redirect[]
	 */
	public function get_redirects() {
		return $this->redirect_option->get_filtered_redirects();
	}

	/**
	 * Returns the redirect format
	 * @return string
	 */
	public function get_redirect_format() {
		return $this->redirect_format;
	}

	/**
	 * Export the redirects to the specified sources.
	 */
	public function export_redirects() {
		$redirects = $this->redirect_option->get_all();
		$exporters = ! empty( $this->exporters ) ? $this->exporters : self::default_exporters();

		foreach ( $exporters as $exporter ) {
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

		$this->redirect_option->change_autoload( $autoload, WPSEO_Redirect_Option::OPTION_PLAIN );
		$this->redirect_option->change_autoload( $autoload, WPSEO_Redirect_Option::OPTION_REGEX );
	}

	/**
	 * Create a new redirect
	 *
	 * @param WPSEO_Redirect $redirect The redirect object to add.
	 *
	 * @return bool
	 */
	public function create_redirect( WPSEO_Redirect $redirect ) {
		if ( $this->redirect_option->add( $redirect ) ) {
			$this->save_redirects();

			return true;
		}

		return false;
	}

	/**
	 * Save the redirect
	 *
	 * @param string         $current_origin The old redirect, the value is a key in the redirects array.
	 * @param WPSEO_Redirect $redirect       New redirect object.
	 *
	 * @return bool
	 */
	public function update_redirect( $current_origin, WPSEO_Redirect $redirect ) {
		if ( $this->redirect_option->update( $current_origin, $redirect ) ) {
			$this->save_redirects();

			return true;
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
		$deleted = false;
		foreach ( $delete_redirects as $delete_redirect ) {
			if ( $this->redirect_option->delete( $delete_redirect ) ) {
				$deleted = true;
			}
		}

		if ( $deleted === true ) {
			$this->save_redirects();
		}

		return $deleted;
	}

	/**
	 * Search for an origin in the redirects.
	 *
	 * @param string $origin The origin to search for.
	 *
	 * @return bool|WPSEO_Redirect
	 */
	public function search( $origin ) {
		return $this->redirect_option->search( $origin, $this->redirect_format );
	}

	/**
	 * This method will save the redirect option and if necessary the redirect file.
	 */
	public function save_redirects() {
		// Update the database option.
		$this->redirect_option->save();

		// Save the redirect file.
		$this->export_redirects();
	}

}
